import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface VocabularyItem {
  id: string;
  word: string;
  definition: string;
  exampleSentence: string;
  sourceVideoId?: string;
  timestamp?: number;
  mastered: boolean;
  dateAdded: string;
}

export interface UserSettings {
  dailyTargetMinutes: number;
  playbackSpeed: number;
  transcriptFontSize: 'small' | 'medium' | 'large';
  autoScroll: boolean;
  darkMode: boolean;
}

interface AppState {
  // Vocabulary
  vocabulary: VocabularyItem[];
  addVocabulary: (item: Omit<VocabularyItem, 'id' | 'dateAdded' | 'mastered'>) => void;
  toggleMastered: (id: string) => void;
  removeVocabulary: (id: string) => void;

  // Settings
  settings: UserSettings;
  updateSettings: (settings: Partial<UserSettings>) => void;

  // Progress / Session stats
  streak: number;
  totalPracticeTime: number; // in minutes
  addPracticeTime: (minutes: number) => void;
  incrementStreak: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      vocabulary: [],
      addVocabulary: (item) => set((state) => ({
        vocabulary: [
          ...state.vocabulary,
          {
            ...item,
            id: crypto.randomUUID(),
            dateAdded: new Date().toISOString(),
            mastered: false,
          }
        ]
      })),
      toggleMastered: (id) => set((state) => ({
        vocabulary: state.vocabulary.map(v => v.id === id ? { ...v, mastered: !v.mastered } : v)
      })),
      removeVocabulary: (id) => set((state) => ({
        vocabulary: state.vocabulary.filter(v => v.id !== id)
      })),

      settings: {
        dailyTargetMinutes: 15,
        playbackSpeed: 1.0,
        transcriptFontSize: 'medium',
        autoScroll: true,
        darkMode: false,
      },
      updateSettings: (newSettings) => set((state) => ({
        settings: { ...state.settings, ...newSettings }
      })),

      streak: 5, // starting with mock data as requested
      totalPracticeTime: 120, 
      addPracticeTime: (minutes) => set((state) => ({
        totalPracticeTime: state.totalPracticeTime + minutes
      })),
      incrementStreak: () => set((state) => ({
        streak: state.streak + 1
      }))
    }),
    {
      name: 'shadowly-storage', // key in local storage
    }
  )
);
