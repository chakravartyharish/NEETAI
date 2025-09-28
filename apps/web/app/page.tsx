import Link from "next/link";
import { Card } from "@neet/ui/card";
import { Gradient } from "@neet/ui/gradient";

const FEATURES = [
  {
    title: "AI-Powered Learning",
    href: "/dashboard",
    description: "GPT-4o powered personalized study plans with predictive analytics and 90%+ score accuracy.",
    icon: "🧠"
  },
  {
    title: "Voice AI Tutor",
    href: "/tutor",
    description: "NEET Buddy 3.0 - Voice AI support in 8 Indian languages with cultural context.",
    icon: "🗣️"
  },
  {
    title: "Adaptive Quizzes",
    href: "/practice",
    description: "IRT-based adaptive testing with emotional intelligence and real-time difficulty adjustment.",
    icon: "🎯"
  },
  {
    title: "AR Question Scanner",
    href: "/scanner",
    description: "Advanced OCR with Battle Mode - gamified competitive problem-solving experience.",
    icon: "📱"
  },
];

const STATS = [
  { number: "230,000+", label: "Active Students" },
  { number: "50,000+", label: "NEET Questions" },
  { number: "30+", label: "Years of Data" },
  { number: "90%+", label: "Score Accuracy" },
];

export default function Page() {
  return (
    <main className="min-h-screen bg-slate-950">
      {/* Hero Section */}
      <div className="relative overflow-hidden min-h-screen">
        {/* Enhanced Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900"></div>

          {/* Primary gradient orbs */}
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-blue-500/30 to-purple-600/30 rounded-full mix-blend-screen filter blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-cyan-500/30 to-blue-600/30 rounded-full mix-blend-screen filter blur-3xl animate-pulse"></div>
          <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-br from-purple-500/20 to-pink-600/20 rounded-full mix-blend-screen filter blur-2xl animate-pulse"></div>

          {/* Secondary accent orbs */}
          <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-br from-yellow-400/40 to-orange-500/40 rounded-full mix-blend-screen filter blur-xl animate-pulse"></div>
          <div className="absolute bottom-32 right-32 w-40 h-40 bg-gradient-to-br from-green-400/30 to-emerald-500/30 rounded-full mix-blend-screen filter blur-xl animate-pulse"></div>

          {/* Floating particles */}
          <div className="absolute inset-0">
            <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white/50 rounded-full animate-ping"></div>
            <div className="absolute top-3/4 left-3/4 w-1 h-1 bg-blue-400/70 rounded-full animate-ping" style={{animationDelay: '1s'}}></div>
            <div className="absolute top-1/2 left-1/3 w-1.5 h-1.5 bg-purple-400/60 rounded-full animate-ping" style={{animationDelay: '2s'}}></div>
            <div className="absolute top-1/5 right-1/4 w-1 h-1 bg-cyan-400/60 rounded-full animate-ping" style={{animationDelay: '3s'}}></div>
          </div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-32">
          {/* Navigation */}
          <nav className="flex items-center justify-between mb-20 py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">N</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">NEET Prep AI</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/features" className="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 font-medium transition-colors">
                Features
              </Link>
              <Link href="/pricing" className="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 font-medium transition-colors">
                Pricing
              </Link>
              <Link href="/login" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200">
                Sign In
              </Link>
            </div>
          </nav>

          {/* Hero Content */}
          <div className="text-center">
            <div className="mb-6">
              <span className="inline-block px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full text-sm font-semibold mb-6">
                🚀 India's #1 AI-Powered NEET Platform
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-gray-900 dark:text-white mb-8 leading-tight">
              India's Most{" "}
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
                Intelligent
              </span>
              <br />
              <span className="text-4xl md:text-6xl lg:text-7xl">NEET Preparation Platform</span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
              Transform your NEET preparation with <span className="font-semibold text-blue-600 dark:text-blue-400">AI-powered personalized learning</span>, adaptive quizzes,
              voice tutoring in 8 Indian languages, and predictive analytics that improve scores by <span className="font-bold text-green-600">30-50%</span>.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              <Link
                href="/signup"
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-10 py-4 rounded-xl text-lg font-bold hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <span>Start Free Trial</span>
                <span>🚀</span>
              </Link>
              <Link
                href="/demo"
                className="border-2 border-blue-200 dark:border-blue-700 text-blue-600 dark:text-blue-400 px-10 py-4 rounded-xl text-lg font-semibold hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <span>Watch Demo</span>
                <span>▶️</span>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
              {STATS.map((stat, index) => (
                <div key={index} className="text-center p-6 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
                  <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-700 dark:text-gray-300 font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-32 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <span className="inline-block px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 rounded-full text-sm font-semibold mb-6">
              ✨ Cutting-Edge Features
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Why <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">230,000+ Students</span> Choose NEET Prep AI
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Experience the future of NEET preparation with cutting-edge AI technology,
              comprehensive question bank, and personalized learning paths.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {FEATURES.map((feature, index) => (
              <Card
                key={index}
                href={feature.href}
                title={feature.title}
                className="h-full"
              >
                <div className="text-5xl mb-6 text-center">{feature.icon}</div>
                <div className="text-gray-600 dark:text-gray-300 text-center">{feature.description}</div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-32 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0">
          <Gradient
            className="opacity-20 w-[600px] h-[600px] top-[-300px] right-[-300px]"
            conic
          />
        </div>

        <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            Ready to Transform Your <br />
            <span className="text-yellow-300">NEET Preparation?</span>
          </h2>
          <p className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto leading-relaxed">
            Join thousands of students who have improved their scores by 30-50% with our AI-powered platform.
            Start your journey to medical college today! 🎯
          </p>
          <Link
            href="/signup"
            className="bg-white text-blue-600 px-12 py-5 rounded-2xl text-xl font-bold hover:bg-gray-100 transition-all duration-300 inline-flex items-center space-x-3 shadow-2xl transform hover:scale-105"
          >
            <span>Start Your Free Trial Today</span>
            <span>🚀</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
