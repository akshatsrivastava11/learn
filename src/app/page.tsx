import GooeyNav from "@/blocks/Components/GooeyNav/GooeyNav";
import Squares from "@/blocks/Backgrounds/Squares/Squares";
import SplashCursor from "@/blocks/Animations/SplashCursor/SplashCursor";
  const items = [

  { label: "Home", href: "#" },

  { label: "About", href: "#" },

  { label: "Contact", href: "#" },

];

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, Clock, Target, ArrowRight, CheckCircle } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <SplashCursor/>
      
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
          direction='diagonal'
          borderColor='#fff'
          hoverFillColor='#222'
          className="absolute inset-0 w-full h-full z-0 pointer-events-none"
        />
        <section className="px-4 py-16 md:py-24 relative z-10">
          <div className="max-w-6xl mx-auto text-center relative z-10 bg-black rounded-xl shadow-2xl p-10">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Smarter Studying with
              <br />
              <span className="text-white">AI Flashcards & Spaced Repetition</span>
            </h1>
            <p className="text-xl text-white mb-8 max-w-3xl mx-auto">
              Join the 21st century of learning and ace your exams with <strong>2x less study time</strong>. Learn
              uses AI-generated flashcards, spaced repetition, and active recall to help you study smarter, not harder.
            </p>

            {/* Key Benefits */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8">
              <div className="text-center p-6 border border-gray-200 rounded-lg">
                <Brain className="h-8 w-8 mx-auto mb-3 text-white" />
                <h3 className="font-semibold mb-2">AI-Powered</h3>
                <p className="text-white text-sm">Smart flashcards generated from your content</p>
              </div>
              <div className="text-center p-6 border border-gray-200 rounded-lg">
                <Clock className="h-8 w-8 mx-auto mb-3 text-white" />
                <h3 className="font-semibold mb-2">Spaced Repetition</h3>
                <p className="text-white text-sm">Review at scientifically optimal intervals</p>
              </div>
              <div className="text-center p-6 border border-gray-200 rounded-lg">
                <Target className="h-8 w-8 mx-auto mb-3 text-white" />
                <h3 className="font-semibold mb-2">Active Recall</h3>
                <p className="text-white text-sm">Test yourself for better retention</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" className="bg-black text-white hover:bg-gray-800">
                Start Learning Smarter
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="bg-white text-black border-black hover:bg-black hover:text-white"
              >
                Watch Demo
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 pt-16 border-t border-gray-200">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-600 mb-2">2x</div>
                <div className="text-gray-600">Less Study Time</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-600 mb-2">95%</div>
                <div className="text-gray-600">Retention Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-600 mb-2">10k+</div>
                <div className="text-gray-600">Students Studying Smarter</div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Features Section */}
      <section id="features" className="px-4 py-16 bg-black">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">The Science of Smarter Learning</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our AI combines proven memory techniques with cutting-edge technology
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-white border-gray-200">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-black rounded-lg">
                    <Brain className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">AI Flashcard Generation</CardTitle>
                    <CardDescription>Smart cards from any content</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-black" />
                    <span>Auto-generate from PDFs & text</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-black" />
                    <span>Key concept extraction</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-black" />
                    <span>Multiple question formats</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-white border-gray-200">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-black rounded-lg">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Spaced Repetition</CardTitle>
                    <CardDescription>Review at optimal intervals</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-black" />
                    <span>Scientifically-timed reviews</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-black" />
                    <span>Adaptive scheduling</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-black" />
                    <span>Long-term retention</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-white border-gray-200">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-black rounded-lg">
                    <Target className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Active Recall</CardTitle>
                    <CardDescription>Memory techniques that work</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-black" />
                    <span>Test-based learning</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-black" />
                    <span>Confidence-based repetition</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-black" />
                    <span>Progress tracking</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">From Content to Mastery in Minutes</h2>
            <p className="text-xl text-gray-600">Transform any study material into an optimized learning experience</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Create Account</h3>
              <p className="text-gray-600">Sign up and choose your study preferences</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Add Content</h3>
              <p className="text-gray-600">Input your study material through various methods</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Smart Review</h3>
              <p className="text-gray-600">Study with spaced repetition and active recall techniques</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                4
              </div>
              <h3 className="text-xl font-semibold mb-2">Ace Your Exams</h3>
              <p className="text-gray-600">Achieve better results with 2x less study time</p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="px-4 py-16 bg-black">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Join the 21st Century of Learning</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="bg-white">
              <CardContent className="p-6">
                <p className="text-gray-600 mb-4">
                  "Learn helped me cut my study time in half while improving my grades. The spaced repetition is a
                  game-changer!"
                </p>
                <div className="font-semibold">Sarah M., Medical Student</div>
              </CardContent>
            </Card>
            <Card className="bg-white">
              <CardContent className="p-6">
                <p className="text-gray-600 mb-4">
                  "Finally, a study tool that actually works with how my brain learns. The AI flashcards are incredibly
                  accurate."
                </p>
                <div className="font-semibold">Alex K., Engineering Student</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-16 bg-black text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Study Smarter?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of students who are already acing their exams with 2x less study time
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-black hover:bg-gray-200">
              Start Free Trial
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="bg-transparent text-white border-white hover:bg-white hover:text-black"
            >
              View Pricing
            </Button>
          </div>
          <p className="text-sm text-gray-400 mt-4">No credit card required • 7-day free trial</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 px-4 py-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <Brain className="h-6 w-6 text-black" />
            <span className="text-xl font-bold">Learn</span>
          </div>
          <div className="flex space-x-6 text-gray-600">
            <a href="#" className="hover:text-black transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-black transition-colors">
              Terms of Service
            </a>
            <a href="#" className="hover:text-black transition-colors">
              Support
            </a>
            <a href="#" className="hover:text-black transition-colors">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
