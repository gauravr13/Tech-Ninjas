import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { TopHeader } from './components/TopHeader'
import { BottomNav } from './components/BottomNav'
import { PWAPrompt } from './components/PWAPrompt'
import { Dashboard } from './screens/Dashboard'
import { Upload } from './screens/Upload'
import { Chat } from './screens/Chat'
import { Result } from './screens/Result'

function App() {
  return (
    <Router>
      <div className="app-container">
        <TopHeader />
        
        <main className="content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/result" element={<Result />} />
          </Routes>
        </main>

        <BottomNav />
        <PWAPrompt />
      </div>
    </Router>
  )
}

export default App
