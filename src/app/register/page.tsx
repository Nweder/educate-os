'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import BackButton from '@/components/BackButton';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Client-side validation
    if (!name || !email || !password || !confirmPassword) {
      setError('All fields are required');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Registration failed');
        setLoading(false);
        return;
      }

      // Registration successful - redirect to dashboard
      router.push('/dashboard');
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error('Registration error:', err);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md max-h-screen overflow-y-auto py-4">
        {/* Back Button */}
        <BackButton />

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">🎓 EduPath OS</h1>
          <h2 className="text-xl sm:text-2xl font-bold">Create Account</h2>
          <p className="text-gray-400 mt-2 text-sm sm:text-base">Start your learning journey today</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium mb-2">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Username (3+ chars, no spaces)"
              className="w-full px-4 py-3 sm:py-2 bg-gray-900 border border-gray-700 rounded-lg focus:border-blue-500 focus:outline-none text-base"
              disabled={loading}
            />
            <p className="text-xs text-gray-500 mt-1">Letters and numbers only, 3+ characters</p>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full px-4 py-3 sm:py-2 bg-gray-900 border border-gray-700 rounded-lg focus:border-blue-500 focus:outline-none text-base"
              disabled={loading}
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 sm:py-2 bg-gray-900 border border-gray-700 rounded-lg focus:border-blue-500 focus:outline-none text-base"
              disabled={loading}
            />
            <p className="text-xs text-gray-500 mt-1">4+ characters, letters and numbers only</p>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium mb-2">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 sm:py-2 bg-gray-900 border border-gray-700 rounded-lg focus:border-blue-500 focus:outline-none text-base"
              disabled={loading}
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-900 border border-red-700 rounded-lg text-red-200">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 rounded-lg font-bold transition"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        {/* Login Link */}
        <div className="text-center mt-6">
          <p className="text-gray-400">
            Already have an account?{' '}
            <Link href="/login" className="text-blue-400 hover:text-blue-300 font-bold">
              Log in
            </Link>
          </p>
        </div>

        {/* Back Home */}
        <div className="text-center mt-4">
          <Link href="/" className="text-gray-400 hover:text-gray-300 text-sm">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
