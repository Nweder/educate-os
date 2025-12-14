'use client';

import { useState } from 'react';
import BackButton from '@/components/BackButton';

const skillCategories = {
  'fundamentals': [
    { name: 'Object-Oriented Programming', level: 0 },
    { name: 'Exception Handling', level: 0 },
  ],
  'oop': [
    { name: 'Encapsulation', level: 0 },
    { name: 'Inheritance', level: 0 },
    { name: 'Polymorphism', level: 0 },
    { name: 'Abstract Classes', level: 0 },
    { name: 'Interfaces', level: 0 },
  ],
  'backend': [
    { name: 'REST APIs', level: 0 },
    { name: 'HTTP Protocol', level: 0 },
    { name: 'CRUD Operations', level: 0 },
  ],
  'security': [
    { name: 'Authentication', level: 0 },
    { name: 'Authorization', level: 0 },
    { name: 'JWT Tokens', level: 0 },
  ],
};

export default function Skills() {
  const [filter, setFilter] = useState('all');

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="border-b border-gray-800 p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold">📈 Skill Graph</h1>
          <p className="text-gray-400 mt-2">Track your expertise across different domains</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <BackButton />

        {/* Overall Progress */}
        <div className="mb-12 bg-gray-800 border border-gray-700 rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Overall Proficiency</h2>
          <div className="text-5xl font-bold text-blue-400">0%</div>
          <p className="text-gray-400 mt-2">Complete exercises to build your skills</p>
        </div>

        {/* Filters */}
        <div className="mb-8 flex gap-2 flex-wrap">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded ${filter === 'all' ? 'bg-blue-600' : 'bg-gray-800'}`}
          >
            All Skills
          </button>
          {Object.keys(skillCategories).map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded capitalize ${filter === cat ? 'bg-blue-600' : 'bg-gray-800'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(skillCategories).map(([category, skills]) => {
            if (filter !== 'all' && filter !== category) return null;

            return (
              <div key={category} className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-4 capitalize">{category}</h3>
                <div className="space-y-4">
                  {skills.map((skill) => (
                    <div key={skill.name}>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm">{skill.name}</span>
                        <span className="text-sm text-gray-400">{skill.level}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full transition-all"
                          style={{ width: `${skill.level}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
