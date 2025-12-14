'use client';

import { useState, useEffect } from 'react';

export default function CodeLab() {
  const [language, setLanguage] = useState<'python' | 'csharp'>('python');
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [testResults, setTestResults] = useState<any[]>([]);

  const starterCode = {
    python: `# Example: Create a simple function
def greet(name):
    return f"Hello, {name}!"

# Test it
print(greet("World"))
`,
    csharp: `// Example: Create a simple function
using System;

class Program
{
    static void Main()
    {
        Console.WriteLine(Greet("World"));
    }

    static string Greet(string name)
    {
        return $"Hello, {name}!";
    }
}
`,
  };

  useEffect(() => {
    setCode(starterCode[language]);
  }, [language]);

  const handleRun = async () => {
    setLoading(true);
    setOutput('');
    setTestResults([]);

    try {
      const response = await fetch('/api/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          language,
          userId: 'default-user',
          exerciseId: 'exercise-1',
          testCases: [],
        }),
      });

      const data = await response.json();

      if (data.error) {
        setOutput(`❌ Error:\n${data.error}`);
      } else {
        setOutput(data.output || '(no output)');
      }

      setTestResults([
        {
          name: 'Execution',
          passed: !data.error,
          output: data.output,
        },
      ]);
    } catch (error: any) {
      setOutput(`❌ Failed to execute: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">📝 Code Lab</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Editor */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Editor</h2>
              <select
                value={language}
                onChange={(e) =>
                  setLanguage(e.target.value as 'python' | 'csharp')
                }
                className="bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white"
              >
                <option value="python">Python 3</option>
                <option value="csharp">C# (.NET)</option>
              </select>
            </div>

            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full h-96 bg-gray-800 border border-gray-700 rounded p-4 text-white font-mono"
              placeholder="Write your code here..."
            />

            <button
              onClick={handleRun}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-bold py-2 px-4 rounded"
            >
              {loading ? '⏳ Running...' : '▶ Run Code'}
            </button>
          </div>

          {/* Output */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Output</h2>

            <div className="bg-gray-800 border border-gray-700 rounded p-4 h-96 overflow-auto">
              <pre className="text-sm font-mono text-green-400 whitespace-pre-wrap">
                {output || '(output will appear here)'}
              </pre>
            </div>

            {testResults.length > 0 && (
              <div className="bg-gray-800 border border-gray-700 rounded p-4">
                <h3 className="font-bold mb-3">Test Results:</h3>
                {testResults.map((result, i) => (
                  <div
                    key={i}
                    className={`py-2 px-3 rounded mb-2 ${
                      result.passed
                        ? 'bg-green-900 text-green-200'
                        : 'bg-red-900 text-red-200'
                    }`}
                  >
                    {result.passed ? '✅' : '❌'} {result.name}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
