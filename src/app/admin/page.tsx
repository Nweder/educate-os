'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import BackButton from '@/components/BackButton';
import { User } from '@/types';

interface Submission {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  exerciseId: string;
  exerciseTitle: string;
  language: string;
  status: string;
  submittedAt: string;
}

export default function AdminPage() {
  const router = useRouter();
  const [adminUser, setAdminUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'submissions'>('overview');
  const [filterLanguage, setFilterLanguage] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Check if admin
        const authRes = await fetch('/api/auth/me');
        if (!authRes.ok) {
          router.push('/login');
          return;
        }

        const authData = await authRes.json();
        if (authData.user.role !== 'Admin') {
          router.push('/dashboard');
          return;
        }

        setAdminUser(authData.user);

        // Fetch users
        const usersRes = await fetch('/api/admin/users');
        if (usersRes.ok) {
          const usersData = await usersRes.json();
          setUsers(usersData.users);
        }

        // Fetch submissions
        let submissionsUrl = '/api/admin/submissions';
        const params = new URLSearchParams();
        if (filterLanguage) params.append('language', filterLanguage);
        if (filterStatus) params.append('status', filterStatus);
        if (params.toString()) {
          submissionsUrl += `?${params.toString()}`;
        }

        const submissionsRes = await fetch(submissionsUrl);
        if (submissionsRes.ok) {
          const submissionsData = await submissionsRes.json();
          setSubmissions(submissionsData.submissions);
        }
      } catch (err) {
        console.error('Failed to fetch admin data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router, filterLanguage, filterStatus]);

  const handleToggleUser = async (userId: string) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
      });

      if (res.ok) {
        const data = await res.json();
        setUsers(users.map((u) => (u.id === userId ? data.user : u)));
      }
    } catch (err) {
      console.error('Failed to toggle user:', err);
    }
  };

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
        <div className="text-2xl">Loading admin panel...</div>
      </div>
    );
  }

  if (!adminUser) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Back Button */}
      <div className="border-b border-gray-800 p-6 bg-gray-950">
        <div className="max-w-7xl mx-auto">
          <BackButton />
        </div>
      </div>

      {/* Navigation */}
      <nav className="border-b border-gray-800 p-6 bg-gray-950">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold hover:text-blue-400">
            🎓 EduPath OS
          </Link>
          <div className="space-x-4 flex items-center">
            <span className="text-purple-400 font-bold">👑 Admin Panel</span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded bg-red-600 hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Welcome */}
        <section className="mb-8">
          <h1 className="text-4xl font-bold mb-2">👑 Admin Dashboard</h1>
          <p className="text-gray-400">Manage users, view submissions, and monitor platform activity</p>
        </section>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-gray-800">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 font-bold transition ${
              activeTab === 'overview'
                ? 'border-b-2 border-purple-500 text-purple-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 font-bold transition ${
              activeTab === 'users'
                ? 'border-b-2 border-purple-500 text-purple-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Users ({users.length})
          </button>
          <button
            onClick={() => setActiveTab('submissions')}
            className={`px-4 py-2 font-bold transition ${
              activeTab === 'submissions'
                ? 'border-b-2 border-purple-500 text-purple-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Submissions ({submissions.length})
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <section className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                <div className="text-gray-400 text-sm">Total Users</div>
                <div className="text-3xl font-bold mt-2">{users.length}</div>
              </div>
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                <div className="text-gray-400 text-sm">Active Users</div>
                <div className="text-3xl font-bold mt-2 text-green-400">
                  {users.filter((u) => u.enabled).length}
                </div>
              </div>
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                <div className="text-gray-400 text-sm">Disabled Users</div>
                <div className="text-3xl font-bold mt-2 text-red-400">
                  {users.filter((u) => !u.enabled).length}
                </div>
              </div>
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                <div className="text-gray-400 text-sm">Total Submissions</div>
                <div className="text-3xl font-bold mt-2">{submissions.length}</div>
              </div>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <p className="text-gray-400">
                  ✅ Manage user accounts (enable/disable)
                </p>
                <p className="text-gray-400">
                  ✅ View all code submissions and test results
                </p>
                <p className="text-gray-400">
                  ✅ Filter submissions by language (Python/C#) and status (passed/failed)
                </p>
                <p className="text-gray-400">
                  ✅ Monitor user activity and engagement
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <section>
            <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-800">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-bold">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-bold">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-bold">Role</th>
                      <th className="px-6 py-3 text-left text-xs font-bold">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-bold">Joined</th>
                      <th className="px-6 py-3 text-left text-xs font-bold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="border-t border-gray-800 hover:bg-gray-800">
                        <td className="px-6 py-3">{user.name}</td>
                        <td className="px-6 py-3 text-sm text-gray-400">{user.email}</td>
                        <td className="px-6 py-3">
                          <span className={user.role === 'Admin' ? 'text-purple-400' : 'text-green-400'}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-3">
                          <span className={user.enabled ? 'text-green-400' : 'text-red-400'}>
                            {user.enabled ? '✅ Active' : '❌ Disabled'}
                          </span>
                        </td>
                        <td className="px-6 py-3 text-sm text-gray-400">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-3">
                          <button
                            onClick={() => handleToggleUser(user.id)}
                            className={`px-3 py-1 rounded text-xs font-bold transition ${
                              user.enabled
                                ? 'bg-red-600 hover:bg-red-700'
                                : 'bg-green-600 hover:bg-green-700'
                            }`}
                          >
                            {user.enabled ? 'Disable' : 'Enable'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {/* Submissions Tab */}
        {activeTab === 'submissions' && (
          <section>
            {/* Filters */}
            <div className="flex gap-4 mb-6">
              <select
                value={filterLanguage}
                onChange={(e) => setFilterLanguage(e.target.value)}
                className="px-4 py-2 bg-gray-900 border border-gray-800 rounded-lg focus:border-blue-500 focus:outline-none"
              >
                <option value="">All Languages</option>
                <option value="python">Python 3</option>
                <option value="csharp">C#</option>
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 bg-gray-900 border border-gray-800 rounded-lg focus:border-blue-500 focus:outline-none"
              >
                <option value="">All Statuses</option>
                <option value="passed">Passed</option>
                <option value="failed">Failed</option>
                <option value="testing">Testing</option>
                <option value="submitted">Submitted</option>
              </select>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-800">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-bold">User</th>
                      <th className="px-6 py-3 text-left text-xs font-bold">Exercise</th>
                      <th className="px-6 py-3 text-left text-xs font-bold">Language</th>
                      <th className="px-6 py-3 text-left text-xs font-bold">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-bold">Submitted</th>
                    </tr>
                  </thead>
                  <tbody>
                    {submissions.map((submission) => (
                      <tr key={submission.id} className="border-t border-gray-800 hover:bg-gray-800">
                        <td className="px-6 py-3">
                          <div className="text-sm font-semibold">{submission.userName}</div>
                          <div className="text-xs text-gray-400">{submission.userEmail}</div>
                        </td>
                        <td className="px-6 py-3">{submission.exerciseTitle}</td>
                        <td className="px-6 py-3">
                          <span className={submission.language === 'python' ? 'text-blue-400' : 'text-purple-400'}>
                            {submission.language === 'python' ? 'Python 3' : 'C#'}
                          </span>
                        </td>
                        <td className="px-6 py-3">
                          <span
                            className={
                              submission.status === 'passed'
                                ? 'text-green-400'
                                : submission.status === 'failed'
                                ? 'text-red-400'
                                : 'text-yellow-400'
                            }
                          >
                            {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-3 text-sm text-gray-400">
                          {new Date(submission.submittedAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {submissions.length === 0 && (
              <div className="text-center py-8 text-gray-400">
                No submissions found
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}
