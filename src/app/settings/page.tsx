'use client';

import { useState } from 'react';
import BackButton from '@/components/BackButton';

export default function Settings() {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    localStorage.setItem('openai_api_key', apiKey);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="border-b border-gray-800 p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold">⚙️ Settings</h1>
          <p className="text-gray-400 mt-2">Configure your learning environment</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-6 py-12">
        <BackButton />

        {/* OpenAI API Key */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6">�� AI Tutor Setup</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold mb-2">OpenAI API Key</label>
              <p className="text-gray-400 text-sm mb-4">
                Your API key is stored locally and never sent to our servers. Get one at{' '}
                <a
                  href="https://platform.openai.com/api-keys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline"
                >
                  platform.openai.com/api-keys
                </a>
              </p>

              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <input
                    type={showKey ? 'text' : 'password'}
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="sk-..."
                    className="w-full bg-gray-700 border border-gray-600 rounded px-4 py-2 text-white placeholder-gray-500"
                  />
                  <button
                    onClick={() => setShowKey(!showKey)}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-white"
                  >
                    {showKey ? '👁️' : '🙈'}
                  </button>
                </div>
                <button
                  onClick={handleSave}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded font-bold"
                >
                  Save
                </button>
              </div>

              {saved && (
                <p className="text-green-400 text-sm mt-2">✅ API Key saved locally</p>
              )}
            </div>
          </div>
        </div>

        {/* Account */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-6">👤 Account</h2>

          <div className="space-y-4">
            <button className="w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded">
              📥 Export Progress
            </button>
            <button className="w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded">
              🗑️ Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
