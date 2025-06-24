"use client"

import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs"
import GooeyNav from "@/blocks/Components/GooeyNav/GooeyNav"
import Squares from "@/blocks/Backgrounds/Squares/Squares"
import SplashCursor from "@/blocks/Animations/SplashCursor/SplashCursor"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Brain,
  Clock,
  Target,
  ArrowRight,
  CheckCircle,
  Shield,
  Smartphone,
  BarChart3,
  Twitter,
  MessageSquare,
  Mail,
} from "lucide-react"
import Link from "next/link"

const items = [
  { label: "Home", href: "/" },
  { label: "Dashboard", href: "/dashboard" },
  // { label: "Features", href: "#features" },
  // { label: "Pricing", href: "#pricing" },
]

export default function HomePage() {
  const { isSignedIn, user } = useUser()

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <SplashCursor />

      <GooeyNav
          items={items}
          particleCount={15}
          particleDistances={[90, 10]}
          particleR={100}
          initialActiveIndex={0}
          animationTime={600}
          timeVariance={300}
          colors={[1, 2, 3, 1, 2, 3, 1, 4]}
        />

      {/* Hero Section */}
      <div className="relative w-full">
        <Squares
          speed={0.5}
          squareSize={40}
          direction="diagonal"
          borderColor="#fff"
          hoverFillColor="#222"
          className="absolute inset-0 w-full h-full z-0 pointer-events-none"
        />
        <section className="px-4 py-16 md:py-24 relative z-10">
          <div className="max-w-6xl mx-auto text-center relative z-10 bg-black/90 backdrop-blur-sm rounded-xl shadow-2xl p-10 border border-gray-800">
            <Badge className="mb-6 bg-white/10 text-white border-white/20">🚀 AI-Powered Learning Platform</Badge>

            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Master Any Subject with
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                AI-Generated Study Tools
              </span>
            </h1>

            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Transform your study materials into interactive flashcards and quizzes. Learn smarter with AI-powered
              spaced repetition and achieve <strong>2x better retention</strong>
              in half the time.
            </p>

            {/* Key Benefits */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8">
              <div className="text-center p-6 bg-gray-900/50 border border-gray-700 rounded-lg backdrop-blur-sm">
                <Brain className="h-8 w-8 mx-auto mb-3 text-blue-400" />
                <h3 className="font-semibold mb-2 text-white">AI-Powered</h3>
                <p className="text-gray-300 text-sm">Smart flashcards generated from your content</p>
              </div>
              <div className="text-center p-6 bg-gray-900/50 border border-gray-700 rounded-lg backdrop-blur-sm">
                <Clock className="h-8 w-8 mx-auto mb-3 text-green-400" />
                <h3 className="font-semibold mb-2 text-white">Spaced Repetition</h3>
                <p className="text-gray-300 text-sm">Review at scientifically optimal intervals</p>
              </div>
              <div className="text-center p-6 bg-gray-900/50 border border-gray-700 rounded-lg backdrop-blur-sm">
                <Target className="h-8 w-8 mx-auto mb-3 text-purple-400" />
                <h3 className="font-semibold mb-2 text-white">Active Recall</h3>
                <p className="text-gray-300 text-sm">Test yourself for better retention</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {isSignedIn ? (
                <Link href="/dashboard">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
                  >
                    Go to Dashboard
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              ) : (
                <>
                  <SignUpButton mode="modal">
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
                    >
                      Start Learning Free
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </SignUpButton>
                  <Button
                    variant="outline"
                    size="lg"
                    className="bg-transparent text-white border-gray-600 hover:bg-gray-800 hover:text-white"
                  >
                    Watch Demo
                  </Button>
                </>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 pt-16 border-t border-gray-700">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400 mb-2">2x</div>
                <div className="text-gray-400">Faster Learning</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400 mb-2">95%</div>
                <div className="text-gray-400">Retention Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400 mb-2">10k+</div>
                <div className="text-gray-400">Active Students</div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Features Section */}
      <section id="features" className="px-4 py-16 bg-gray-900/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-blue-600/20 text-blue-400 border-blue-600/30">✨ Powerful Features</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Everything You Need to Excel</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Advanced AI technology meets proven learning science
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-600 rounded-lg">
                    <Brain className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-white">AI Flashcard Generation</CardTitle>
                    <CardDescription className="text-gray-400">Smart cards from any content</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span className="text-gray-300">Auto-generate from PDFs & text</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span className="text-gray-300">Key concept extraction</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span className="text-gray-300">Multiple question formats</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-600 rounded-lg">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-white">Spaced Repetition</CardTitle>
                    <CardDescription className="text-gray-400">Review at optimal intervals</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span className="text-gray-300">Scientifically-timed reviews</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span className="text-gray-300">Adaptive scheduling</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span className="text-gray-300">Long-term retention</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-600 rounded-lg">
                    <Target className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-white">Interactive Quizzes</CardTitle>
                    <CardDescription className="text-gray-400">Test your knowledge</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span className="text-gray-300">Multiple choice questions</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span className="text-gray-300">Instant feedback</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span className="text-gray-300">Progress tracking</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

          

           
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-teal-600 rounded-lg">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-white">Secure & Private</CardTitle>
                    <CardDescription className="text-gray-400">Your data is safe</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span className="text-gray-300">End-to-end encryption</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span className="text-gray-300">GDPR compliant</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span className="text-gray-300">No data selling</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="px-4 py-16 bg-black">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-purple-600/20 text-purple-400 border-purple-600/30">🎯 Simple Process</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">From Content to Mastery in Minutes</h2>
            <p className="text-xl text-gray-400">Transform any study material into an optimized learning experience</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Sign Up</h3>
              <p className="text-gray-400">Create your account with Clerk authentication</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Upload Content</h3>
              <p className="text-gray-400">Add PDFs, notes, or any study material</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">AI Generation</h3>
              <p className="text-gray-400">Watch AI create flashcards and quizzes</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                4
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Master Topics</h3>
              <p className="text-gray-400">Study smart with spaced repetition</p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="px-4 py-16 bg-gray-900/50">
        <div className="max-w-4xl mx-auto text-center">
          <Badge className="mb-4 bg-green-600/20 text-green-400 border-green-600/30">💬 Student Success</Badge>
          <h2 className="text-3xl font-bold mb-8 text-white">Loved by Students Worldwide</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-6">
                <p className="text-gray-300 mb-4">
                  "StudyAI helped me cut my study time in half while improving my grades. The spaced repetition is a
                  game-changer for medical school!"
                </p>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                    S
                  </div>
                  <div>
                    <div className="font-semibold text-white">Sarah M.</div>
                    <div className="text-sm text-gray-400">Medical Student</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-6">
                <p className="text-gray-300 mb-4">
                  "Finally, a study tool that actually works with how my brain learns. The AI flashcards are incredibly
                  accurate and save me hours of prep time."
                </p>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                    A
                  </div>
                  <div>
                    <div className="font-semibold text-white">Alex K.</div>
                    <div className="text-sm text-gray-400">Engineering Student</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-16 bg-gradient-to-r from-blue-900/50 to-purple-900/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Ready to Transform Your Learning?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of students who are already mastering their subjects with AI-powered study tools
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isSignedIn ? (
              <Link href="/dashboard">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
                >
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            ) : (
              <>
                <SignUpButton mode="modal">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
                  >
                    Start Free Trial
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </SignUpButton>
                <SignInButton mode="modal">
                  <Button
                    variant="outline"
                    size="lg"
                    className="bg-transparent text-white border-gray-600 hover:bg-gray-800 hover:text-white"
                  >
                    Sign In
                  </Button>
                </SignInButton>
              </>
            )}
          </div>
          <p className="text-sm text-gray-400 mt-4">No credit card required • Secure authentication with Clerk</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 px-4 py-12 bg-black">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <Brain className="h-8 w-8 text-white" />
                <span className="text-2xl font-bold text-white">Learn</span>
              </div>
              <p className="text-gray-400 mb-4 max-w-md">
                Transform your learning with AI-powered flashcards and spaced repetition. Study smarter, not harder.
              </p>
              <div className="flex space-x-4">
                <a
                  href="https://twitter.com/akshonite"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-blue-400 transition-colors"
                >
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="akshatsri1108@gmail.com" className="text-gray-400 hover:text-green-400 transition-colors">
                  <Mail className="h-5 w-5" />
                </a>
              </div>
            </div>

        

           
          </div>

          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-gray-400 text-sm mb-4 md:mb-0">© 2024 StudyAI. All rights reserved.</div>

              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2 text-sm text-gray-400">
                  <MessageSquare className="h-4 w-4" />
                  <span>Feedback & Support:</span>
                </div>
                
                <a
                  href="mailto:developers@studyai.com"
                  className="flex items-center space-x-2 text-green-400 hover:text-green-300 transition-colors text-sm"
                >
                  <Mail className="h-4 w-4" />
                  <span>akshatsri1108@gmail.com</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
