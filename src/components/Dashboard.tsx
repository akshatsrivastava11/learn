"use client"
import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileUpload } from "@/components/ui/file-upload"
import { extractPdf } from "@/hooks/extractPdf"
import { Brain, Plus, CheckCircle2, X, FileText, Layers } from "lucide-react"
import { useState, useEffect, useCallback } from "react"
import { useLLM } from "@/hooks/useLLM"
import ElasticSlider from "@/blocks/Components/ElasticSlider/ElasticSlider"
import * as pdfjsLib from "pdfjs-dist"
import { extractTextToQues } from "@/hooks/extractTextToQuesn"
import { useUser } from "@clerk/nextjs"
import { extractTextToFlashCards } from "@/hooks/extractTextToFlashcard"
import { GoogleGenAI } from "@google/genai"
import { useRouter } from "next/navigation"

// Mock todo items

export default function Dashboard() {
  const router=useRouter()
  const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY })
  const generateResponseFromGemini = async (content: string) => {
    const response = await ai.models.generateContent({
      contents: content,
      model: "gemini-2.5-flash",
    })
    return response.text
  }
  const { user, isLoaded, isSignedIn } = useUser()
  
  const sendResponse = useCallback(async () => {
    if (!isLoaded || !isSignedIn) {
      // Wait for Clerk to load and user to be signed in
      return
    }
    console.log("user is not null")
    await fetch("/api/sign", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: user.emailAddresses[0].emailAddress,
        password: user.passkeys,
      }),
    })
  }, [isLoaded, isSignedIn, user])

  useEffect(() => {
    if (!isLoaded) return; // Wait for Clerk to finish loading
    if (!isSignedIn) {
      console.log("user is null")
      router.push("/")
      return
    }
    console.log("The users email address is ", user.emailAddresses[0].emailAddress)
    sendResponse()
    callback()
  }, [isLoaded, isSignedIn, user, sendResponse])

  const [showUploadModal, setShowUploadModal] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<File>()
  const [text, settext] = useState("Something about pda and ast inn solana")
  const [pages, setpages] = useState(0)
  const [selectedPages, setSelectedPages] = useState(1)
  const [isExtracted, setIsExtracted] = useState(false)
  const [maxSliderPages, setMaxSliderPages] = useState(10)
  const [showQuizAlert, setShowQuizAlert] = useState(false)
  const [buttonClicked, setbuttonClicked] = useState("")
  const [quizName, setQuizName] = useState("")
  const [chatMessages, setChatMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([])
  const [chatInput, setChatInput] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)

  // Mock counters - you can replace these with actual data from your API
  const [quizzesGenerated, setQuizzesGenerated] = useState(0)
  const [flashcardsGenerated, setFlashcardsGenerated] = useState(0)
  const callback=useCallback(()=>{
    (async ()=>{
      if(!user)return
      const useremail=user.emailAddresses[0].emailAddress
      const responseforfetchnoOfquiz=await fetch("/api/fetchNoofQuiz",{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify({
          useremail:useremail
        })
      })
      const text1=await responseforfetchnoOfquiz.json()
      console.log(text1)

      setQuizzesGenerated(text1.message)
      const response2=await fetch("/api/fetchNoofFlashcards",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          useremail:useremail,
        })
      })
      const  text2=await response2.json()
      console.log(text2)
      setFlashcardsGenerated(text2.message)
    })()
  },[])
  const handlecreatingquesn = async () => {
    setbuttonClicked("Quiz")
    setShowUploadModal(true)
  }
  const handlecreatingflashcards = async () => {
    setbuttonClicked("Flashcards")
    setShowUploadModal(true)
  }

  const handleFileUpload = async (files: File) => {
    setUploadedFiles(files)
    setIsUploading(false)
    setUploadProgress(0)
    setIsExtracted(false)
    settext("")
    // Detect number of pages in PDF and set maxSliderPages
    if (files && files.type === "application/pdf") {
      try {
        pdfjsLib.GlobalWorkerOptions.workerSrc =
          "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js"
        const pdf = await pdfjsLib.getDocument(URL.createObjectURL(files)).promise
        const numPages = pdf.numPages
        setMaxSliderPages(Math.min(10, numPages))
        setSelectedPages(1)
      } catch (e) {
        setMaxSliderPages(8)
        setSelectedPages(1)
      }
    } else {
      setMaxSliderPages(10)
      setSelectedPages(1)
    }
  }

  const handleExtractPdf = async () => {
    if (!uploadedFiles) return
    setIsUploading(true)
    setUploadProgress(0)
    try {
      const text = await extractPdf(
        uploadedFiles,
        (progress) => setUploadProgress(Math.round(progress * 100)),
        selectedPages,
      )
      //   const jsonObj=extractTextToQues(text);
      //   console.log(jsonObj)
      setIsUploading(false)
      setIsExtracted(true)
      settext(text)
    } catch (error) {
      console.log("An error occurred ", error)
      setIsUploading(false)
      setIsExtracted(false)
    }
  }

  const handleCreateQuesn = async () => {
    // Handle creating flashcards from extracted text
    console.log("Creating flashcards from:", uploadedFiles)
    setUploadedFiles(undefined)
    setUploadProgress(0)
    setIsExtracted(false)
    if (text !== "") {
      const returned_Quiz = await useLLM(text, buttonClicked)
      console.log(returned_Quiz)
      let data
      if (buttonClicked == "Quiz") {
        data = await extractTextToQues(returned_Quiz, user, quizName)
        // Increment quiz counter
        setQuizzesGenerated((prev) => prev + 1)
      } else {
        data = await extractTextToFlashCards(returned_Quiz, user)
        // Increment flashcards counter
        setFlashcardsGenerated((prev) => prev + 1)
      }
      console.log("the quesn inn json is  ", data)
      setShowQuizAlert(true)
    }
  }

  const closeModal = () => {
    setShowUploadModal(false)
    setUploadedFiles(undefined)
    setUploadProgress(0)
    setIsUploading(false)
    setIsExtracted(false)
    settext("")
    setQuizName("")
  }

  const handleSendMessage = async () => {
    if (!chatInput.trim() || isGenerating) return

    const userMessage = chatInput.trim()
    setChatInput("")

    // Add user message to chat
    setChatMessages((prev) => [...prev, { role: "user", content: userMessage }])

    setIsGenerating(true)

    try {
      const response = await generateResponseFromGemini(userMessage)
      setChatMessages((prev) => [...prev, { role: "assistant", content: response ?? "" }])
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

  return (
    <div className="min-h-screen ">
      {/* Alert for quiz ready */}
      {showQuizAlert && (
        <div className="fixed top-8 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-black border border-green-500 rounded-lg shadow-lg px-6 py-4 flex items-center space-x-4 animate-fade-in">
            <CheckCircle2 className="text-green-500 w-6 h-6" />
            <div>
              <div className="text-white font-semibold">Quiz Ready!</div>
              <div className="text-white text-sm">Move to the Quiz section to see your generated quiz.</div>
            </div>
            <button
              onClick={() => setShowQuizAlert(false)}
              className="ml-4 text-white hover:text-green-500 focus:outline-none"
              aria-label="Dismiss alert"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-8">Welcome User</h1>
          <div className="flex gap-6">
            <Button
              className="bg-black text-white hover:bg-gray-800 px-8 py-4 text-lg font-semibold"
              onClick={handlecreatingquesn}
              size="lg"
            >
              <Plus className="w-5 h-5 mr-3" />
              Create Quiz
            </Button>
            <Button
              variant="outline"
              className="bg-black text-white border-gray-600 hover:bg-gray-800 hover:text-white px-8 py-4 text-lg font-semibold"
              onClick={handlecreatingflashcards}
              size="lg"
            >
              <Plus className="w-5 h-5 mr-3" />
              Create Flashcards
            </Button>
          </div>
        </div>

        {/* File Upload Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 bg-black bg-opacity-100 flex items-center justify-center z-50">
            <div className="bg-gray-600 rounded-lg p-6 w-full max-w-md mx-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-black">Create {buttonClicked}</h3>
                <Button variant="ghost" size="sm" onClick={closeModal} className="text-black hover:bg-gray-100">
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-4">
                {buttonClicked === "Quiz" && (
                  <input
                    type="text"
                    className="w-full p-2 border rounded mb-2"
                    placeholder="Enter Quiz Name"
                    value={quizName}
                    onChange={(e) => setQuizName(e.target.value)}
                  />
                )}
                <FileUpload childToParent={handleFileUpload} />

                {uploadedFiles && (
                  <div className="flex flex-col items-center space-y-2">
                    <span className="text-black text-sm font-semibold">Maximum of 8 pages only</span>
                    <span className="text-black text-xs">
                      (PDF has {maxSliderPages} page{maxSliderPages !== 1 ? "s" : ""})
                    </span>
                    <span className="text-black text-sm">Select number of pages to extract:</span>
                    <ElasticSlider
                      defaultValue={selectedPages}
                      startingValue={1}
                      maxValue={maxSliderPages}
                      isStepped={true}
                      stepSize={1}
                      onChange={(val) => setSelectedPages(Math.round(val))}
                      value={selectedPages}
                    />
                    <span className="text-black text-xs">Pages: {selectedPages}</span>
                  </div>
                )}

                {isUploading && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-black">
                      <span>Extracting PDF...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-white rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                {uploadedFiles !== undefined && !isUploading && (
                  <div className="space-y-2">
                    <p className="text-sm text-black">Uploaded file:</p>
                  </div>
                )}

                <div className="flex gap-2 pt-4">
                  {!isExtracted ? (
                    <Button
                      onClick={handleExtractPdf}
                      disabled={isUploading || !uploadedFiles || (buttonClicked === "Quiz" && !quizName)}
                      className="flex-1 bg-white text-black hover:bg-gray-800"
                    >
                      Upload File
                    </Button>
                  ) : (
                    <Button
                      onClick={handleCreateQuesn}
                      disabled={isUploading || !uploadedFiles || (buttonClicked === "Quiz" && !quizName)}
                      className="flex-1 bg-white text-black hover:bg-gray-800"
                    >
                      Create {buttonClicked}
                    </Button>
                  )}
                  <Button variant="outline" onClick={closeModal} className="flex-1 text-black">
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
          {/* Stats Section */}
          <div className="space-y-6">
            {/* Generation Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              <Card className="bg-black border-gray-600">
                <CardContent className="p-6 text-center">
                  <FileText className="w-8 h-8 mx-auto mb-3 text-blue-500" />
                  <div className="text-3xl font-bold text-white mb-1">{quizzesGenerated}</div>
                  <div className="text-sm text-gray-300">Quizzes Generated</div>
                </CardContent>
              </Card>

              <Card className="bg-black border-gray-600">
                <CardContent className="p-6 text-center">
                  <Layers className="w-8 h-8 mx-auto mb-3 text-green-500" />
                  <div className="text-3xl font-bold text-white mb-1">{flashcardsGenerated}</div>
                  <div className="text-sm text-gray-300">Flashcards Generated</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Section - now outside the main container and much wider */}
      <div className="mt-8 w-full  min-w-4xl flex justify-center">
        <div className="w-full max-w-screen-6xl">
          <Card className="bg-black border-gray-600">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Brain className="w-5 h-5" />
                Chat with AI Tutor
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {/* Chat Messages */}
              <div className="h-96 overflow-y-auto mb-4 space-y-4 bg-gray-900 rounded-lg p-4">
                {chatMessages.length === 0 ? (
                  <div className="text-gray-400 text-center py-8">Start a conversation with your AI tutor ...</div>
                ) : (
                  chatMessages.map((message, index) => (
                    <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          message.role === "user" ? "bg-blue-600 textf-white" : "bg-gray-700 text-gray-100"
                        }`}
                      >
                        <div className="text-sm font-medium mb-1">{message.role === "user" ? "You" : "Gemini"}</div>
                        <div className="whitespace-pre-wrap">{message.content}</div>
                      </div>
                    </div>
                  ))
                )}
                {isGenerating && (
                  <div className="flex justify-start">
                    <div className="bg-gray-700 text-gray-100 rounded-lg p-3 max-w-[80%]">
                      <div className="text-sm font-medium mb-1">Ai_Tute</div>
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
              <div className="flex gap-2">
                <textarea
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask Gemini anything..."
                  className="flex-1 bg-gray-800 text-white border border-gray-600 rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={2}
                  disabled={isGenerating}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!chatInput.trim() || isGenerating}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6"
                >
                  {isGenerating ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    "Send"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
