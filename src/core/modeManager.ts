import { useModeStore } from '../state/modeStore'

export function initModeManager() {
  const setOnline = useModeStore.getState().setOnline

  window.addEventListener('online', () => {
    setOnline(true)
    console.log('Mode: Online')
  })

  window.addEventListener('offline', () => {
    setOnline(false)
    console.log('Mode: Offline')
  })

  // Initial check
  setOnline(navigator.onLine)
}
