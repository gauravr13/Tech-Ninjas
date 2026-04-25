import { create } from 'zustand'

/**
 * MODE STORE
 * This store tracks the global online/offline status of the application.
 */
interface ModeState {
  isOnline: boolean
  setOnline: (status: boolean) => void
}

export const useModeStore = create<ModeState>((set) => ({
  // Default state is online
  isOnline: true,
  
  // Action to update the status
  setOnline: (status) => set({ isOnline: status }),
}))
