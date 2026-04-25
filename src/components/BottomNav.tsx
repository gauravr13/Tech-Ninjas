import { NavLink } from 'react-router-dom'
import { LayoutDashboard, MessageSquare, FileText } from 'lucide-react'

/**
 * BOTTOM NAVIGATION COMPONENT
 * Provides easy access to all main screens on mobile devices.
 * Uses NavLink to automatically highlight the active button.
 */
export function BottomNav() {
  return (
    <nav className="bottom-nav">
      {/* Home / Dashboard Link */}
      <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <LayoutDashboard size={24} />
        <span>Dash</span>
      </NavLink>


      {/* Chat Assistant Link */}
      <NavLink to="/chat" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <MessageSquare size={24} />
        <span>Chat</span>
      </NavLink>

      {/* Analysis Results Link */}
      <NavLink to="/result" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <FileText size={24} />
        <span>Result</span>
      </NavLink>
    </nav>
  )
}
