'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { User, GameState } from '@/types';
import { playBackgroundMusic, pauseBackgroundMusic, setMusicVolume } from '@/utils/music';

interface GameContextType {
  user: User | null;
  gameState: GameState;
  isMusicPlaying: boolean;
  login: (username: string) => boolean;
  logout: () => void;
  toggleMusic: () => void;
  resetGame: () => void;
  resetHighScore: () => void;
  updateScore: (points: number, timeRemaining: number, answerTime: number) => void;
  useHint: () => boolean;
  updateAvatar: (avatarData: string) => Promise<void>;
  updateUsername: (newUsername: string) => void;
  completeGame: (usedHints: boolean) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

const DEFAULT_GAME_STATE: GameState = {
  currentRiddle: 0,
  score: 0,
  isPlaying: false,
  multiplier: 0,
  gameMode: 'easy'  // Adding default game mode
};

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [gameState, setGameState] = useState<GameState>(DEFAULT_GAME_STATE);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }

      // Set initial volume and start playing
      setMusicVolume(0.3);
      playBackgroundMusic();
      setIsMusicPlaying(true);

      return () => {
        pauseBackgroundMusic();
      };
    } catch (error) {
      console.error('Error initializing game:', error);
    }
  }, []);

  const login = (username: string): boolean => {
    try {
      if (!username.trim()) return false;

      const existingUser = localStorage.getItem(`user_${username}`);
      const currentDate = new Date().toISOString();
      
      let newUser;
      if (existingUser) {
        const parsedUser = JSON.parse(existingUser);
        // Calculate streak
        const lastLoginDate = new Date(parsedUser.lastLoginDate);
        const daysSinceLastLogin = Math.floor(
          (new Date().getTime() - lastLoginDate.getTime()) / (1000 * 60 * 60 * 24)
        );
        
        newUser = {
          ...parsedUser,
          lastLoginDate: currentDate,
          streak: daysSinceLastLogin === 1 ? parsedUser.streak + 1 : daysSinceLastLogin === 0 ? parsedUser.streak : 0,
        };
      } else {
        newUser = {
          username,
          highScore: 0,
          hintsRemaining: 15,
          lastLoginDate: currentDate,
          streak: 0,
          totalGames: 0,
          totalCorrectAnswers: 0,
          fastestAnswer: Infinity,
          gamesWithoutHints: 0,
          lastPlayedDate: currentDate,
          avatar: '',
        };
      }

      setUser(newUser);
      saveUserToStorage(newUser);
      return true;
    } catch (error) {
      console.error('Error during login:', error);
      return false;
    }
  };

  // Helper function to save user data to storage
  const saveUserToStorage = (userData: User) => {
    try {
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem(`user_${userData.username}`, JSON.stringify(userData));
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  };

  const logout = () => {
    try {
      setUser(null);
      localStorage.removeItem('user');
      resetGame();
      pauseBackgroundMusic();
      setIsMusicPlaying(false);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const toggleMusic = () => {
    try {
      if (isMusicPlaying) {
        pauseBackgroundMusic();
      } else {
        playBackgroundMusic();
      }
      setIsMusicPlaying(!isMusicPlaying);
    } catch (error) {
      console.error('Error toggling music:', error);
    }
  };

  const resetGame = () => {
    setGameState({
      ...DEFAULT_GAME_STATE,
      currentRiddle: 0,
      score: 0,
      isPlaying: true,
    });

    if (user) {
      const updatedUser = {
        ...user,
        hintsRemaining: 15,
        totalGames: user.totalGames + 1,
        lastPlayedDate: new Date().toISOString(),
      };
      setUser(updatedUser);
      saveUserToStorage(updatedUser);
    }
  };

  const resetHighScore = () => {
    try {
      if (user) {
        const updatedUser = { ...user, highScore: 0 };
        setUser(updatedUser);
        saveUserToStorage(updatedUser);
      }
    } catch (error) {
      console.error('Error resetting high score:', error);
    }
  };

  const updateScore = (points: number, timeRemaining: number, answerTime: number) => {
    try {
      if (!user) return;

      const timeBonus = Math.floor(timeRemaining / 5);
      const totalPoints = points + timeBonus;
      const newScore = gameState.score + totalPoints;

      const updatedUser = {
        ...user,
        totalCorrectAnswers: user.totalCorrectAnswers + 1,
        fastestAnswer: Math.min(user.fastestAnswer, answerTime),
        highScore: newScore > user.highScore ? newScore : user.highScore
      };

      setGameState(prev => ({ ...prev, score: newScore }));
      setUser(updatedUser);
      saveUserToStorage(updatedUser);
    } catch (error) {
      console.error('Error updating score:', error);
    }
  };

  const useHint = (): boolean => {
    if (!user || user.hintsRemaining <= 0) return false;
    
    const updatedUser = {
      ...user,
      hintsRemaining: user.hintsRemaining - 1,
      gamesWithoutHints: 0, // Reset when a hint is used
    };
    
    setUser(updatedUser);
    saveUserToStorage(updatedUser);
    
    return true;
  };

  const updateAvatar = async (avatarData: string): Promise<void> => {
    if (!user) throw new Error('No user logged in');

    try {
      const updatedUser: User = {
        ...user,
        avatar: avatarData
      };

      setUser(updatedUser);
      saveUserToStorage(updatedUser);
    } catch (error) {
      console.error('Failed to update avatar:', error);
      throw new Error('Failed to update avatar');
    }
  };

  const updateUsername = (newUsername: string) => {
    if (!user) return;
    
    try {
      // Remove old username data
      localStorage.removeItem(`user_${user.username}`);
      
      const updatedUser = { ...user, username: newUsername };
      setUser(updatedUser);
      saveUserToStorage(updatedUser);
    } catch (error) {
      console.error('Failed to update username:', error);
      throw new Error('Failed to update username');
    }
  };

  const completeGame = (usedHints: boolean) => {
    if (!user) return;

    const TOTAL_RIDDLES = 40;
    const isPerfectGame = gameState.score === TOTAL_RIDDLES * 10; // Assuming 10 points per riddle
    
    const updatedUser = {
      ...user,
      gamesWithoutHints: usedHints ? 0 : user.gamesWithoutHints + 1,
      perfectGames: isPerfectGame ? (user.perfectGames || 0) + 1 : (user.perfectGames || 0),
      lastPlayedDate: new Date().toISOString(),
    };

    setUser(updatedUser);
    saveUserToStorage(updatedUser);
  };

  return (
    <GameContext.Provider value={{
      user,
      gameState,
      isMusicPlaying,
      login,
      logout,
      toggleMusic,
      resetGame,
      resetHighScore,
      updateScore,
      useHint,
      updateAvatar,
      updateUsername,
      completeGame,
    }}>
      {children}
    </GameContext.Provider>
  );
}

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};






