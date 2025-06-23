"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Brain, ArrowLeft, ArrowRight, CheckCircle, XCircle, RotateCcw, AwardIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { useUser } from "@clerk/nextjs"

export default function QuizInterface() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([])
  const [showResults, setShowResults] = useState(false)
  const [quizStarted, setQuizStarted] = useState(false)
  const [quizzes, setQuizzes] = useState<any>([])
  const [quizzesLoading, setQuizzesLoading] = useState(true)
  const [selectedQuiz, setSelectedQuiz] = useState<string | null>(null)
  const [questions, setQuestions] = useState<any>([])
  const [quizLoaded, setQuizLoaded] = useState(false)

  // Get both user and loading state from Clerk
  const { user, isLoaded, isSignedIn } = useUser()

  // Process questions into quiz format
  const processedQuestions = questions.map((q: any) => ({
    id: q.id,
    question: q.Quesn,
    options: [q.Option1, q.Option2, q.Option3],
    correctAnswer: q.Option1 === q.Answer ? 0 : q.Option2 === q.Answer ? 1 : 2,
    explanation: `The correct answer is: ${q.Answer}`
  }))

  const totalQuestions = processedQuestions.length
  const progress = totalQuestions > 0 ? ((currentQuestion + 1) / totalQuestions) * 100 : 0

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers]
    newAnswers[currentQuestion] = answerIndex
    setSelectedAnswers(newAnswers)
  }

  const handleNext = () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      setShowResults(true)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const calculateScore = () => {
    let correct = 0
    selectedAnswers.forEach((answer, index) => {
      if (answer === processedQuestions[index].correctAnswer) {
        correct++
      }
    })
    return correct
  }

  const restartQuiz = () => {
    setCurrentQuestion(0)
    setSelectedAnswers([])
    setShowResults(false)
    setQuizStarted(false)
  }

  type QuizData = {
    createdAt: string,
    id: string,
  }

  const fetchUsersQuizes = async () => {
    if (!user || !isSignedIn) {
      setQuizzesLoading(false)
      return
    }
    
    try {
      console.log("Fetching quizzes for user:", user.id)
      const email = user.emailAddresses[0].emailAddress
      console.log("the email address", email)
      const response = await fetch("/api/fetchusersQuiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ "useremail": email }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      console.log(data.message);
      setQuizzes(data.message)
      console.log(quizzes)
      setQuizzesLoading(false)
    } catch (error) {
      setQuizzes([])
      setQuizzesLoading(false)
      console.error("Error fetching quizzes:", error)
    }
  }

  type ques = {
    id: string,
    Quesn: string,
    Answer: string,
    Option1: string,
    Option2: string,
    Option3: string
  }

  const FetchQuesnForQuiz = async (quizId: string) => {
    try {
      console.log("triggered");
      setQuizLoaded(false)
      const resp = await fetch("/api/fetchquizquesn", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ "quizId": quizId })
      })
      const fetchques = await resp.json()
      console.log("the fetched quesn is", fetchques.message)
      setQuestions(fetchques.message)
      console.log(questions)
      setQuizLoaded(true)
    } catch (error) {
      console.log("An error occured", error)
      setQuizLoaded(false)
    }
  }

  useEffect(() => {
    console.log("quiz is ", questions)
  }, [questions])
  
  useEffect(() => {
    (async () => {
      if (isLoaded && isSignedIn && user) {
        console.log("User loaded, fetching quizzes:", user)
        setQuizzesLoading(true)
        await fetchUsersQuizes()
      } else if (isLoaded && !isSignedIn) {
        console.log("User is not signed in")
      }
    })()
  }, [isLoaded, isSignedIn, user])

  // Show loading state while Clerk is loading
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <Brain className="h-12 w-12 text-white mx-auto mb-4 animate-pulse" />
          <p className="text-lg">Loading...</p>
        </div>
      </div>
    )
  }

  // Handle unauthenticated state
  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <Brain className="h-12 w-12 text-white mx-auto mb-4" />
          <p className="text-lg mb-4">Please sign in to take the quiz</p>
          <Button className="bg-white text-black hover:bg-gray-200">
            Sign In
          </Button>
        </div>
      </div>
    )
  }

  // Quiz selection UI
  if (!selectedQuiz) {
    if (quizzesLoading) {
      return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
          <Brain className="h-12 w-12 text-white mx-auto mb-4 animate-pulse" />
          <p className="text-lg">Loading quizzes...</p>
        </div>
      )
    }
    if (!Array.isArray(quizzes) || quizzes.length === 0) {
      return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
          <h1 className="text-2xl font-bold mb-6">No quizzes found</h1>
        </div>
      )
    }
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-6">Select a Quiz</h1>
        <div className="space-y-4 w-full max-w-md">
          {quizzes.map((quiz: any, idx: number) => (
            <button
              key={quiz.id}
              onClick={async () => {
                setSelectedQuiz(quiz.id)
                await FetchQuesnForQuiz(quiz.id)
              }}
              className="w-full p-4 rounded-lg bg-gray-900 border border-gray-700 hover:bg-gray-800 transition flex flex-col items-start"
            >
              <span className="text-lg font-semibold">Quiz {idx + 1}</span>
              <span className="text-xs text-gray-400 mt-1">Created at: {quiz.createdAt}</span>
            </button>
          ))}
        </div>
      </div>
    )
  }

  // If quiz is selected but questions are not loaded yet
  if (selectedQuiz && !quizLoaded) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <Brain className="h-12 w-12 text-white mx-auto mb-4 animate-pulse" />
          <p className="text-lg">Loading quiz questions...</p>
        </div>
      </div>
    )
  }

  // If no questions loaded
  if (processedQuestions.length === 0) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <Brain className="h-12 w-12 text-white mx-auto mb-4" />
          <p className="text-lg">No questions found for this quiz</p>
          <Button 
            className="mt-4 bg-white text-black hover:bg-gray-200"
            onClick={() => {
              setSelectedQuiz(null)
              setQuestions([])
              setQuizLoaded(false)
            }}
          >
            Back to Quiz Selection
          </Button>
        </div>
      </div>
    )
  }

  if (!quizStarted) {
    return (
      <div className="min-h-screen bg-black text-white">
        {/* Header */}
        <header className="bg-black border-b border-gray-200 px-6 py-4 text-white">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Brain className="h-8 w-8 text-white" />
              <span className="text-2xl font-bold text-white">Learn</span>
            </div>
            <div className="flex items-center space-x-4">
              {user && (
                <span className="text-sm text-gray-300">
                  Welcome, {user.firstName || user.emailAddresses[0].emailAddress}
                </span>
              )}
              <Button 
                variant="outline" 
                className="bg-black border-black hover:bg-black hover:text-white text-white"
                onClick={() => {
                  setSelectedQuiz(null)
                  setQuestions([])
                  setQuizLoaded(false)
                }}
              >
                <ArrowLeft className="w-4 h-4 mr-2 text-white" />
                Back to Quiz Selection
              </Button>
            </div>
          </div>
        </header>

        {/* Quiz Start Screen */}
        <div className="max-w-2xl mx-auto px-6 py-16 text-white">
          <Card className="bg-black border-gray-200 text-white">
            <CardHeader className="text-center text-white">
              <CardTitle className="text-3xl font-bold mb-4 text-white">Quiz Ready!</CardTitle>
              <p className="text-white text-lg">Test your knowledge with this quiz</p>
            </CardHeader>
            <CardContent className="text-center space-y-6 text-white">
              <div className="grid grid-cols-3 gap-4 text-center text-white">
                <div>
                  <div className="text-2xl font-bold text-white">{totalQuestions}</div>
                  <div className="text-sm text-white">Questions</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">~{Math.ceil(totalQuestions * 0.5)}</div>
                  <div className="text-sm text-white">Minutes</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">Multiple Choice</div>
                  <div className="text-sm text-white">Format</div>
                </div>
              </div>
              <Button size="lg" className="bg-white text-black hover:bg-gray-200" onClick={() => setQuizStarted(true)}>
                Start Quiz
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (showResults) {
    const score = calculateScore()
    const percentage = Math.round((score / totalQuestions) * 100)

    return (
      <div className="min-h-screen bg-black text-white">
        {/* Header */}
        <header className="bg-black border-b border-gray-200 px-6 py-4 text-white">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Brain className="h-8 w-8 text-white" />
              <span className="text-2xl font-bold text-white">Learn</span>
            </div>
            <Button 
              variant="outline" 
              className="bg-black border-black hover:bg-black hover:text-white text-white"
              onClick={() => {
                setSelectedQuiz(null)
                setQuestions([])
                setQuizLoaded(false)
                setQuizStarted(false)
                setShowResults(false)
                setCurrentQuestion(0)
                setSelectedAnswers([])
              }}
            >
              <ArrowLeft className="w-4 h-4 mr-2 text-white" />
              Back to Quiz Selection
            </Button>
          </div>
        </header>

        {/* Results Screen */}
        <div className="max-w-4xl mx-auto px-6 py-8 text-white">
          <Card className="bg-black border-gray-200 mb-6 text-white">
            <CardHeader className="text-center text-white">
              <CardTitle className="text-3xl font-bold mb-4 text-white">Quiz Complete!</CardTitle>
              <div className="text-6xl font-bold mb-2 text-white">{percentage}%</div>
              <p className="text-white">
                You got {score} out of {totalQuestions} questions correct
              </p>
            </CardHeader>
            <CardContent className="text-center text-white">
              <div className="flex justify-center space-x-4 mb-6">
                <Button className="bg-white text-black hover:bg-gray-200" onClick={restartQuiz}>
                  <RotateCcw className="w-4 h-4 mr-2 text-black" />
                  Retake Quiz
                </Button>
                <Button variant="outline" className="bg-black border-white hover:bg-gray-800 text-white">
                  Review Answers
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Answer Review */}
          <div className="space-y-4 text-white">
            <h3 className="text-xl font-bold text-white">Answer Review</h3>
            {processedQuestions.map((question: any, index: number) => {
              const userAnswer = selectedAnswers[index]
              const isCorrect = userAnswer === question.correctAnswer

              return (
                <Card key={question.id} className="bg-gray-900 border-gray-700 text-white">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-3 mb-4">
                      {isCorrect ? (
                        <CheckCircle className="w-6 h-6 text-green-500 mt-1" />
                      ) : (
                        <XCircle className="w-6 h-6 text-red-500 mt-1" />
                      )}
                      <div className="flex-1">
                        <h4 className="font-semibold mb-2 text-white">
                          Question {index + 1}: {question.question}
                        </h4>
                        <div className="space-y-2">
                          <div
                            className={`p-2 rounded ${isCorrect ? "bg-green-900 border border-green-700 text-green-100" : "bg-red-900 border border-red-700 text-red-100"}`}
                          >
                            <span className="font-medium">Your answer: </span>
                            {question.options[userAnswer]}
                          </div>
                          {!isCorrect && (
                            <div className="p-2 rounded bg-green-900 border border-green-700 text-green-100">
                              <span className="font-medium">Correct answer: </span>
                              {question.options[question.correctAnswer]}
                            </div>
                          )}
                          <div className="text-sm text-gray-300 bg-gray-800 p-2 rounded">
                            <span className="font-medium">Explanation: </span>
                            {question.explanation}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  const currentQ = processedQuestions[currentQuestion]
  const selectedAnswer = selectedAnswers[currentQuestion]

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="bg-black border-b border-black px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Brain className="h-8 w-8 text-white" />
            <span className="text-2xl font-bold text-white">LazyBrains</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-white">
              Question {currentQuestion + 1} of {totalQuestions}
            </span>
            <Button 
              variant="outline" 
              className="bg-black border-black hover:bg-gray-800 text-white"
              onClick={() => {
                setSelectedQuiz(null)
                setQuestions([])
                setQuizLoaded(false)
                setQuizStarted(false)
                setCurrentQuestion(0)
                setSelectedAnswers([])
              }}
            >
              Exit Quiz
            </Button>
          </div>
        </div>
      </header>

      {/* Quiz Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Progress</span>
            <span className="text-sm text-gray-500">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question Card */}
        <Card className="bg-black border-gray-200 mb-6">
          <CardHeader>
            <CardTitle className="text-xl text-white">Question {currentQuestion + 1}</CardTitle>
          </CardHeader>
          <CardContent>
            <h2 className="text-2xl font-semibold mb-6 text-white">{currentQ.question}</h2>

            {/* Answer Options */}
            <div className="space-y-3">
              {currentQ.options.map((option: string, index: number) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                    selectedAnswer === index
                      ? "border-green-900 bg-black text-green-900"
                      : "border-gray-200 hover:border-gray-300 bg-black text-gray-900"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        selectedAnswer === index ? "border-blue-500 bg-blue-500" : "border-gray-300"
                      }`}
                    >
                      {selectedAnswer === index && <div className="w-2 h-2 bg-white rounded-full"></div>}
                    </div>
                    <span className="text-lg text-white">{option}</span>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          <span className="text-sm text-gray-500">
            {currentQuestion + 1} / {totalQuestions}
          </span>

          <Button
            onClick={handleNext}
            disabled={selectedAnswer === undefined}
            className="bg-black text-white hover:bg-gray-800 disabled:opacity-50"
          >
            {currentQuestion === totalQuestions - 1 ? "Finish Quiz" : "Next"}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  )
}