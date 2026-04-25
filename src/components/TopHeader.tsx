import { OnlineBadge } from './OnlineBadge'

export function TopHeader() {
  return (
    <header className="top-header">
      <div className="logo-section">
        <span className="app-name">GovForm AI</span>
      </div>
      <OnlineBadge />
    </header>
  )
}
