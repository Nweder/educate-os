'use client';

import Link from 'next/link';

export default function BackButton() {
  return (
    <Link
      href="/"
      className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors mb-6"
    >
      <span className="text-xl">←</span>
      <span>Back to Home</span>
    </Link>
  );
}
