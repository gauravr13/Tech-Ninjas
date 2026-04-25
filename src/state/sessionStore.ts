import { create } from 'zustand'
import type { Session } from '../storage/db'

interface SessionState {
  currentSessionId: string | null
  setCurrentSessionId: (id: string | null) => void
  sessions: Session[]
  setSessions: (sessions: Session[]) => void
}

export const useSessionStore = create<SessionState>((set) => ({
  currentSessionId: null,
  setCurrentSessionId: (id) => set({ currentSessionId: id }),
  sessions: [],
  setSessions: (sessions) => set({ sessions }),
}))
