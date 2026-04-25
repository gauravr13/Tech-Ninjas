import { useModeStore } from '../state/modeStore'

/**
 * MODE MANAGER
 * This module listens to the browser's 'online' and 'offline' events 
 * and automatically updates the app's global state.
 */
export function initModeManager() {
  const setOnline = useModeStore.getState().setOnline

  // When internet is restored
  window.addEventListener('online', () => {
    setOnline(true)
    console.log('App Mode: Online')
  })

  // When internet is lost
  window.addEventListener('offline', () => {
    setOnline(false)
    console.log('App Mode: Offline (Local Storage Active)')
  })

  // Initial Check: Set the state based on the current connection
  setOnline(navigator.onLine)
}
