import { OnlineBadge } from './OnlineBadge'

/**
 * TOP HEADER COMPONENT
 * Displays the App title and the real-time connectivity status.
 */
export function TopHeader() {
  return (
    <header className="top-header">
      {/* App Branding Section */}
      <div className="logo-section">
        <span className="app-name">GovForm AI</span>
      </div>
      
      {/* Connectivity Status (Shows Green if Online, Grey if Offline) */}
      <OnlineBadge />
    </header>
  )
}
