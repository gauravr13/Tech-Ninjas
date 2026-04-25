import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { TopHeader } from './components/TopHeader'
import { BottomNav } from './components/BottomNav'
import { PWAPrompt } from './components/PWAPrompt'
import { Dashboard } from './screens/Dashboard'
import { Upload } from './screens/Upload'
import { Chat } from './screens/Chat'
import { Result } from './screens/Result'

/**
 * MAIN APP COMPONENT
 * This is the heart of the application. It sets up the Layout and Routing.
 */
function App() {
  return (
    <Router>
      {/* 
        The app-container is constrained to a mobile width in CSS 
        to ensure a premium, focused experience on all screens.
      */}
      <div className="app-container">
        
        {/* Persistent Top Header (Shows App Name & Online Status) */}
        <TopHeader />
        
        {/* Main Content Area: Different screens will load here based on the URL */}
        <main className="content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/result" element={<Result />} />
          </Routes>
        </main>

        {/* Persistent Bottom Navigation (Home, Scan, Chat, Result) */}
        <BottomNav />

        {/* PWA Prompt: Asks user to install the app on their phone/desktop */}
        <PWAPrompt />
        
      </div>
    </Router>
  )
}

export default App
