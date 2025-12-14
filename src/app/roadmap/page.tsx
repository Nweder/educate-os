'use client';

import Link from 'next/link';
import { useState } from 'react';
import BackButton from '@/components/BackButton';

const days = [
  { day: 1, title: 'OOP Foundations', difficulty: 'beginner', completed: false },
  { day: 2, title: 'Inheritance & Polymorphism', difficulty: 'beginner', completed: false },
  { day: 3, title: 'Abstract Classes & Interfaces', difficulty: 'intermediate', completed: false },
  { day: 4, title: 'Collections & Data Structures', difficulty: 'intermediate', completed: false },
  { day: 7, title: 'Project: Class Design', difficulty: 'intermediate', completed: false },
  { day: 8, title: 'REST API Fundamentals', difficulty: 'intermediate', completed: false },
  { day: 14, title: 'Project: Todo API', difficulty: 'intermediate', completed: false },
  { day: 21, title: 'Project: Secure API', difficulty: 'advanced', completed: false },
  { day: 29, title: 'Capstone: Task Manager API', difficulty: 'advanced', completed: false },
];

const difficultyColors = {
  beginner: 'bg-green-900 text-green-200',
  intermediate: 'bg-yellow-900 text-yellow-200',
  advanced: 'bg-red-900 text-red-200',
};

export default function Roadmap() {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="border-b border-gray-800 p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold">🗺️ 30-Day Backend Masterclass</h1>
          <p className="text-gray-400 mt-2">Master backend development: OOP → REST APIs → Authentication → Deployment</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <BackButton />

        {/* Progress */}
        <div className="mb-12 bg-gray-800 border border-gray-700 rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Your Progress</h2>
          <div className="w-full bg-gray-700 rounded-full h-4">
            <div className="bg-blue-600 h-4 rounded-full w-0" style={{ width: '0%' }}></div>
          </div>
          <p className="text-gray-400 mt-2">0 of 30 days completed (0%)</p>
        </div>

        {/* Days Timeline */}
        <div className="space-y-4">
          {days.map((dayInfo, idx) => (
            <div
              key={dayInfo.day}
              className="bg-gray-800 border border-gray-700 rounded-lg p-6 hover:border-blue-500 cursor-pointer transition"
              onClick={() => setSelectedDay(selectedDay === dayInfo.day ? null : dayInfo.day)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center font-bold">
                    {dayInfo.day}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{dayInfo.title}</h3>
                    <p className="text-gray-400 text-sm">Day {dayInfo.day}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1 rounded text-sm ${difficultyColors[dayInfo.difficulty as keyof typeof difficultyColors]}`}>
                    {dayInfo.difficulty.toUpperCase()}
                  </span>
                  <span className="text-2xl">{dayInfo.completed ? '✅' : '⭕'}</span>
                </div>
              </div>

              {/* Details */}
              {selectedDay === dayInfo.day && (
                <div className="mt-4 pt-4 border-t border-gray-700 space-y-3">
                  <div>
                    <p className="text-gray-400 text-sm mb-2">SKILLS:</p>
                    <div className="flex flex-wrap gap-2">
                      {['OOP', 'Design Patterns', 'Code Architecture'].slice(0, 2).map((skill) => (
                        <span key={skill} className="bg-blue-900 text-blue-200 px-2 py-1 rounded text-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <Link
                    href="/codelab"
                    className="inline-block mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
                  >
                    Start Exercise →
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
