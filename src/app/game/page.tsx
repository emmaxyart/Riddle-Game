'use client';

import { useGame } from '@/context/GameContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import BackButton from '@/components/BackButton';

export default function GameDifficultySelection() {
  const { user } = useGame();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/');
    }
  }, [user, router]);

  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 bg-gradient-to-br from-purple-900/20 to-indigo-900/20 backdrop-blur-sm">
      <BackButton />
      <div className="w-full max-w-2xl backdrop-blur-md bg-foreground/10 rounded-xl sm:rounded-2xl border border-foreground/20 p-6 sm:p-8 shadow-2xl">
        <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-center bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Select Difficulty
        </h1>
        
        <div className="grid grid-cols-1 gap-4">
          <Link
            href="/game/easy"
            className="block p-6 rounded-xl bg-gradient-to-r from-green-500/20 to-green-600/20 hover:from-green-500/30 hover:to-green-600/30 border border-green-500/30 transition-all duration-300"
          >
            <h2 className="text-xl font-semibold mb-2 text-green-400">Easy Mode</h2>
            <p className="text-sm text-foreground/70">
              Perfect for beginners. Simple riddles with generous time limits.
            </p>
          </Link>

          <Link
            href="/game/medium"
            className="block p-6 rounded-xl bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 hover:from-yellow-500/30 hover:to-yellow-600/30 border border-yellow-500/30 transition-all duration-300"
          >
            <h2 className="text-xl font-semibold mb-2 text-yellow-400">Medium Mode</h2>
            <p className="text-sm text-foreground/70">
              Challenging riddles with moderate time pressure.
            </p>
          </Link>

          <Link
            href="/game/hard"
            className="block p-6 rounded-xl bg-gradient-to-r from-red-500/20 to-red-600/20 hover:from-red-500/30 hover:to-red-600/30 border border-red-500/30 transition-all duration-300"
          >
            <h2 className="text-xl font-semibold mb-2 text-red-400">Hard Mode</h2>
            <p className="text-sm text-foreground/70">
              Expert level riddles with strict time limits.
            </p>
          </Link>

          <Link
            href="/dashboard"
            className="block w-full px-6 py-4 mt-4 rounded-xl bg-foreground/20 hover:bg-foreground/30 text-center transition-all duration-300"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
