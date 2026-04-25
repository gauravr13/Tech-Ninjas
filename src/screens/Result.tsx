import { FileText, AlertCircle } from 'lucide-react';
import { useSessionStore } from '../state/sessionStore';

/**
 * CLEAN RESULT SCREEN
 * -------------------
 * Removed all mock/sample data. 
 * Now shows an "Empty State" until real AI processing is implemented.
 */
export function Result() {
  const currentSessionId = useSessionStore((state) => state.currentSessionId);

  return (
    <div className="page result-mobile">
      
      {/* Header */}
      <div className="result-header">
        <FileText size={40} color="#94a3b8" />
        <h2>Analysis Results</h2>
      </div>

      {/* Conditional View: Show data ONLY if a session exists, else show empty state */}
      {!currentSessionId ? (
        <div className="empty-state-card">
          <AlertCircle size={48} color="#e2e8f0" />
          <h3>No Data Found</h3>
          <p>Please scan a document or start a chat to see analysis results here.</p>
        </div>
      ) : (
        <div className="processing-placeholder">
          <div className="loader-ring"></div>
          <h3>Processing Document...</h3>
          <p>AI extraction will appear here in the next phase.</p>
        </div>
      )}

      {/* CLEAN CSS */}
      <style>{`
        .result-mobile { display: flex; flex-direction: column; gap: 40px; padding: 40px 20px; text-align: center; }
        
        .result-header h2 { margin: 10px 0 0; font-size: 1.5rem; font-weight: 800; }

        .empty-state-card, .processing-placeholder {
          background: #ffffff; border: 2px dashed #f1f5f9; border-radius: 20px;
          padding: 60px 20px; display: flex; flex-direction: column; align-items: center; gap: 16px;
        }

        .empty-state-card h3, .processing-placeholder h3 { margin: 0; color: #475569; }
        .empty-state-card p, .processing-placeholder p { color: #94a3b8; font-size: 0.9rem; max-width: 240px; margin: 0; }

        .loader-ring {
          width: 50px; height: 50px; border: 4px solid #f1f5f9; border-top: 4px solid var(--primary);
          border-radius: 50%; animation: spin 1s linear infinite;
        }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
