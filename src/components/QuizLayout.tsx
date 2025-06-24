"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Brain, ArrowLeft, ArrowRight, CheckCircle, XCircle, RotateCcw, MessageCircle, Send } from "lucide-react"
import { useEffect, useState } from "react"
import { useUser } from "@clerk/nextjs"
import { GoogleGenAI } from "@google/genai"
export default function QuizInterface() {

  const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY })
  const generateResponseFromGemini = async (content: string) => {
    const response = await ai.models.generateContent({
      contents: content,
      model: "gemini-2.5-flash",
    })
    return response.text
  }
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([])
  const [showResults, setShowResults] = useState(false)
  const [quizStarted, setQuizStarted] = useState(false)
  const [quizzes, setQuizzes] = useState<any>([])
  const [quizzesLoading, setQuizzesLoading] = useState(true)
  const [selectedQuiz, setSelectedQuiz] = useState<string | null>(null)
  const [questions, setQuestions] = useState<any>([])
  const [quizLoaded, setQuizLoaded] = useState(false)
  const [flipped, setFlipped] = useState<{ [quizId: string]: boolean }>({})

  // Chat states
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [chatMessages, setChatMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([])
  const [chatInput, setChatInput] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)

  // Get both user and loading state from Clerk
  const { user, isLoaded, isSignedIn } = useUser()

  // AI function (you'll need to implement this based on your AI service)
  const generateAIResponse = async (message: string) => {
    // Replace this with your actual AI service call
    // For example, if you're using OpenAI, Gemini, or another service
    try {
      // Placeholder - replace with your actual AI API call
     const response=await generateResponseFromGemini(message);
     console.log("response is",response)
     
      // const data = response.text
      return response|| "I'm here to help with your quiz questions!"
    } catch (error) {
      return "Sorry, I'm having trouble responding right now. Please try again."
    }
  }

  const handleSendMessage = async () => {
    if (!chatInput.trim() || isGenerating) return

    const userMessage = chatInput.trim()
    setChatInput("")
    // const message=generateAIResponse(userMessage);
    // Add user message to chat
    setChatMessages((prev) => [...prev, { role: "user", content: userMessage }])

    setIsGenerating(true)

    try {
      const response = await generateAIResponse(userMessage)
      setChatMessages((prev) => [...prev, { role: "assistant", content: response }])
    } catch (error) {
      console.error("Error generating response:", error)
      setChatMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, I encountered an error. Please try again." },
      ])
    } finally {
      setIsGenerating(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  // Process questions into quiz format
  const processedQuestions = questions.map((q: any) => ({
    id: q.id,
    question: q.Quesn,
    options: [q.Option1, q.Option2, q.Option3],
    correctAnswer: q.Option1 === q.Answer ? 0 : q.Option2 === q.Answer ? 1 : 2,
    explanation: `The correct answer is: ${q.Answer}`,
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
    createdAt: string
    id: string
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
        body: JSON.stringify({ useremail: email }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log(data.message)
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
    id: string
    Quesn: string
    Answer: string
    Option1: string
    Option2: string
    Option3: string
  }

  const FetchQuesnForQuiz = async (quizId: string) => {
    try {
      console.log("triggered")
      setQuizLoaded(false)
      const resp = await fetch("/api/fetchquizquesn", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quizId: quizId }),
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
    ;(async () => {
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
          <Button className="bg-white text-black hover:bg-gray-200">Sign In</Button>
        </div>
      </div>
    )
  }

  // Quiz selection UI - Updated to match flashcard layout
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

    // Quiz selection with flashcard-style layout
    return (
      <div className="min-h-screen bg-transparent text-white relative">
        <h1 className="text-4xl font-extrabold mt-10 mb-8 text-center tracking-tight drop-shadow-lg">Quizzes</h1>

        <div className="max-w-5xl mx-auto px-6">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {quizzes.map((quiz: any, idx: number) => (
              <div
                key={quiz.id}
                className="relative w-full h-64 cursor-pointer perspective"
                onClick={() => setFlipped((prev) => ({ ...prev, [quiz.id]: !prev[quiz.id] }))}
              >
                <div
                  className={`absolute inset-0 transition-transform duration-500 transform-style-preserve-3d ${flipped[quiz.id] ? "rotate-y-180" : ""}`}
                >
                  {/* Front Side - Quiz Info */}
                  <div className="absolute inset-0 bg-gray-900 border border-gray-700 rounded-xl p-6 flex flex-col justify-center items-center backface-hidden">
                    <span className="text-xs uppercase tracking-wider text-gray-400 mb-4">Quiz</span>
                    <h2 className="text-lg font-semibold text-center mb-4">{quiz.QuizName}</h2>
                    <span className="text-xs text-gray-400 mb-4">
                      Created: {new Date(quiz.createdAt).toLocaleDateString()}
                    </span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-blue-900 text-blue-400 border border-blue-800">
                      Multiple Choice
                    </span>
                    <p className="mt-4 text-xs text-gray-500">Tap to flip for options</p>
                  </div>

                  {/* Back Side - Start Quiz */}
                  <div className="absolute inset-0 bg-gray-900 border border-green-700 rounded-xl p-6 flex flex-col justify-center items-center rotate-y-180 backface-hidden">
                    <span className="text-xs uppercase tracking-wider text-green-400 mb-4">Ready to Start</span>
                    <Button
                      className="bg-green-600 hover:bg-green-700 text-white mb-4"
                      onClick={async (e) => {
                        e.stopPropagation()
                        setSelectedQuiz(quiz.id)
                        await FetchQuesnForQuiz(quiz.id)
                      }}
                    >
                      Start Quiz
                    </Button>
                    <p className="text-xs text-gray-400 text-center">Click to begin your quiz session</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Floating Chat Button */}
        <Dialog open={isChatOpen} onOpenChange={setIsChatOpen}>
          <DialogTrigger asChild>
            <Button
              className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg z-50"
              size="icon"
            >
              <MessageCircle className="w-6 h-6" />
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-md h-[500px] fixed bottom-20 right-6 top-auto left-auto transform-none">
            <DialogHeader>
              <DialogTitle className="text-white flex items-center gap-2">
                <Brain className="w-5 h-5" />
                Quiz Assistant
              </DialogTitle>
            </DialogHeader>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto space-y-4 bg-gray-800 rounded-lg p-4 max-h-80">
              {chatMessages.length === 0 ? (
                <div className="text-gray-400 text-center py-4">
                  Hi! I'm here to help with your quiz questions. Ask me anything!
                </div>
              ) : (
                chatMessages.map((message, index) => (
                  <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.role === "user" ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-100"
                      }`}
                    >
                      <div className="text-xs font-medium mb-1">{message.role === "user" ? "You" : "Assistant"}</div>
                      <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                    </div>
                  </div>
                ))
              )}
              {isGenerating && (
                <div className="flex justify-start">
                  <div className="bg-gray-700 text-gray-100 rounded-lg p-3 max-w-[80%]">
                    <div className="text-xs font-medium mb-1">Assistant</div>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Chat Input */}
            <div className="flex gap-2 mt-4">
              <textarea
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about the quiz..."
                className="flex-1 bg-gray-800 text-white border border-gray-600 rounded-lg p-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                rows={2}
                disabled={isGenerating}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!chatInput.trim() || isGenerating}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3"
                size="sm"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <style jsx global>{`
          .perspective { perspective: 1200px; }
          .transform-style-preserve-3d { transform-style: preserve-3d; }
          .rotate-y-180 { transform: rotateY(180deg); }
          .backface-hidden { backface-visibility: hidden; }
        `}</style>
      </div>
    )
  }

  // If quiz is selected but questions are not loaded yet
  if (selectedQuiz && !quizLoaded) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center relative">
        <div className="text-center">
          <Brain className="h-12 w-12 text-white mx-auto mb-4 animate-pulse" />
          <p className="text-lg">Loading quiz questions...</p>
        </div>

        {/* Floating Chat Button */}
        <Dialog open={isChatOpen} onOpenChange={setIsChatOpen}>
          <DialogTrigger asChild>
            <Button
              className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg z-50"
              size="icon"
            >
              <MessageCircle className="w-6 h-6" />
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-md h-[500px] fixed bottom-20 right-6 top-auto left-auto transform-none">
            <DialogHeader>
              <DialogTitle className="text-white flex items-center gap-2">
                <Brain className="w-5 h-5" />
                Quiz Assistant
              </DialogTitle>
            </DialogHeader>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto space-y-4 bg-gray-800 rounded-lg p-4 max-h-80">
              {chatMessages.length === 0 ? (
                <div className="text-gray-400 text-center py-4">
                  Hi! I'm here to help with your quiz questions. Ask me anything!
                </div>
              ) : (
                chatMessages.map((message, index) => (
                  <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.role === "user" ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-100"
                      }`}
                    >
                      <div className="text-xs font-medium mb-1">{message.role === "user" ? "You" : "Assistant"}</div>
                      <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                    </div>
                  </div>
                ))
              )}
              {isGenerating && (
                <div className="flex justify-start">
                  <div className="bg-gray-700 text-gray-100 rounded-lg p-3 max-w-[80%]">
                    <div className="text-xs font-medium mb-1">Assistant</div>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Chat Input */}
            <div className="flex gap-2 mt-4">
              <textarea
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about the quiz..."
                className="flex-1 bg-gray-800 text-white border border-gray-600 rounded-lg p-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                rows={2}
                disabled={isGenerating}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!chatInput.trim() || isGenerating}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3"
                size="sm"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    )
  }

  // If no questions loaded
  if (processedQuestions.length === 0) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center relative">
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

        {/* Floating Chat Button */}
        <Dialog open={isChatOpen} onOpenChange={setIsChatOpen}>
          <DialogTrigger asChild>
            <Button
              className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg z-50"
              size="icon"
            >
              <MessageCircle className="w-6 h-6" />
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-md h-[500px] fixed bottom-20 right-6 top-auto left-auto transform-none">
            <DialogHeader>
              <DialogTitle className="text-white flex items-center gap-2">
                <Brain className="w-5 h-5" />
                Quiz Assistant
              </DialogTitle>
            </DialogHeader>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto space-y-4 bg-gray-800 rounded-lg p-4 max-h-80">
              {chatMessages.length === 0 ? (
                <div className="text-gray-400 text-center py-4">
                  Hi! I'm here to help with your quiz questions. Ask me anything!
                </div>
              ) : (
                chatMessages.map((message, index) => (
                  <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.role === "user" ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-100"
                      }`}
                    >
                      <div className="text-xs font-medium mb-1">{message.role === "user" ? "You" : "Assistant"}</div>
                      <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                    </div>
                  </div>
                ))
              )}
              {isGenerating && (
                <div className="flex justify-start">
                  <div className="bg-gray-700 text-gray-100 rounded-lg p-3 max-w-[80%]">
                    <div className="text-xs font-medium mb-1">Assistant</div>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Chat Input */}
            <div className="flex gap-2 mt-4">
              <textarea
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about the quiz..."
                className="flex-1 bg-gray-800 text-white border border-gray-600 rounded-lg p-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                rows={2}
                disabled={isGenerating}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!chatInput.trim() || isGenerating}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3"
                size="sm"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    )
  }

  if (!quizStarted) {
    return (
      <div className="min-h-screen bg-transparent text-white relative">
        {/* Quiz Start Screen */}
        <div className="max-w-2xl mx-auto px-6 py-16 text-white">
          <Card className="bg-gray-900 border-gray-700 text-white">
            <CardHeader className="text-center text-white">
              <CardTitle className="text-3xl font-bold mb-4 text-white">Quiz Ready!</CardTitle>
              <p className="text-white text-lg">Test your knowledge with this quiz</p>
            </CardHeader>
            <CardContent className="text-center space-y-6 text-white">
              <div className="grid grid-cols-3 gap-4 text-center text-white">
                <div>
                  <div className="text-2xl font-bold text-white">{totalQuestions}</div>
                  <div className="text-sm text-gray-400">Questions</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">~{Math.ceil(totalQuestions * 0.5)}</div>
                  <div className="text-sm text-gray-400">Minutes</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">Multiple Choice</div>
                  <div className="text-sm text-gray-400">Format</div>
                </div>
              </div>
              <Button
                size="lg"
                className="bg-blue-600 text-white hover:bg-blue-700"
                onClick={() => setQuizStarted(true)}
              >
                Start Quiz
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Floating Chat Button */}
        <Dialog open={isChatOpen} onOpenChange={setIsChatOpen}>
          <DialogTrigger asChild>
            <Button
              className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg z-50"
              size="icon"
            >
              <MessageCircle className="w-6 h-6" />
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-md h-[500px] fixed bottom-20 right-6 top-auto left-auto transform-none">
            <DialogHeader>
              <DialogTitle className="text-white flex items-center gap-2">
                <Brain className="w-5 h-5" />
                Quiz Assistant
              </DialogTitle>
            </DialogHeader>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto space-y-4 bg-gray-800 rounded-lg p-4 max-h-80">
              {chatMessages.length === 0 ? (
                <div className="text-gray-400 text-center py-4">
                  Hi! I'm here to help with your quiz questions. Ask me anything!
                </div>
              ) : (
                chatMessages.map((message, index) => (
                  <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.role === "user" ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-100"
                      }`}
                    >
                      <div className="text-xs font-medium mb-1">{message.role === "user" ? "You" : "Assistant"}</div>
                      <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                    </div>
                  </div>
                ))
              )}
              {isGenerating && (
                <div className="flex justify-start">
                  <div className="bg-gray-700 text-gray-100 rounded-lg p-3 max-w-[80%]">
                    <div className="text-xs font-medium mb-1">Assistant</div>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Chat Input */}
            <div className="flex gap-2 mt-4">
              <textarea
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about the quiz..."
                className="flex-1 bg-gray-800 text-white border border-gray-600 rounded-lg p-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                rows={2}
                disabled={isGenerating}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!chatInput.trim() || isGenerating}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3"
                size="sm"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    )
  }

  if (showResults) {
    const score = calculateScore()
    const percentage = Math.round((score / totalQuestions) * 100)

    return (
      <div className="min-h-screen bg-transparent text-white relative">
        {/* Results Screen */}
        <div className="max-w-4xl mx-auto px-6 py-8 text-white">
          <Card className="bg-gray-900 border-gray-700 mb-6 text-white">
            <CardHeader className="text-center text-white">
              <CardTitle className="text-3xl font-bold mb-4 text-white">Quiz Complete!</CardTitle>
              <div className="text-6xl font-bold mb-2 text-white">{percentage}%</div>
              <p className="text-gray-300">
                You got {score} out of {totalQuestions} questions correct
              </p>
            </CardHeader>
            <CardContent className="text-center text-white">
              <div className="flex justify-center space-x-4 mb-6">
                <Button className="bg-blue-600 text-white hover:bg-blue-700" onClick={restartQuiz}>
                  <RotateCcw className="w-4 h-4 mr-2 text-white" />
                  Retake Quiz
                </Button>
                <Button
                  variant="outline"
                  className="bg-transparent border-gray-600 hover:bg-gray-800 text-white"
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

        {/* Floating Chat Button */}
        <Dialog open={isChatOpen} onOpenChange={setIsChatOpen}>
          <DialogTrigger asChild>
            <Button
              className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg z-50"
              size="icon"
            >
              <MessageCircle className="w-6 h-6" />
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-md h-[500px] fixed bottom-20 right-6 top-auto left-auto transform-none">
            <DialogHeader>
              <DialogTitle className="text-white flex items-center gap-2">
                <Brain className="w-5 h-5" />
                Quiz Assistant
              </DialogTitle>
            </DialogHeader>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto space-y-4 bg-gray-800 rounded-lg p-4 max-h-80">
              {chatMessages.length === 0 ? (
                <div className="text-gray-400 text-center py-4">
                  Hi! I'm here to help with your quiz questions. Ask me anything!
                </div>
              ) : (
                chatMessages.map((message, index) => (
                  <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.role === "user" ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-100"
                      }`}
                    >
                      <div className="text-xs font-medium mb-1">{message.role === "user" ? "You" : "Assistant"}</div>
                      <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                    </div>
                  </div>
                ))
              )}
              {isGenerating && (
                <div className="flex justify-start">
                  <div className="bg-gray-700 text-gray-100 rounded-lg p-3 max-w-[80%]">
                    <div className="text-xs font-medium mb-1">Assistant</div>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Chat Input */}
            <div className="flex gap-2 mt-4">
              <textarea
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about the quiz..."
                className="flex-1 bg-gray-800 text-white border border-gray-600 rounded-lg p-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                rows={2}
                disabled={isGenerating}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!chatInput.trim() || isGenerating}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3"
                size="sm"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    )
  }

  const currentQ = processedQuestions[currentQuestion]
  const selectedAnswer = selectedAnswers[currentQuestion]

  return (
    <div className="min-h-screen bg-transparent text-white relative">
      {/* Quiz Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-300">Progress</span>
            <span className="text-sm text-gray-400">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2 bg-gray-800" />
        </div>

        {/* Question Card */}
        <Card className="bg-gray-900 border-gray-700 mb-6">
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
                      ? "border-blue-500 bg-blue-900/20 text-blue-200"
                      : "border-gray-600 hover:border-gray-500 bg-gray-800 text-gray-200 hover:bg-gray-700"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        selectedAnswer === index ? "border-blue-500 bg-blue-500" : "border-gray-400"
                      }`}
                    >
                      {selectedAnswer === index && <div className="w-2 h-2 bg-white rounded-full"></div>}
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
            className="bg-transparent border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white disabled:opacity-50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          <span className="text-sm text-gray-400">
            {currentQuestion + 1} / {totalQuestions}
          </span>

          <Button
            onClick={handleNext}
            disabled={selectedAnswer === undefined}
            className="bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {currentQuestion === totalQuestions - 1 ? "Finish Quiz" : "Next"}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>

      {/* Floating Chat Button */}
      <Dialog open={isChatOpen} onOpenChange={setIsChatOpen}>
        <DialogTrigger asChild>
          <Button
            className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg z-50"
            size="icon"
          >
            <MessageCircle className="w-6 h-6" />
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-md h-[500px] fixed bottom-20 right-6 top-auto left-auto transform-none">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <Brain className="w-5 h-5" />
              Quiz Assistant
            </DialogTitle>
          </DialogHeader>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto space-y-4 bg-gray-800 rounded-lg p-4 max-h-80">
            {chatMessages.length === 0 ? (
              <div className="text-gray-400 text-center py-4">
                Hi! I'm here to help with your quiz questions. Ask me anything!
              </div>
            ) : (
              chatMessages.map((message, index) => (
                <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.role === "user" ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-100"
                    }`}
                  >
                    <div className="text-xs font-medium mb-1">{message.role === "user" ? "You" : "Assistant"}</div>
                    <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                  </div>
                </div>
              ))
            )}
            {isGenerating && (
              <div className="flex justify-start">
                <div className="bg-gray-700 text-gray-100 rounded-lg p-3 max-w-[80%]">
                  <div className="text-xs font-medium mb-1">Assistant</div>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Chat Input */}
          <div className="flex gap-2 mt-4">
            <textarea
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about the quiz..."
              className="flex-1 bg-gray-800 text-white border border-gray-600 rounded-lg p-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              rows={2}
              disabled={isGenerating}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!chatInput.trim() || isGenerating}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3"
              size="sm"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
