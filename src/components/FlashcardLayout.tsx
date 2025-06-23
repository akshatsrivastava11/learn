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

// Mock user hook for demonstration
// const useUser = () => ({
//   user: { emailAddresses: [{ emailAddress: "demo@example.com" }] },
//   isLoaded: true,
//   isSignedIn: true
// })

export default function FlashcardLayout() {
  // const {user,isLoaded,isSignedIn}=useUser()
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

  // Mock flashcard sets for demonstration
  const [mockFlashcardSets] = useState<FlashcardSet[]>([
    {
      id: "1",
      title: "Solana Protocol Basics",
      description: "Learn about Solana blockchain fundamentals",
      createdAt: "2024-01-15",
      cards: [
        {
          id: "cmc9auj620000sbjs2nk7wpl0",
          Quesn: "What is the main goal of the Solana protocol?",
          Ans: "The main goal of the Solana protocol is to develop a fast and secure blockchain network.",
          userId: "cmc91fq8t0000sbf4ufso7kzc",
          difficulty: "medium",
          mastered: false,
        },
        {
          id: "cmc9auj620000sbjs2nk7wpl1",
          Quesn: "What consensus mechanism does Solana use?", 
          Ans: "Solana uses Proof of History (PoH) combined with Proof of Stake (PoS) for consensus.",
          userId: "cmc91fq8t0000sbf4ufso7kzc",
          difficulty: "hard",
          mastered: false,
        },
        {
          id: "cmc9auj620000sbjs2nk7wpl2",
          Quesn: "What is SOL?",
          Ans: "SOL is the native cryptocurrency token of the Solana blockchain network.",
          userId: "cmc91fq8t0000sbf4ufso7kzc",
          difficulty: "easy",
          mastered: false,
        }
      ],
    },
    {
      id: "2", 
      title: "JavaScript Fundamentals",
      description: "Core concepts and syntax",
      createdAt: "2024-01-10",
      cards: [
        {
          id: "js001",
          Quesn: "What is a closure in JavaScript?",
          Ans: "A closure is a function that has access to variables in its outer scope even after the outer function has returned.",
          userId: "cmc91fq8t0000sbf4ufso7kzc",
          difficulty: "medium",
          mastered: false,
        }
      ],
    },
  ])

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
    
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-6">Select a Flashcard Set</h1>
        <div className="space-y-4 w-full max-w-md">
          {flashcardSets.map((set, idx) => (
            <button
              key={set.id}
              onClick={() => {
                setSelectedSet(set.id);
                setCardsLoading(false);
              }}
              className="w-full p-4 rounded-lg bg-gray-900 border border-gray-700 hover:bg-gray-800 transition flex flex-col items-start"
            >
              <span className="text-lg font-semibold">{flashcardSets[idx].Quesn}</span>
              {/* <span className="text-sm text-gray-300 mt-1">{set.description}</span> */}
              <span className="text-xs text-gray-400 mt-1">
                {flashcardSets.length+1} cards • Created: {flashcardSets[idx].createdAt}
              </span>
            </button>
          ))}
        </div>
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

  // After set selection, show all cards in a grid, each flippable
  if (selectedSet && !studyStarted) {
    return (
    
      <div className="min-h-screen bg-black text-white">
        
        <header className="bg-black border-b border-gray-800 px-6 py-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Brain className="h-8 w-8 text-white" />
              <span className="text-2xl font-bold text-white">FlashCards</span>
            </div>
            <Button
              variant="outline"
              className="bg-black border-gray-600 hover:bg-gray-800 text-white"
              onClick={() => setSelectedSet(null)}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Sets
            </Button>
          </div>
        </header>
        
        <div className="max-w-5xl mx-auto px-6 py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">{currentSet?.title}</h1>
            <p className="text-gray-400 mb-4">{currentSet?.description}</p>
            <Button
              size="lg"
              className="bg-white text-black hover:bg-gray-200"
              onClick={() => setStudyStarted(true)}
            >
              Start Studying
            </Button>
          </div>
          
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
                        haard
                        {/* {card.difficulty} */}
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
      </div>
    );
  }

  // Results screen
  if (showResults) {
    const results = calculateResults()
    const percentage = Math.round((results.correct / results.total) * 100)

    return (
      <div className="min-h-screen bg-black text-white">
        <header className="bg-black border-b border-gray-800 px-6 py-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Brain className="h-8 w-8 text-white" />
              <span className="text-2xl font-bold text-white">FlashCards</span>
            </div>
            <Button
              variant="outline"
              className="bg-black border-gray-600 hover:bg-gray-800 text-white"
              onClick={() => {
                setSelectedSet(null)
                resetStudySession()
              }}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Sets
            </Button>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-6 py-8">
          <Card className="bg-gray-900 border-gray-700 mb-6">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold mb-4 text-white">Study Session Complete!</CardTitle>
              <div className="text-6xl font-bold mb-2 text-white">{percentage}%</div>
              <p className="text-gray-300">
                You got {results.correct} out of {results.total} cards correct
              </p>
            </CardHeader>
            <CardContent className="text-center">
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">{results.correct}</div>
                  <div className="text-sm text-gray-400">Correct</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-400">{results.incorrect}</div>
                  <div className="text-sm text-gray-400">Incorrect</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-400">{results.skipped}</div>
                  <div className="text-sm text-gray-400">Skipped</div>
                </div>
              </div>
              <div className="flex justify-center space-x-4">
                <Button className="bg-white text-black hover:bg-gray-200" onClick={resetStudySession}>
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Study Again
                </Button>
                <Button 
                  variant="outline" 
                  className="bg-black border-gray-600 hover:bg-gray-800 text-white"
                  onClick={() => {
                    setShowResults(false)
                    setStudyStarted(false)
                  }}
                >
                  Review Cards
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Study mode selection
  if (selectedSet && !studyStarted) {
    return (
      <div className="min-h-screen bg-black text-white">
        
        <header className="bg-black border-b border-gray-800 px-6 py-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Brain className="h-8 w-8 text-white" />
              <span className="text-2xl font-bold text-white">FlashCards</span>
            </div>
            <Button
              variant="outline"
              className="bg-black border-gray-600 hover:bg-gray-800 text-white"
              onClick={() => setSelectedSet(null)}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Sets
            </Button>
          </div>
        </header>

        <div className="max-w-2xl mx-auto px-6 py-16">
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold mb-4 text-white">{currentSet?.title}</CardTitle>
              <p className="text-gray-300 text-lg">{currentSet?.description}</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-white">{totalCards}</div>
                  <div className="text-sm text-gray-400">Cards</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">~{Math.ceil(totalCards * 0.5)}</div>
                  <div className="text-sm text-gray-400">Minutes</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">{masteredCards.size}</div>
                  <div className="text-sm text-gray-400">Mastered</div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-white">Choose Study Mode:</h3>
                <div className="grid gap-3">
                  <button
                    onClick={() => setStudyMode("review")}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      studyMode === "review"
                        ? "border-blue-500 bg-blue-500/10"
                        : "border-gray-600 hover:border-gray-500"
                    }`}
                  >
                    <div className="font-semibold text-white">Review Mode</div>
                    <div className="text-sm text-gray-400">Study at your own pace, flip cards freely</div>
                  </button>
                  <button
                    onClick={() => setStudyMode("practice")}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      studyMode === "practice"
                        ? "border-blue-500 bg-blue-500/10"
                        : "border-gray-600 hover:border-gray-500"
                    }`}
                  >
                    <div className="font-semibold text-white">Practice Mode</div>
                    <div className="text-sm text-gray-400">Test yourself, mark cards as correct/incorrect</div>
                  </button>
                  <button
                    onClick={() => setStudyMode("test")}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      studyMode === "test" ? "border-blue-500 bg-blue-500/10" : "border-gray-600 hover:border-gray-500"
                    }`}
                  >
                    <div className="font-semibold text-white">Test Mode</div>
                    <div className="text-sm text-gray-400">Timed study session with results</div>
                  </button>
                </div>
              </div>

              <Button
                size="lg"
                className="w-full bg-white text-black hover:bg-gray-200"
                onClick={() => setStudyStarted(true)}
              >
                Start Studying
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Main flashcard study interface
  if (!currentCards[currentCard]) return null

  const card = currentCards[currentCard]

  return (
    <div className="min-h-screen bg-black">
      <header className="bg-black border-b border-gray-800 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Brain className="h-8 w-8 text-white" />
            <span className="text-2xl font-bold text-white">FlashCards</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-white">
              Card {currentCard + 1} of {totalCards}
            </span>
            <Button
              variant="outline"
              className="bg-black border-gray-600 hover:bg-gray-800 text-white"
              onClick={() => {
                setSelectedSet(null)
                resetStudySession()
              }}
            >
              Exit Study
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-300">Progress</span>
            <span className="text-sm text-gray-400">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Flashcard */}
        <div className="relative w-full flex justify-center">
          <div
            className={`relative w-full max-w-lg h-[420px] cursor-pointer perspective`}
            onClick={() => setIsFlipped((f) => !f)}
          >
            {/* Card Inner */}
            <div className={`absolute inset-0 transition-transform duration-500 transform-style-preserve-3d ${isFlipped ? "rotate-y-180" : ""}`}>
              {/* Front Side - Question */}
              <div className="absolute inset-0 bg-gray-900 rounded-xl border border-gray-700 p-8 flex flex-col items-center justify-center backface-hidden">
                <span className="text-xs uppercase tracking-wider text-gray-400 mb-6">Question</span>
                <h2 className="text-2xl font-bold mb-6 text-center text-white">{card.Quesn}</h2>
                {card.difficulty && (
                  <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm ${
                    card.difficulty === "easy" 
                      ? "bg-green-900 text-green-400 border border-green-800" 
                      : card.difficulty === "medium" 
                      ? "bg-yellow-900 text-yellow-400 border border-yellow-800" 
                      : "bg-red-900 text-red-400 border border-red-800"
                  }`}>
                    {card.difficulty}
                  </span>
                )}
                <p className="mt-6 text-sm text-gray-500">Click to flip for answer</p>
              </div>
              
              {/* Back Side - Answer */}
              <div className="absolute inset-0 bg-gray-900 rounded-xl border border-blue-700 p-8 flex flex-col justify-center items-center rotate-y-180 backface-hidden">
                <span className="text-xs uppercase tracking-wider text-blue-400 mb-6">Answer</span>
                <h2 className="text-xl font-semibold text-center text-blue-200 mb-6">{card.Ans}</h2>
                <p className="mt-6 text-sm text-gray-500">Click to flip back</p>
              </div>
            </div>
          </div>
        </div>

        {/* Study Mode Controls */}
        {studyMode === "practice" && isFlipped && (
          <div className="flex justify-center space-x-4 mb-6 mt-8">
            <Button onClick={() => handleCardResult("incorrect")} className="bg-red-600 hover:bg-red-700 text-white">
              <XCircle className="w-4 h-4 mr-2" />
              Incorrect
            </Button>
            <Button
              onClick={() => handleCardResult("skipped")}
              variant="outline"
              className="bg-black border-gray-600 hover:bg-gray-800 text-white"
            >
              Skip
            </Button>
            <Button onClick={() => handleCardResult("correct")} className="bg-green-600 hover:bg-green-700 text-white">
              <CheckCircle className="w-4 h-4 mr-2" />
              Correct
            </Button>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between items-center mt-8">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentCard === 0}
            className="bg-black border-gray-600 text-white hover:bg-gray-800 disabled:opacity-50"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-400">
              {currentCard + 1} / {totalCards}
            </span>
            {masteredCards.has(currentCard) && <Star className="w-5 h-5 text-yellow-400 fill-current" />}
          </div>

          <Button
            onClick={studyMode === "review" ? handleNext : () => (isFlipped ? handleNext : setIsFlipped(true))}
            disabled={studyMode === "review" && currentCard === totalCards - 1}
            className="bg-white text-black hover:bg-gray-200 disabled:opacity-50"
          >
            {currentCard === totalCards - 1
              ? studyMode === "test"
                ? "Finish"
                : "Complete"
              : studyMode === "review"
                ? "Next"
                : !isFlipped
                  ? "Reveal"
                  : "Next"}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
      
      <style jsx global>{`
        .perspective { perspective: 1200px; }
        .transform-style-preserve-3d { transform-style: preserve-3d; }
        .rotate-y-180 { transform: rotateY(180deg); }
        .backface-hidden { backface-visibility: hidden; }
      `}</style>
    </div>
  )
}