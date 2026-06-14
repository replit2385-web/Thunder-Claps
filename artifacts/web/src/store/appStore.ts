import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Session } from '@workspace/api-client-react';

interface AppState {
  couple: { 
    id: string; 
    name: string; 
    partner1: string; 
    partner2: string; 
    anniversaryDate?: string; 
    avatarJson?: object;
    blendImageUrl?: string | null;
  } | null;
  sessions: Session[];
  growthScore: { 
    total: number; 
    streak: number; 
    momentum: 'rising' | 'steady' | 'cooling'; 
    history: { date: string; score: number }[] 
  };
  mirrorResults: { 
    quizType: string; 
    partner1Result: string; 
    partner2Result: string; 
    completedAt: string 
  }[];
  currentRoom: { 
    joinCode: string; 
    phase: string 
  } | null;
  
  setCouple: (couple: AppState['couple']) => void;
  addSession: (session: Session) => void;
  setSessions: (sessions: Session[]) => void;
  updateGrowthScore: (update: Partial<AppState['growthScore']>) => void;
  addMirrorResult: (result: AppState['mirrorResults'][0]) => void;
  setCurrentRoom: (room: AppState['currentRoom']) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      couple: null,
      sessions: [],
      growthScore: { total: 0, streak: 0, momentum: 'steady', history: [] },
      mirrorResults: [],
      currentRoom: null,

      setCouple: (couple) => set({ couple }),
      addSession: (session) => set((state) => ({ sessions: [...state.sessions, session] })),
      setSessions: (sessions) => set({ sessions }),
      updateGrowthScore: (update) => set((state) => ({ 
        growthScore: { ...state.growthScore, ...update } 
      })),
      addMirrorResult: (result) => set((state) => ({ 
        mirrorResults: [...state.mirrorResults, result] 
      })),
      setCurrentRoom: (room) => set({ currentRoom: room }),
    }),
    {
      name: 'infinite-us-state',
    }
  )
);
