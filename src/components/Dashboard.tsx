"use client"
import useSWR from 'swr'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { FileUpload } from "@/components/ui/file-upload"
import { extractPdf } from "@/hooks/extractPdf"
import { Brain, Plus, Calendar, Flame, Target, Clock, CheckCircle2, X } from "lucide-react"
import { useState } from "react"
import { useLLM } from '@/hooks/useLLM'
import ElasticSlider from "@/blocks/Components/ElasticSlider/ElasticSlider"
import * as pdfjsLib from 'pdfjs-dist'
import { extractTextToQues } from '@/hooks/extractTextToQuesn'

// Mock data for study activity (similar to GitHub contributions)
const generateActivityData = () => {
  const data = []
  const today = new Date()
  const startDate = new Date(today.getFullYear(), today.getMonth() - 11, today.getDate())

  for (let d = new Date(startDate); d <= today; d.setDate(d.getDate() + 1)) {
    const activity = Math.floor(Math.random() * 5) // 0-4 activity levels
    data.push({
      date: new Date(d),
      count: activity,
      level: activity,
    })
  }
  return data
}

const activityData = generateActivityData()

// Mock todo items
const initialTodos = [
  { id: 1, text: "Review Biology Chapter 5 flashcards", completed: false },
  { id: 2, text: "Complete Chemistry quiz on molecular bonds", completed: true },
  { id: 3, text: "Study Spanish vocabulary - 50 new words", completed: false },
  { id: 4, text: "Practice Math problems - Calculus derivatives", completed: false },
  { id: 5, text: "Review History timeline for upcoming exam", completed: true },
]

