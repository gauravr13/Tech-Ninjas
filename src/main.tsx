import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { initModeManager } from './core/modeManager'

/**
 * APPLICATION ENTRY POINT
 * This is where the React app is mounted to the HTML.
 */

// 1. Initialize core system managers (like Online/Offline detector)
initModeManager()

// 2. Mount the React application to the DOM
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
