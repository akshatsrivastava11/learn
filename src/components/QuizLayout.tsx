"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Brain, ArrowLeft, ArrowRight, CheckCircle, XCircle, RotateCcw } from "lucide-react"
import { useState } from "react"

// Sample quiz data - you can replace this with your own questions
const sampleQuiz = {
  title: "Biology Quiz - Cell Structure",
  description: "Test your knowledge of cell biology and organelles",
  questions: [
    {
      id: 1,
      question: "What is the powerhouse of the cell?",
      options: ["Nucleus", "Mitochondria", "Ribosome", "Endoplasmic Reticulum"],
      correctAnswer: 1,
      explanation:
        "Mitochondria are known as the powerhouse of the cell because they produce ATP through cellular respiration.",
    },
    {
      id: 2,
      question: "Which organelle is responsible for protein synthesis?",
      options: ["Golgi Apparatus", "Lysosome", "Ribosome", "Vacuole"],
      correctAnswer: 2,
      explanation: "Ribosomes are the cellular structures responsible for protein synthesis by translating mRNA.",
    },
    {
      id: 3,
      question: "What controls what enters and exits the cell?",
      options: ["Cell Wall", "Cell Membrane", "Cytoplasm", "Nucleus"],
      correctAnswer: 1,
      explanation:
        "The cell membrane is selectively permeable and controls the movement of substances in and out of the cell.",
    },
    {
      id: 4,
      question: "Where is genetic material stored in eukaryotic cells?",
      options: ["Mitochondria", "Ribosome", "Nucleus", "Cytoplasm"],
      correctAnswer: 2,
      explanation:
        "In eukaryotic cells, genetic material (DNA) is stored in the nucleus, which is surrounded by a nuclear membrane.",
    },
    {
      id: 5,
      question: "Which structure gives plant cells their rigid shape?",
      options: ["Cell Membrane", "Cell Wall", "Vacuole", "Chloroplast"],
      correctAnswer: 1,
      explanation:
        "The cell wall, made primarily of cellulose, provides structural support and gives plant cells their rigid shape.",
    },
  ],
}

export default function QuizInterface() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([])
  const [showResults, setShowResults] = useState(false)
  const [quizStarted, setQuizStarted] = useState(false)

  const quiz = sampleQuiz
  const totalQuestions = quiz.questions.length
  const progress = ((currentQuestion + 1) / totalQuestions) * 100

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
      if (answer === quiz.questions[index].correctAnswer) {
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

  if (!quizStarted) {
    return (
      <div className="min-h-screen bg-black text-white">
        {/* Header */}
        <header className="bg-black border-b border-gray-200 px-6 py-4 text-white">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Brain className="h-8 w-8 text-white" />
              <span className="text-2xl font-bold text-white">LazyBrains</span>
            </div>
            <Button variant="outline" className="bg-black border-black hover:bg-black hover:text-white text-white">
              <ArrowLeft className="w-4 h-4 mr-2 text-white" />
              Back to Dashboard
            </Button>
          </div>
        </header>

        {/* Quiz Start Screen */}
        <div className="max-w-2xl mx-auto px-6 py-16 text-white">
          <Card className="bg-black border-gray-200 text-white">
            <CardHeader className="text-center text-white">
              <CardTitle className="text-3xl font-bold mb-4 text-white">{quiz.title}</CardTitle>
              <p className="text-white text-lg">{quiz.description}</p>
            </CardHeader>
            <CardContent className="text-center space-y-6 text-white">
              <div className="grid grid-cols-3 gap-4 text-center text-white">
                <div>
                  <div className="text-2xl font-bold text-white">{totalQuestions}</div>
                  <div className="text-sm text-white">Questions</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">~5</div>
                  <div className="text-sm text-white">Minutes</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">Multiple Choice</div>
                  <div className="text-sm text-white">Format</div>
                </div>
              </div>
              <Button size="lg" className="bg-black text-white hover:bg-gray-800" onClick={() => setQuizStarted(true)}>
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
      <div className="min-h-screen bg-gray text-white">
        {/* Header */}
        <header className="bg-black border-b border-gray-200 px-6 py-4 text-white">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Brain className="h-8 w-8 text-white" />
              <span className="text-2xl font-bold text-white">LazyBrains</span>
            </div>
            <Button variant="outline" className="bg-black border-black hover:bg-black hover:text-white text-white">
              <ArrowLeft className="w-4 h-4 mr-2 text-white" />
              Back to Dashboard
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
                <Button className="bg-black text-white hover:bg-gray-800" onClick={restartQuiz}>
                  <RotateCcw className="w-4 h-4 mr-2 text-white" />
                  Retake Quiz
                </Button>
                <Button variant="outline" className="bg-black border-black hover:bg-black hover:text-white text-white">
                  Review Answers
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Answer Review */}
          <div className="space-y-4 text-white">
            <h3 className="text-xl font-bold text-white">Answer Review</h3>
            {quiz.questions.map((question, index) => {
              const userAnswer = selectedAnswers[index]
              const isCorrect = userAnswer === question.correctAnswer

              return (
                <Card key={question.id} className="bg-black border-gray-200 text-white">
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
                            className={`p-2 rounded text-black ${isCorrect ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}
                          >
                            <span className="font-medium">Your answer: </span>
                            {question.options[userAnswer]}
                          </div>
                          {!isCorrect && (
                            <div className="p-2 rounded bg-green-50 border border-green-200 text-black">
                              <span className="font-medium">Correct answer: </span>
                              {question.options[question.correctAnswer]}
                            </div>
                          )}
                          <div className="text-sm text-black bg-gray-50 p-2 rounded">
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

  const currentQ = quiz.questions[currentQuestion]
  const selectedAnswer = selectedAnswers[currentQuestion]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-black border-b border-gray-200 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Brain className="h-8 w-8 " />
            <span className="text-2xl font-bold">LazyBrains</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-white">
              Question {currentQuestion + 1} of {totalQuestions}
            </span>
            <Button variant="outline" className="bg-black  border-black hover:bg-black hover:text-white">
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
              {currentQ.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                    selectedAnswer === index
                      ? "border-black bg-black text-white"
                      : "border-gray-200 hover:border-gray-300 bg-black text-white"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        selectedAnswer === index ? "border-black bg-black" : "border-gray-300"
                      }`}
                    >
                      {selectedAnswer === index && <div className="w-2 h-2 bg-black rounded-full"></div>}
                    </div>
                    <span className="text-lg">{option}</span>
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
            className="bg-black  border-black hover:bg-black hover:text-white disabled:opacity-50"
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