export default function Dashboard() {
  const [todos, setTodos] = useState(initialTodos)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<File>()
  const [text,settext]=useState("Something about pda and ast inn solana")
  const [pages,setpages]=useState(0);
  const [selectedPages, setSelectedPages] = useState(1);
  const [isExtracted, setIsExtracted] = useState(false);
  const [maxSliderPages, setMaxSliderPages] = useState(10);
  const toggleTodo = (id: number) => {
    setTodos(todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)))
  }

  const handlecreatingflashcards =async  () => {
    setShowUploadModal(true)
  }

  const handleFileUpload = async (files: File) => {
    setUploadedFiles(files);
    setIsUploading(false);
    setUploadProgress(0);
    setIsExtracted(false);
    settext("");
    // Detect number of pages in PDF and set maxSliderPages
    if (files && files.type === 'application/pdf') {
      try {
        pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
        const pdf = await pdfjsLib.getDocument(URL.createObjectURL(files)).promise;
        const numPages = pdf.numPages;
        setMaxSliderPages(Math.min(10, numPages));
        setSelectedPages(1);
      } catch (e) {
        setMaxSliderPages(8);
        setSelectedPages(1);
      }
    } else {
      setMaxSliderPages(10);
      setSelectedPages(1);
    }
  };

  const handleExtractPdf = async () => {
    if (!uploadedFiles) return;
    setIsUploading(true);
    setUploadProgress(0);
    try {
      const text = await extractPdf(
        uploadedFiles,
        (progress) => setUploadProgress(Math.round(progress * 100)),
        selectedPages
      );
    //   const jsonObj=extractTextToQues(text);
    //   console.log(jsonObj)
      setIsUploading(false);
      setIsExtracted(true);
      settext(text);
    } catch (error) {
      console.log("An error occurred ", error);
      setIsUploading(false);
      setIsExtracted(false);
    }
  };

  const handleCreateFlashcards = async () => {
    // Handle creating flashcards from extracted text
    console.log('Creating flashcards from:', uploadedFiles);
    setUploadedFiles(undefined);
    setUploadProgress(0);
    setIsExtracted(false);
    if (text !== "") {
      const returned_Quiz = await useLLM(text);
      console.log(returned_Quiz);
      const data=extractTextToQues(returned_Quiz)
      console.log("the quesn inn json is  ",data);

    }
  };

  const closeModal = () => {
    setShowUploadModal(false);
    setUploadedFiles(undefined);
    setUploadProgress(0);
    setIsUploading(false);
    setIsExtracted(false);
    settext("");
  };

  // Calculate streaks
  const currentStreak = 12
  const longestStreak = 28
  const totalStudyDays = activityData.filter((day) => day.count > 0).length
  const weeklyGoal = 5
  const thisWeekStudied = 4

  // Get activity level color
  const getActivityColor = (level: number) => {
    switch (level) {
      case 0:
        return "bg-green-100"
      case 1:
        return "bg-green-300"
      case 2:
        return "bg-green-500"
      case 3:
        return "bg-green-700"
      case 4:
        return "bg-green"
      default:
        return "bg-green-100"
    }
  }

  // Group activity data by weeks
  const weeks = []
  for (let i = 0; i < activityData.length; i += 7) {
    weeks.push(activityData.slice(i, i + 7))
  }

  return (
    <div className="min-h-screen ">
      {/* Header */}
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-6">Welcome User</h1>
          <div className="flex gap-4">
            <Button className="bg-black text-white hover:bg-gray-800">
              <Plus className="w-4 h-4 mr-2" />
              Create Quiz
            </Button>
            <Button variant="outline" className="bg-black text-white border-black hover:bg-black hover:text-white" onClick={handlecreatingflashcards}>
              <Plus className="w-4 h-4 mr-2" />
              Create Flashcards
            </Button>
          </div>
        </div>

        {/* File Upload Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 bg-black bg-opacity-100 flex items-center justify-center z-50">
            <div className="bg-gray-600 rounded-lg p-6 w-full max-w-md mx-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-black">Create Flashcards</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={closeModal}
                  className="text-black hover:bg-gray-100"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="space-y-4">
                <FileUpload childToParent={handleFileUpload} />
                
                {uploadedFiles && (
                  <div className="flex flex-col items-center space-y-2">
                    <span className="text-black text-sm font-semibold">Maximum of 8 pages only</span>
                    <span className="text-black text-xs">(PDF has {maxSliderPages} page{maxSliderPages !== 1 ? 's' : ''})</span>
                    <span className="text-black text-sm">Select number of pages to extract:</span>
                    <ElasticSlider
                      defaultValue={selectedPages}
                      startingValue={1}
                      maxValue={maxSliderPages}
                      isStepped={true}
                      stepSize={1}
                      onChange={val => setSelectedPages(Math.round(val))}
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
                      disabled={isUploading || !uploadedFiles}
                      className="flex-1 bg-white text-black hover:bg-gray-800"
                    >
                      Upload File
                    </Button>
                  ) : (
                    <Button
                      onClick={handleCreateFlashcards}
                      disabled={isUploading || !uploadedFiles}
                      className="flex-1 bg-white text-black hover:bg-gray-800"
                    >
                      Create Flashcards
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    onClick={closeModal}
                    className="flex-1 text-black"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Todo List */}
          <div className="lg:col-span-1">
            <Card className="bg-black border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle2 className="w-5 h-5 text-white" />
                  <span>Your Todo List</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {todos.map((todo) => (
                    <div key={todo.id} className="flex items-center space-x-3">
                      <Checkbox
                        checked={todo.completed}
                        onCheckedChange={() => toggleTodo(todo.id)}
                        className="data-[state=checked]:bg-white data-[state=checked]:border-black"
                      />
                      <span className={`text-sm ${todo.completed ? "line-through text-white" : "text-white"}`}>
                        {todo.text}
                      </span>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4 bg-white text-black border-gray-300 hover:bg-gray-50">
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Task
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Study Activity & Stats */}
          <div className="lg:col-span-2 space-y-6">
            {/* Study Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="bg-black border-gray-200">
                <CardContent className="p-4 text-center">
                  <Flame className="w-6 h-6 mx-auto mb-2 text-orange-500" />
                  <div className="text-2xl font-bold text-white">{currentStreak}</div>
                  <div className="text-sm text-white">Current Streak</div>
                </CardContent>
              </Card>

              <Card className="bg-black border-gray-200">
                <CardContent className="p-4 text-center">
                  <Target className="w-6 h-6 mx-auto mb-2 text-green-500" />
                  <div className="text-2xl font-bold text-white">{longestStreak}</div>
                  <div className="text-sm text-white">Longest Streak</div>
                </CardContent>
              </Card>

              <Card className="bg-black border-gray-200">
                <CardContent className="p-4 text-center">
                  <Calendar className="w-6 h-6 mx-auto mb-2 text-blue-500" />
                  <div className="text-2xl font-bold text-white">{totalStudyDays}</div>
                  <div className="text-sm text-white">Total Study Days</div>
                </CardContent>
              </Card>

              <Card className="bg-black border-gray-200">
                <CardContent className="p-4 text-center">
                  <Clock className="w-6 h-6 mx-auto mb-2 text-purple-500" />
                  <div className="text-2xl font-bold text-white">
                    {thisWeekStudied}/{weeklyGoal}
                  </div>
                  <div className="text-sm text-white">This Week</div>
                </CardContent>
              </Card>
            </div>

            {/* Study Activity Tracker */}
            <Card className="bg-black border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="text-white">Study Activity</span>
                  <span className="text-sm font-normal text-white">
                    {totalStudyDays} study sessions in the last year
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {/* Month labels */}
                  <div className="flex justify-between text-xs text-white mb-2">
                    <span>Jan</span>
                    <span>Feb</span>
                    <span>Mar</span>
                    <span>Apr</span>
                    <span>May</span>
                    <span>Jun</span>
                    <span>Jul</span>
                    <span>Aug</span>
                    <span>Sep</span>
                    <span>Oct</span>
                    <span>Nov</span>
                    <span>Dec</span>
                  </div>

                  {/* Activity grid */}
                  <div className="grid grid-cols-53 gap-1">
                    {activityData.map((day, index) => (
                      <div
                        key={index}
                        className={`w-3 h-3 rounded-sm ${getActivityColor(day.level)}`}
                        title={`${day.date.toDateString()}: ${day.count} study sessions`}
                      />
                    ))}
                  </div>

                  {/* Legend */}
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-xs text-white">Less</span>
                    <div className="flex space-x-1">
                      <div className="w-3 h-3 bg-gray-100 rounded-sm"></div>
                      <div className="w-3 h-3 bg-gray-300 rounded-sm"></div>
                      <div className="w-3 h-3 bg-green-100 rounded-sm"></div>
                      <div className="w-3 h-3 bg-green-700 rounded-sm"></div>
                      <div className="w-3 h-3 bg-green-950 rounded-sm"></div>
                    </div>
                    <span className="text-xs text-white">More</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="bg-black border-gray-200">
              <CardHeader>
                <CardTitle className="text-white">Recent Study Sessions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <div>
                      <div className="font-medium text-white">Biology Flashcards</div>
                      <div className="text-sm text-white">Completed 25 cards • 2 hours ago</div>
                    </div>
                    <div className="text-sm text-white">+15 XP</div>
                  </div>

                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <div>
                      <div className="font-medium text-white">Chemistry Quiz</div>
                      <div className="text-sm text-white">Scored 85% • Yesterday</div>
                    </div>
                    <div className="text-sm text-white">+20 XP</div>
                  </div>

                  <div className="flex items-center justify-between py-2">
                    <div>
                      <div className="font-medium text-white">Spanish Vocabulary</div>
                      <div className="text-sm text-white">Reviewed 40 words • 2 days ago</div>
                    </div>
                    <div className="text-sm text-white">+12 XP</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
