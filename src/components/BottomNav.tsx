import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Camera, MessageSquare, FileText } from 'lucide-react'

export function BottomNav() {
  return (
    <nav className="bottom-nav">
      <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <LayoutDashboard size={24} />
        <span>Dash</span>
      </NavLink>
      <NavLink to="/upload" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <Camera size={24} />
        <span>Scan</span>
      </NavLink>
      <NavLink to="/chat" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <MessageSquare size={24} />
        <span>Chat</span>
      </NavLink>
      <NavLink to="/result" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <FileText size={24} />
        <span>Result</span>
      </NavLink>
    </nav>
  )
}
