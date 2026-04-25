import { create } from 'zustand'

interface ModeState {
  isOnline: boolean
  setOnline: (status: boolean) => void
}

export const useModeStore = create<ModeState>((set) => ({
  isOnline: navigator.onLine,
  setOnline: (status) => set({ isOnline: status }),
}))
