import { MessageSquare, Camera, History, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSessionStore } from '../state/sessionStore';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../storage/db';

/**
 * CLEAN GPT-STYLE DASHBOARD
 * -------------------------
 * Removed all static mock data. 
 * Now dynamically shows a message if no history exists in IndexedDB.
 */
export function Dashboard() {
  const navigate = useNavigate();
  const setCurrentSessionId = useSessionStore((state) => state.setCurrentSessionId);

  // Real-time query to check if there are any sessions in the DB
  const sessionCount = useLiveQuery(() => db.sessions.count());

  // Action: Start a clean chat session
  const handleNewChat = () => {
    const sessionId = crypto.randomUUID();
    setCurrentSessionId(sessionId);
    navigate('/chat');
  };

  return (
    <div className="page gpt-dashboard">
      
      {/* Dynamic Greeting */}
      <header className="dashboard-header">
        <h1>GovForm AI</h1>
        <p>Your local assistant for government forms.</p>
      </header>

      {/* Primary Actions */}
      <div className="action-grid">
        
        {/* Scan Document */}
        <div className="action-card primary" onClick={() => navigate('/upload')}>
          <div className="icon-box">
            <Camera size={28} />
          </div>
          <div className="card-info">
            <h3>Scan Document</h3>
            <p>Start a new form analysis</p>
          </div>
          <ChevronRight size={20} className="arrow" />
        </div>

        {/* New Chat */}
        <div className="action-card" onClick={handleNewChat}>
          <div className="icon-box chat">
            <MessageSquare size={28} />
          </div>
          <div className="card-info">
            <h3>New Chat</h3>
            <p>Ask a question directly</p>
          </div>
          <ChevronRight size={20} className="arrow" />
        </div>

      </div>

      {/* Clean History Section */}
      <div className="history-section">
        <div className="section-title">
          <History size={16} />
          <span>History</span>
        </div>
        
        {/* Only show "No recent forms" if the database is actually empty */}
        {sessionCount === 0 && (
          <div className="empty-history">
            <p>No recent forms scanned yet.</p>
          </div>
        )}

        {sessionCount !== undefined && sessionCount > 0 && (
          <div className="history-info">
            <p>{sessionCount} session(s) stored locally.</p>
          </div>
        )}
      </div>

      <style>{`
        .gpt-dashboard { padding: 20px; display: flex; flex-direction: column; gap: 30px; }
        .dashboard-header h1 { font-size: 2rem; font-weight: 800; margin: 0; letter-spacing: -0.03em; }
        .dashboard-header p { color: var(--text-light); font-size: 0.95rem; margin-top: 5px; }

        .action-grid { display: flex; flex-direction: column; gap: 16px; }
        .action-card {
          display: flex; align-items: center; padding: 20px; background: #f8fafc;
          border: 1px solid #e2e8f0; border-radius: 16px; gap: 16px; cursor: pointer;
        }
        .action-card.primary { background: var(--primary-light); border-color: #bfdbfe; }
        .icon-box {
          width: 54px; height: 54px; border-radius: 12px; display: flex; align-items: center; 
          justify-content: center; background: white; color: var(--primary); flex-shrink: 0;
        }
        .icon-box.chat { color: #8b5cf6; }
        .card-info { flex: 1; }
        .card-info h3 { margin: 0; font-size: 1.1rem; font-weight: 700; }
        .card-info p { margin: 4px 0 0; font-size: 0.85rem; color: var(--text-light); }
        .arrow { color: #cbd5e1; }

        .history-section { margin-top: 10px; }
        .section-title {
          display: flex; align-items: center; gap: 8px; color: #94a3b8;
          font-weight: 600; font-size: 0.85rem; margin-bottom: 12px;
          text-transform: uppercase; letter-spacing: 0.05em;
        }
        .empty-history, .history-info {
          padding: 24px; border-radius: 16px; background: #fdfdfd;
          border: 1px dashed #e2e8f0; text-align: center; color: #94a3b8; font-size: 0.9rem;
        }
      `}</style>
    </div>
  );
}
