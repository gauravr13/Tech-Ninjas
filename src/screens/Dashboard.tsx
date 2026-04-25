import { MessageSquare, Camera, History, Plus, ChevronRight, FileText, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../storage/db';
import { useSessionStore } from '../state/sessionStore';

/**
 * PROFESSIONAL WORKING DASHBOARD
 * ------------------------------
 * Gemini/GPT-inspired layout with quick actions and live history.
 * Optimized for a clean, premium mobile experience.
 */
export function Dashboard() {
  const navigate = useNavigate();
  const setCurrentSessionId = useSessionStore((state) => state.setCurrentSessionId);

  // Fetch recent sessions from IndexedDB
  const recentSessions = useLiveQuery(
    () => db.sessions.orderBy('updatedAt').reverse().limit(5).toArray()
  );

  const startNewChat = () => {
    setCurrentSessionId(null); // Reset session for a fresh start
    navigate('/chat');
  };

  const openSession = (id: string) => {
    setCurrentSessionId(id);
    navigate('/chat');
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div className="dashboard-container">

      {/* 1. Header & Greeting */}
      <header className="dash-header">
        <h1>{getGreeting()}, <span className="user-name">Guest</span></h1>
        <p>How can I assist you with your forms today?</p>
      </header>

      {/* 2. Quick Actions Grid */}
      <section className="quick-actions">
        <button className="action-card primary" onClick={startNewChat}>
          <div className="icon-box"><Plus size={24} /></div>
          <div className="text-box">
            <h3>New Chat</h3>
            <p>Start a fresh conversation</p>
          </div>
        </button>

        <button className="action-card secondary" onClick={() => navigate('/chat')}>
          <div className="icon-box"><Camera size={24} /></div>
          <div className="text-box">
            <h3>Scan Form</h3>
            <p>Capture and analyze</p>
          </div>
        </button>
      </section>

      {/* 3. Recent Activity Section */}
      <section className="recent-activity">
        <div className="section-title">
          <h2>Recent Activity</h2>
          <History size={18} color="#94a3b8" />
        </div>

        <div className="activity-list">
          {recentSessions && recentSessions.length > 0 ? (
            recentSessions.map((session) => (
              <div key={session.id} className="activity-item" onClick={() => openSession(session.id)}>
                <div className="item-icon">
                  <MessageSquare size={18} />
                </div>
                <div className="item-info">
                  <h4>{session.name}</h4>
                  <span>{new Date(session.updatedAt).toLocaleDateString()}</span>
                </div>
                <ChevronRight size={18} color="#cbd5e1" />
              </div>
            ))
          ) : (
            <div className="empty-state">
              <FileText size={40} color="#e2e8f0" />
              <p>No recent activity yet. Start by scanning a form!</p>
            </div>
          )}
        </div>
      </section>

      {/* 4. Tips / Info Card */}
      <section className="info-card">
        <div className="info-content">
          <Upload size={20} color="#2563eb" />
          <p>You can also upload images directly from your gallery in the chat.</p>
        </div>
      </section>

      <style>{`
        .dashboard-container { padding: 20px; display: flex; flex-direction: column; gap: 24px; animation: fadeIn 0.4s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

        .dash-header h1 { font-size: 1.6rem; font-weight: 800; color: #0f172a; margin: 0; }
        .dash-header p { color: #64748b; font-size: 0.95rem; margin-top: 6px; }
        .user-name { color: var(--primary); }

        .quick-actions { display: grid; grid-template-columns: 1fr; gap: 12px; }
        .action-card { 
          display: flex; align-items: center; gap: 16px; padding: 16px; border-radius: 16px; 
          border: 1px solid #e2e8f0; background: #fff; cursor: pointer; text-align: left;
          transition: all 0.2s; 
        }
        .action-card:active { transform: scale(0.98); background: #f8fafc; }
        .action-card.primary { background: linear-gradient(135deg, #2563eb, #1d4ed8); border: none; color: #fff; }
        .action-card.primary .icon-box { background: rgba(255,255,255,0.2); }
        .action-card.primary p { color: rgba(255,255,255,0.8); }
        
        .icon-box { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; background: #eff6ff; color: #2563eb; }
        .text-box h3 { font-size: 1.1rem; font-weight: 700; margin: 0; }
        .text-box p { font-size: 0.85rem; margin-top: 2px; color: #64748b; }

        .recent-activity { display: flex; flex-direction: column; gap: 12px; }
        .section-title { display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px; }
        .section-title h2 { font-size: 1rem; font-weight: 700; color: #334155; margin: 0; }
        
        .activity-list { display: flex; flex-direction: column; gap: 8px; }
        .activity-item { 
          display: flex; align-items: center; gap: 12px; padding: 12px; 
          background: #fff; border: 1px solid #f1f5f9; border-radius: 12px; cursor: pointer;
        }
        .activity-item:active { background: #f8fafc; }
        .item-icon { width: 36px; height: 36px; border-radius: 8px; background: #f8fafc; display: flex; align-items: center; justify-content: center; color: #94a3b8; }
        .item-info { flex: 1; }
        .item-info h4 { font-size: 0.9rem; font-weight: 600; color: #1e293b; margin: 0; }
        .item-info span { font-size: 0.75rem; color: #94a3b8; }

        .empty-state { text-align: center; padding: 40px 20px; border: 2px dashed #f1f5f9; border-radius: 16px; display: flex; flex-direction: column; align-items: center; gap: 10px; }
        .empty-state p { font-size: 0.85rem; color: #94a3b8; max-width: 200px; }

        .info-card { background: #eff6ff; padding: 12px 16px; border-radius: 12px; border: 1px solid #dbeafe; }
        .info-content { display: flex; align-items: center; gap: 10px; }
        .info-card p { font-size: 0.8rem; color: #1e40af; margin: 0; font-weight: 500; }
      `}</style>
    </div>
  );
}
