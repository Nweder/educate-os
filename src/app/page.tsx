'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="border-b border-gray-800 p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold">🎓 EduPath OS</div>
          <div className="space-x-2 md:space-x-4 flex items-center">
            <Link
              href="/dashboard"
              className="px-4 py-2 rounded bg-gray-800 hover:bg-gray-700 text-sm md:text-base"
            >
              Dashboard
            </Link>
            <Link
              href="/codelab"
              className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-sm md:text-base"
            >
              Code Lab
            </Link>
            <div className="hidden md:flex border-l border-gray-700 pl-4 space-x-2">
              <Link
                href="/login"
                className="px-4 py-2 rounded border border-gray-600 hover:border-gray-500 text-sm"
              >
                Log In
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 rounded bg-green-600 hover:bg-green-700 text-sm font-bold"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 py-32 text-center">
        <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
          Education Operating System
        </h1>
        <p className="text-2xl text-gray-400 mb-8 max-w-2xl mx-auto">
          Master backend development with structured roadmaps, AI guidance, and code-first learning
        </p>

        <div className="space-y-4 mb-12">
          <p className="text-lg text-gray-500">
            ✨ Choose your language: Python 3 or C#<br />
            🤖 AI tutor provides hints, not solutions<br />
            📊 Track skills with proof-based evidence<br />
            �� 30-day comprehensive curriculum
          </p>
        </div>

        <div className="flex gap-4 justify-center flex-wrap">
          <Link
            href="/register"
            className="px-8 py-4 bg-green-600 hover:bg-green-700 rounded-lg text-xl font-bold"
          >
            Create Account →
          </Link>
          <Link
            href="/login"
            className="px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-lg text-xl font-bold"
          >
            Log In
          </Link>
          <Link
            href="/roadmap"
            className="px-8 py-4 bg-gray-800 hover:bg-gray-700 rounded-lg text-xl font-bold"
          >
            View Roadmap
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-8">
          <div className="text-4xl mb-4">💻</div>
          <h3 className="text-xl font-bold mb-3">Live Code Editor</h3>
          <p className="text-gray-400">
            Write and run Python or C# code directly in your browser with instant output
          </p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-lg p-8">
          <div className="text-4xl mb-4">🤖</div>
          <h3 className="text-xl font-bold mb-3">AI Tutor</h3>
          <p className="text-gray-400">
            Get hints and guidance without spoiling the solution. Learn the Socratic way
          </p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-lg p-8">
          <div className="text-4xl mb-4">📈</div>
          <h3 className="text-xl font-bold mb-3">Skill Graph</h3>
          <p className="text-gray-400">
            Build a visual proof of your learning with connected skill achievements
          </p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-lg p-8">
          <div className="text-4xl mb-4">🗺️</div>
          <h3 className="text-xl font-bold mb-3">30-Day Roadmap</h3>
          <p className="text-gray-400">
            Follow a structured curriculum from OOP basics to deploying production APIs
          </p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-lg p-8">
          <div className="text-4xl mb-4">✅</div>
          <h3 className="text-xl font-bold mb-3">Evidence-First</h3>
          <p className="text-gray-400">
            Submit code to earn evidence. Prove your skills through projects and submissions
          </p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-lg p-8">
          <div className="text-4xl mb-4">📊</div>
          <h3 className="text-xl font-bold mb-3">Analytics</h3>
          <p className="text-gray-400">
            Track your learning momentum, strengths, and areas for improvement
          </p>
        </div>
      </section>

      {/* Roadmap Preview */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-4xl font-bold mb-12 text-center">The 30-Day Journey</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { day: 1, title: 'OOP Foundations' },
            { day: 2, title: 'Inheritance & Polymorphism' },
            { day: 7, title: 'Class Design Project' },
            { day: 8, title: 'REST API Fundamentals' },
            { day: 14, title: 'Todo API Project' },
            { day: 21, title: 'Secure API with Auth' },
            { day: 29, title: 'Capstone: Task Manager' },
          ].map((item) => (
            <div
              key={item.day}
              className="bg-gray-900 border border-gray-800 rounded-lg p-6"
            >
              <div className="text-sm text-blue-400 font-bold">DAY {item.day}</div>
              <div className="text-lg font-bold">{item.title}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8 text-center text-gray-500">
        <p>EduPath OS • Building the next generation of backend developers</p>
      </footer>
    </div>
  );
}
