'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import BackButton from '@/components/BackButton';
import { User } from '@/types';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/auth/me');

        if (!response.ok) {
          router.push('/login');
          return;
        }

        const data = await response.json();
        setUser(data.user);
      } catch (err) {
        console.error('Failed to fetch user:', err);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-2xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Back Button */}
      <div className="max-w-6xl mx-auto px-4 pt-4 pb-2">
        <BackButton />
      </div>

      {/* Navigation */}
      <nav className="border-b border-gray-800 p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold hover:text-blue-400">
            🎓 EduPath OS
          </Link>
          <div className="space-x-4 flex items-center">
            <Link href="/codelab" className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700">
              Code Lab
            </Link>
            <Link href="/roadmap" className="px-4 py-2 rounded bg-gray-800 hover:bg-gray-700">
              Roadmap
            </Link>
            {user.role === 'Admin' && (
              <Link href="/admin" className="px-4 py-2 rounded bg-purple-600 hover:bg-purple-700 font-bold">
                Admin
              </Link>
            )}
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded bg-red-600 hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Welcome Section */}
        <section className="mb-12">
          <h1 className="text-4xl font-bold mb-4">
            Welcome, <span className="text-blue-400">{user.name}</span>! 👋
          </h1>
          <p className="text-gray-400 text-lg">Ready to continue your backend development journey?</p>
        </section>

        {/* Quick Stats */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <div className="text-gray-400 text-sm">Current Day</div>
            <div className="text-3xl font-bold mt-2">Day 1</div>
            <div className="text-gray-500 text-xs mt-2">OOP Foundations</div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <div className="text-gray-400 text-sm">Exercises Done</div>
            <div className="text-3xl font-bold mt-2">0</div>
            <div className="text-gray-500 text-xs mt-2">Start coding!</div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <div className="text-gray-400 text-sm">Skills Earned</div>
            <div className="text-3xl font-bold mt-2">0</div>
            <div className="text-gray-500 text-xs mt-2">Evidence collected</div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <div className="text-gray-400 text-sm">Role</div>
            <div className="text-3xl font-bold mt-2 text-green-400">{user.role}</div>
            <div className="text-gray-500 text-xs mt-2">User Status</div>
          </div>
        </section>

        {/* Main CTA */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-gradient-to-br from-blue-900 to-blue-800 border border-blue-700 rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-4">💻 Code Lab</h2>
            <p className="text-gray-300 mb-6">Write Python or C# code, run it instantly, and see results.</p>
            <Link
              href="/codelab"
              className="inline-block px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-bold"
            >
              Start Coding →
            </Link>
          </div>

          <div className="bg-gradient-to-br from-purple-900 to-purple-800 border border-purple-700 rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-4">🗺️ Roadmap</h2>
            <p className="text-gray-300 mb-6">30-day curriculum with exercises and progress tracking.</p>
            <Link
              href="/roadmap"
              className="inline-block px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-bold"
            >
              View Roadmap →
            </Link>
          </div>
        </section>

        {/* Getting Started */}
        <section className="bg-gray-900 border border-gray-800 rounded-lg p-8 mb-12">
          <h2 className="text-2xl font-bold mb-6">📚 Getting Started</h2>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="text-2xl">1️⃣</div>
              <div>
                <h3 className="font-bold">Visit the Roadmap</h3>
                <p className="text-gray-400 text-sm">See the 30-day curriculum and daily goals</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-2xl">2️⃣</div>
              <div>
                <h3 className="font-bold">Pick a Language</h3>
                <p className="text-gray-400 text-sm">Learn with Python 3 or C# (.NET)</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-2xl">3️⃣</div>
              <div>
                <h3 className="font-bold">Code & Test</h3>
                <p className="text-gray-400 text-sm">Use the Code Lab to write and run exercises</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-2xl">4️⃣</div>
              <div>
                <h3 className="font-bold">Save Evidence</h3>
                <p className="text-gray-400 text-sm">Pass tests to earn skills and proof of learning</p>
              </div>
            </div>
          </div>
        </section>

        {/* Account Info */}
        <section className="bg-gray-900 border border-gray-700 rounded-lg p-6">
          <h3 className="font-bold mb-4">Account Information</h3>
          <div className="space-y-2 text-gray-400 text-sm">
            <p><span className="text-white font-semibold">Email:</span> {user.email}</p>
            <p><span className="text-white font-semibold">Name:</span> {user.name}</p>
            <p><span className="text-white font-semibold">Role:</span> {user.role}</p>
            <p><span className="text-white font-semibold">Status:</span> {user.enabled ? '✅ Active' : '❌ Disabled'}</p>
            <p><span className="text-white font-semibold">Joined:</span> {new Date(user.createdAt).toLocaleDateString()}</p>
          </div>
        </section>
      </main>
    </div>
  );
}
