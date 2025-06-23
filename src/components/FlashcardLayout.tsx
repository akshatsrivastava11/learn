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

interface Flashcard {
  id: string
  front: string
  back: string
  difficulty: "easy" | "medium" | "hard"
  mastered: boolean
}

interface FlashcardSet {
  id: string
  title: string
  description: string
  cards: Flashcard[]
  createdAt: string
}
import { useUser } from "@clerk/nextjs"

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
  const [flashcardSets, setFlashcardSets] = useState<any[]>([])
  const [setsLoading, setSetsLoading] = useState(false)
  const [cards, setCards] = useState<any[]>([])
  const [cardsLoading, setCardsLoading] = useState(false)
  // Sample flashcard sets data
  const [flashcardSetsData] = useState<FlashcardSet[]>([
    {
      id: "1",
      title: "JavaScript Fundamentals",
      description: "Core concepts and syntax",
      createdAt: "2024-01-15",
      cards: [
        {
          id: "1",
          front: "What is a closure in JavaScript?",
          back: "A closure is a function that has access to variables in its outer (enclosing) scope even after the outer function has returned. It gives you access to an outer function's scope from an inner function.",
          difficulty: "medium",
          mastered: false,
        },
        {
          id: "2",
          front: "What is the difference between let, const, and var?",
          back: "var is function-scoped and can be redeclared; let is block-scoped and can be reassigned but not redeclared; const is block-scoped and cannot be reassigned or redeclared.",
          difficulty: "easy",
          mastered: false,
        },
        {
          id: "3",
          front: "What is event bubbling?",
          back: "Event bubbling is when an event starts from the deepest element and bubbles up to its parents. The event is first captured and handled by the innermost element and then propagated to outer elements.",
          difficulty: "hard",
          mastered: false,
        },
        {
          id: "4",
          front: "What is the purpose of async/await?",
          back: "async/await is syntactic sugar for Promises that makes asynchronous code look and behave more like synchronous code, making it easier to read and write.",
          difficulty: "medium",
          mastered: false,
        },
      ],
    },
    {
      id: "2",
      title: "React Concepts",
      description: "React hooks and components",
      createdAt: "2024-01-10",
      cards: [
        {
          id: "5",
          front: "What is the useState hook?",
          back: "useState is a React Hook that lets you add state to functional components. It returns an array with the current state value and a function to update it.",
          difficulty: "easy",
          mastered: false,
        },
        {
          id: "6",
          front: "What is useEffect used for?",
          back: "useEffect is used to perform side effects in functional components, such as data fetching, subscriptions, or manually changing the DOM. It runs after every render by default.",
          difficulty: "medium",
          mastered: false,
        },
      ],
    },
  ])

  const fetchFlashCards=async()=>{
    if(!user) return
    const useremail=user.emailAddresses[0].emailAddress
    console.log("Useremail is",useremail)
    const resp=await fetch("/api/fetchFlashcard",{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        "useremail":useremail
    })
    })
    // console.log(resp.json())
    const data=await resp.json()
    setFlashcardSets(data.message)
    console.log(data);
  }
  useEffect(()=>{
    (async ()=>{
      console.log("Triggered")
      await fetchFlashCards()
      console.log("THe flash cards are",flashcardSets)
  
    })()
  },[])

  const currentSet = flashcardSets.find((set) => set.id === selectedSet)
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
const fetchCardsForSet=()=>{}
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
              onClick={async () => {
                setSelectedSet(set.id);
                setCardsLoading(true);
                // fetch cards for this set
                const cards = await fetchCardsForSet(set.id);
                setCards(cards);
                setCardsLoading(false);
              }}
              className="w-full p-4 rounded-lg bg-gray-900 border border-gray-700 hover:bg-gray-800 transition flex flex-col items-start"
            >
              <span className="text-lg font-semibold">Set {idx + 1}</span>
              <span className="text-xs text-gray-400 mt-1">Created at: {set.createdAt}</span>
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

  // No cards found for this set
  if (selectedSet && !cardsLoading && cards.length === 0) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <Brain className="h-12 w-12 text-white mx-auto mb-4" />
          <p className="text-lg">No cards found for this set</p>
          <Button
            className="mt-4 bg-white text-black hover:bg-gray-200"
            onClick={() => {
              setSelectedSet(null);
              setCards([]);
            }}
          >
            Back to Set Selection
          </Button>
        </div>
      </div>
    );
  }

  // Study mode selection
  if (!studyStarted) {
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
                <Button variant="outline" className="bg-black border-gray-600 hover:bg-gray-800 text-white">
                  Review Cards
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Main flashcard interface
  const card = currentCards[currentCard]
  if (!card) return null

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
            className={`relative w-full max-w-md h-[420px] cursor-pointer perspective`}
            onClick={() => setIsFlipped((f) => !f)}
          >
            {/* Card Inner */}
            <div className={`absolute inset-0 transition-transform duration-500 transform-style-preserve-3d ${isFlipped ? "rotate-y-180" : ""}`}>
              {/* Front Side */}
              <div className="absolute inset-0 bg-black rounded-xl border border-gray-800 p-6 flex flex-col items-center justify-center backface-hidden">
                <img
                  src={card.front}
                  alt={card.front}
                  className="w-16 h-16 rounded-full mb-3 border-2 border-gray-800 shadow-lg"
                />
                <h2 className="text-2xl font-bold mb-2">{card.front}</h2>
                <p className="text-gray-400 mb-2">{card.front}</p>
                <p className="text-lg font-semibold mb-2">${card.front}</p>
                <span className={`inline-flex items-center px-3 py-1 rounded-full ${card.difficulty === "easy" ? "bg-green-900 text-green-400 border border-green-800" : card.difficulty === "medium" ? "bg-yellow-900 text-yellow-400 border border-yellow-800" : "bg-red-900 text-red-400 border border-red-800"}`}>
                  {card.difficulty === "easy" ? "↑" : card.difficulty === "medium" ? "↓" : ""}
                  {Math.abs(card.front)}% (24h)
                </span>
                <p className="mt-4 text-xs text-gray-500">Click to flip for details</p>
              </div>
              {/* Back Side */}
              <div className="absolute inset-0 bg-black rounded-xl border border-gray-800 p-6 flex flex-col justify-between items-center rotate-y-180 backface-hidden">
                {/* Back Button */}
                <button
                  onClick={e => { e.stopPropagation(); setIsFlipped(false); }}
                  className="absolute top-2 left-2 text-gray-400 hover:text-white"
                >
                  ← Back
                </button>
                {/* Investment Stats */}
                <div className="space-y-3 w-full">
                  <div className="flex justify-between items-center border-b border-gray-800 pb-2">
                    <span className="text-sm text-gray-400">You Own</span>
                    <span className="font-medium text-white">
                      {card.front}
                    </span>
                  </div>
                  <div className="flex justify-between items-center border-b border-gray-800 pb-2">
                    <span className="text-sm text-gray-400">Value (USD)</span>
                    <span className="font-medium text-white">
                      ${card.front}
                    </span>
                  </div>
                  <div className="flex justify-between items-center border-b border-gray-800 pb-2">
                    <span className="text-sm text-gray-400">Purchase Price</span>
                    <span className="font-medium text-white">${card.front}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-gray-800 pb-2">
                    <span className="text-sm text-gray-400">Profit/Loss</span>
                    <span className={`font-medium ${card.front >= 0 ? "text-green-400" : "text-red-400"}`}>
                      {card.front >= 0 ? "+" : ""}
                      {card.front}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center pb-2">
                    <span className="text-sm text-gray-400">Purchase Date</span>
                    <span className="font-medium text-white">{card.front}</span>
                  </div>
                </div>
                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-3 w-full mt-4">
                  <button className="py-3 px-4 bg-green-600 text-white font-medium rounded-xl hover:bg-green-700 transition-all duration-200">
                    Buy More
                  </button>
                  <button className="py-3 px-4 bg-red-600 text-white font-medium rounded-xl hover:bg-red-700 transition-all duration-200">
                    Sell
                  </button>
                </div>
                {/* Transaction History */}
                <div className="mt-4 w-full">
                  <h3 className="text-gray-300 font-medium mb-3 text-sm">Transaction History</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 rounded-lg bg-gray-900 border border-gray-800">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-400"></div>
                        <span className="text-gray-300 text-xs">Buy · {card.front}</span>
                      </div>
                      <span className="text-green-400 text-sm font-medium">
                        +{card.front}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="mt-4 text-xs text-gray-500">Click to flip back</p>
              </div>
            </div>
          </div>
        </div>

        {/* Study Mode Controls */}
        {studyMode === "practice" && isFlipped && (
          <div className="flex justify-center space-x-4 mb-6">
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
        <div className="flex justify-between items-center">
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
    </div>
  )
}
