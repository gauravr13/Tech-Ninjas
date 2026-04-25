import { MessageSquare, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSessionStore } from '../state/sessionStore';

/**
 * DASHBOARD SCREEN
 * ----------------
 * Extremely simple version as per user request.
 * Removed logo and complex UI elements.
 */
export function Dashboard() {
  const navigate = useNavigate();
  const setCurrentSessionId = useSessionStore((state) => state.setCurrentSessionId);

  // Action: Move to Upload page
  const handleUploadDoc = () => {
    navigate('/upload');
  };

  // Action: Start a new chat
  const handleNewChat = () => {
    const sessionId = crypto.randomUUID();
    setCurrentSessionId(sessionId);
    navigate('/chat');
  };

  return (
    <div className="page dashboard-simple">
      
      {/* Header Text */}
      <div className="simple-header">
        <h1>GovForm Assistant</h1>
        <p>Select an option to start</p>
      </div>

      {/* Basic Buttons */}
      <div className="button-stack">
        <button className="simple-btn" onClick={handleUploadDoc}>
          <Upload size={20} />
          <span>Upload Document</span>
        </button>

        <button className="simple-btn" onClick={handleNewChat}>
          <MessageSquare size={20} />
          <span>New Chat</span>
        </button>
      </div>

      {/* Simple Styles */}
      <style>{`
        .dashboard-simple {
          padding: 40px 20px;
          text-align: center;
        }
        .simple-header {
          margin-bottom: 40px;
        }
        .button-stack {
          display: flex;
          flex-direction: column;
          gap: 12px;
          max-width: 300px;
          margin: 0 auto;
        }
        .simple-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 15px;
          background: var(--primary);
          color: white;
          border-radius: 8px;
          font-weight: 600;
          font-size: 1rem;
        }
        .simple-btn:active {
          opacity: 0.8;
        }
      `}</style>
    </div>
  );
}
