'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '@/context/GameContext';
import VolumeControl from '@/components/VolumeControl';
import LoginForm from '@/components/LoginForm';

export default function IntroPage() {
  const router = useRouter();
  const { toggleMusic, isMusicPlaying } = useGame();
  const [showContent, setShowContent] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const titleVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1.2,
        ease: "easeOut"
      }
    }
  };

  const puzzlePieceVariants = {
    hidden: { opacity: 0, rotate: -180, scale: 0 },
    visible: {
      opacity: 1,
      rotate: 0,
      scale: 1,
      transition: {
        duration: 1.5,
        ease: "easeOut",
        type: "spring",
        bounce: 0.5
      }
    }
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.8,
        duration: 0.8
      }
    }
  };

  const modalVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1 }
  };

  return (
    <div className="relative min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/30 via-black to-black">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      
      {/* Audio and Instructions Controls */}
      <div className="absolute top-4 right-4 flex items-center gap-4 z-50">
        <div className="flex items-center gap-2">
          <button
            onClick={toggleMusic}
            className="p-2 rounded-full bg-foreground/10 hover:bg-foreground/20 transition-colors"
            aria-label={isMusicPlaying ? 'Mute music' : 'Unmute music'}
          >
            {isMusicPlaying ? '🔊' : '🔈'}
          </button>
          <VolumeControl />
        </div>
        
        <button
          onClick={() => setShowInstructions(true)}
          className="p-2 rounded-full bg-foreground/10 hover:bg-foreground/20 transition-colors"
          aria-label="Show instructions"
        >
          ❔
        </button>
      </div>

      {showContent && (
        <motion.div 
          className="relative min-h-screen flex flex-col items-center justify-center p-4"
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={puzzlePieceVariants} className="text-8xl mb-8">
            🧩
          </motion.div>

          <motion.h1 
            variants={titleVariants}
            className="text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent text-center"
          >
            Riddle Quest
          </motion.h1>

          <motion.div
            variants={contentVariants}
            className="max-w-md text-center mb-12"
          >
            <p className="text-xl text-foreground/80">
              Embark on a journey of mind-bending riddles and puzzles
            </p>
          </motion.div>

          <motion.button
            variants={contentVariants}
            className="px-8 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:opacity-90 transition-opacity"
            onClick={() => setShowLoginModal(true)}
          >
            Begin Your Quest
          </motion.button>
        </motion.div>
      )}

      {/* Login Modal */}
      {showLoginModal && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setShowLoginModal(false)}
        >
          <motion.div
            className="w-full max-w-md backdrop-blur-md bg-foreground/10 rounded-2xl border border-foreground/20 p-8 shadow-2xl"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            onClick={e => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent text-center">
              Login to Begin
            </h2>
            <LoginForm onSuccess={() => router.push('/dashboard')} />
          </motion.div>
        </motion.div>
      )}

      {/* Instructions Modal */}
      {showInstructions && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setShowInstructions(false)}
        >
          <motion.div
            className="w-full max-w-lg bg-gradient-to-br from-purple-900/90 to-indigo-900/90 rounded-2xl border border-foreground/20 p-6 sm:p-8 shadow-2xl m-4"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                How to Play
              </h2>
              <button
                onClick={() => setShowInstructions(false)}
                className="text-foreground/60 hover:text-foreground/80"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4 text-foreground/80">
              <p>🎯 Choose a difficulty level to start playing.</p>
              <p>⏱️ Each riddle has a time limit - answer quickly for bonus points!</p>
              <p>💡 Use hints wisely - they can help you but will reduce your final score.</p>
              <p>🎵 Toggle background music and adjust volume to your preference.</p>
              <p>🏆 Complete all riddles to see your final score and achievements!</p>
            </div>
            <button
              onClick={() => setShowInstructions(false)}
              className="mt-6 w-full px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:opacity-90 transition-opacity"
            >
              Got it!
            </button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
} // Added missing closing brace here

