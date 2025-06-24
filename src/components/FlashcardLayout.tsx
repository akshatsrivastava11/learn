"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  Brain,
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  BookOpen,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  Star,
} from "lucide-react"
import { useEffect, useState } from "react"
import { useUser } from "@clerk/nextjs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { MessageCircle, Send } from "lucide-react"
import { GoogleGenAI } from "@google/genai"
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

interface Flashcard {
  id: string
  Quesn: string  // Changed from 'front' to match your API response
  Ans: string    // Changed from 'back' to match your API response
  userId: string
  difficulty?: "easy" | "medium" | "hard"
  mastered?: boolean
}

interface FlashcardSet {
  id: string
  title: string
  description: string
  cards: Flashcard[]
  createdAt: string
}

const isPublicRoute = createRouteMatcher(['/', '/sign-in(.*)'])

export default function FlashcardLayout() {
  const [currentCard, setCurrentCard] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [studyStarted, setStudyStarted] = useState(false)
  const [selectedSet, setSelectedSet] = useState<string | null>(null)
  const [studyMode, setStudyMode] = useState<"review" | "practice" | "test">("review")
  const [showResults, setShowResults] = useState(false)
  const [cardResults, setCardResults] = useState<{ [key: number]: "correct" | "incorrect" | "skipped" }>({})
  const [masteredCards, setMasteredCards] = useState<Set<number>>(new Set())
  const { user, isLoaded, isSignedIn } = useUser()
  const [flashcardSets, setFlashcardSets] = useState<FlashcardSet[]>([])
  const [setsLoading, setSetsLoading] = useState(true)
  const [cardsLoading, setCardsLoading] = useState(false)
  const [flipped, setFlipped] = useState<{ [cardId: string]: boolean }>({})
  const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY })
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [chatMessages, setChatMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([])
  const [chatInput, setChatInput] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)

  const fetchFlashCards = async() => {
    if(!user) return
    
    try {
      const useremail = user.emailAddresses[0].emailAddress
      console.log("Useremail is", useremail)
      
      // Mock API call - replace with your actual API
      const resp = await fetch("/api/fetchFlashcard", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "useremail": useremail
        })
      })
      const data = await resp.json()
      setFlashcardSets(data.message)
      console.log("data.message is",data.message)
      setSetsLoading(false)
    } catch (error) {
      console.error("Error fetching flashcards:", error)
      setSetsLoading(false)
    }
  }

  const currentSet = flashcardSets.find((set: FlashcardSet) => set.id === selectedSet)
  const currentCards = currentSet?.cards || []
  const totalCards = currentCards.length
  const progress = totalCards > 0 ? ((currentCard + 1) / totalCards) * 100 : 0

  const handleNext = () => {
    if (currentCard < totalCards - 1) {
      setCurrentCard(currentCard + 1)
      setIsFlipped(false)
    } else if (studyMode === "test") {
      setShowResults(true)
    }
  }

  const handlePrevious = () => {
    if (currentCard > 0) {
      setCurrentCard(currentCard - 1)
      setIsFlipped(false)
    }
  }

  const handleCardResult = (result: "correct" | "incorrect" | "skipped") => {
    setCardResults((prev) => ({
      ...prev,
      [currentCard]: result,
    }))

    if (result === "correct") {
      setMasteredCards((prev) => new Set([...prev, currentCard]))
    }

    handleNext()
  }

  const resetStudySession = () => {
    setCurrentCard(0)
    setIsFlipped(false)
    setShowResults(false)
    setStudyStarted(false)
    setCardResults({})
    setMasteredCards(new Set())
  }

  const calculateResults = () => {
    const results = Object.values(cardResults)
    const correct = results.filter((r) => r === "correct").length
    const incorrect = results.filter((r) => r === "incorrect").length
    const skipped = results.filter((r) => r === "skipped").length
    return { correct, incorrect, skipped, total: results.length }
  }

  const generateResponseFromGemini = async (content: string) => {
    const response = await ai.models.generateContent({
      contents: content,
      model: "gemini-2.5-flash",
    })
    return response.text
  }

  const generateAIResponse = async (message: string) => {
    try {
      const response = await generateResponseFromGemini(message)
      return response || "I'm here to help with your flashcards!"
    } catch (error) {
      return "Sorry, I'm having trouble responding right now. Please try again."
    }
  }

  const handleSendMessage = async () => {
    if (!chatInput.trim() || isGenerating) return
    const userMessage = chatInput.trim()
    setChatInput("")
    setChatMessages((prev) => [...prev, { role: "user", content: userMessage }])
    setIsGenerating(true)
    try {
      const response = await generateAIResponse(userMessage)
      setChatMessages((prev) => [...prev, { role: "assistant", content: response }])
    } catch (error) {
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

  useEffect(() => {
    (async () => {
      console.log("Triggered")
      await fetchFlashCards()
      console.log("The flash cards are", flashcardSets)
    })()
  }, [isSignedIn, isLoaded, user])

  // Set selection screen
  if (!selectedSet) {
    if (setsLoading) {
      return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
          <Brain className="h-12 w-12 text-white mx-auto mb-4 animate-pulse" />
          <p className="text-lg">Loading flashcard sets...</p>
        </div>
      );
    }
    
    if (!Array.isArray(flashcardSets) || flashcardSets.length === 0) {
      return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
          <h1 className="text-2xl font-bold mb-6">No flashcard sets found</h1>
        </div>
      );
    }

    // Flashcards selecting page
    return (
      <div className="min-h-screen bg-transparent text-white">
        
        <h1 className="text-4xl font-extrabold mt-10 mb-8 text-center tracking-tight drop-shadow-lg">Flashcards</h1>
        
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {flashcardSets.map((card: any) => (
              <div
                key={card.id}
                className="relative w-full h-64 cursor-pointer perspective"
                onClick={() => setFlipped((prev) => ({ ...prev, [card.id]: !prev[card.id] }))}
              >
                <div className={`absolute inset-0 transition-transform duration-500 transform-style-preserve-3d ${flipped[card.id] ? "rotate-y-180" : ""}`}>
                  {/* Front Side - Question */}
                  <div className="absolute inset-0 bg-gray-900 border border-gray-700 rounded-xl p-6 flex flex-col justify-center items-center backface-hidden">
                    <span className="text-xs uppercase tracking-wider text-gray-400 mb-4">Question</span>
                    <h2 className="text-lg font-semibold text-center mb-4">{card.Quesn}</h2>
                    {card.difficulty && (
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs ${
                        card.difficulty === "easy" 
                          ? "bg-green-900 text-green-400 border border-green-800" 
                          : card.difficulty === "medium" 
                          ? "bg-yellow-900 text-yellow-400 border border-yellow-800" 
                          : "bg-red-900 text-red-400 border border-red-800"
                      }`}>
                        hard
                      </span>
                    )}
                    <p className="mt-4 text-xs text-gray-500">Tap to flip for answer</p>
                  </div>
                  
                  {/* Back Side - Answer */}
                  <div className="absolute inset-0 bg-gray-900 border border-blue-700 rounded-xl p-6 flex flex-col justify-center items-center rotate-y-180 backface-hidden">
                    <span className="text-xs uppercase tracking-wider text-blue-400 mb-4">Answer</span>
                    <h2 className="text-lg font-semibold text-center text-blue-200 mb-4">{card.Ans}</h2>
                    <p className="mt-4 text-xs text-gray-500">Tap to flip back</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <style jsx global>{`
          .perspective { perspective: 1200px; }
          .transform-style-preserve-3d { transform-style: preserve-3d; }
          .rotate-y-180 { transform: rotateY(180deg); }
          .backface-hidden { backface-visibility: hidden; }
        `}</style>
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
                Flashcard Assistant
              </DialogTitle>
            </DialogHeader>
            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto space-y-4 bg-gray-800 rounded-lg p-4 max-h-80">
              {chatMessages.length === 0 ? (
                <div className="text-gray-400 text-center py-4">
                  Hi! I'm here to help with your flashcards. Ask me anything!
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
                placeholder="Ask about the flashcards..."
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
    );
  }

  // Loading state for cards
  if (selectedSet && cardsLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <Brain className="h-12 w-12 text-white mx-auto mb-4 animate-pulse" />
        <p className="text-lg">Loading cards...</p>
      </div>
    );
  }

  // Rest of your component logic would go here...
  return null;
}