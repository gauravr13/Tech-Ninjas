import { Send, User, Paperclip } from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../storage/db';
import { useSessionStore } from '../state/sessionStore';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * CLEAN MOBILE CHAT
 * -----------------
 * Removed complex header buttons.
 * Attachment button now links to the Upload/Scanner page.
 */
export function Chat() {
  const navigate = useNavigate();
  const currentSessionId = useSessionStore((state) => state.currentSessionId);
  const [inputText, setInputText] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  const messages = useLiveQuery(
    () => db.chats.where('sessionId').equals(currentSessionId || '').sortBy('timestamp'),
    [currentSessionId]
  );

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!inputText.trim() || !currentSessionId) return;

    const newMessage = {
      sessionId: currentSessionId,
      text: inputText,
      sender: 'user' as const,
      timestamp: Date.now()
    };

    try {
      await db.chats.add(newMessage);
      await db.sessions.update(currentSessionId, { updatedAt: Date.now() });
      setInputText('');
    } catch (err) {
      console.error("Chat Error:", err);
    }
  };

  if (!currentSessionId) {
    return (
      <div className="page chat-centered">
        <p>No active session found.</p>
        <button className="btn-main" onClick={() => navigate('/')}>Back Home</button>
      </div>
    );
  }

  return (
    <div className="chat-mobile-container">
      
      {/* 1. Simple Header (Centered Title Only) */}
      <header className="chat-header">
        <div className="header-title">
          <span>GovForm Assistant</span>
          <small>Phase 1 (Offline)</small>
        </div>
      </header>

      {/* 2. Chat Area */}
      <div className="chat-messages">
        {messages && messages.length > 0 ? (
          messages.map((msg) => (
            <div key={msg.id} className={`chat-row ${msg.sender}`}>
              <div className="chat-avatar">
                {msg.sender === 'user' ? <User size={14} /> : 'A'}
              </div>
              <div className="chat-bubble">
                {msg.text}
              </div>
            </div>
          ))
        ) : (
          <div className="chat-welcome">
            <h3>How can I help you?</h3>
            <p>Ask about your government forms or general procedures.</p>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* 3. Input Area with Functional Upload Button */}
      <div className="chat-input-area">
        <div className="input-wrapper">
          {/* Clickable Attachment button navigates to Upload section */}
          <button className="btn-icon" onClick={() => navigate('/upload')}>
            <Paperclip size={20} />
          </button>
          
          <input 
            type="text" 
            placeholder="Message..." 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button 
            className={`btn-send ${inputText.trim() ? 'active' : ''}`}
            onClick={handleSend}
            disabled={!inputText.trim()}
          >
            <Send size={18} />
          </button>
        </div>
      </div>

      <style>{`
        .chat-mobile-container { display: flex; flex-direction: column; height: calc(100vh - var(--header-height) - var(--nav-height)); background: #ffffff; }
        .chat-header { display: flex; align-items: center; justify-content: center; padding: 12px; border-bottom: 1px solid #f1f5f9; }
        .header-title { text-align: center; }
        .header-title span { font-weight: 800; font-size: 1rem; }
        .header-title small { font-size: 0.7rem; color: #94a3b8; display: block; }

        .chat-messages { flex: 1; overflow-y: auto; padding: 20px; display: flex; flex-direction: column; gap: 20px; }
        .chat-row { display: flex; gap: 12px; max-width: 85%; }
        .chat-row.user { align-self: flex-end; flex-direction: row-reverse; }
        .chat-avatar { width: 28px; height: 28px; border-radius: 50%; background: #f1f5f9; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 800; flex-shrink: 0; }
        .chat-row.ai .chat-avatar { background: var(--primary); color: white; }
        .chat-bubble { padding: 10px 14px; border-radius: 18px; font-size: 0.95rem; line-height: 1.45; background: #f1f5f9; color: #334155; }
        .chat-row.user .chat-bubble { background: var(--primary); color: white; }

        .chat-welcome { text-align: center; margin: auto; padding: 0 40px; }
        .chat-welcome h3 { font-weight: 800; font-size: 1.4rem; }
        .chat-welcome p { color: #94a3b8; margin-top: 8px; }

        .chat-input-area { padding: 12px 16px; border-top: 1px solid #f1f5f9; }
        .input-wrapper { display: flex; align-items: center; gap: 10px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 24px; padding: 6px 12px; }
        .input-wrapper input { flex: 1; border: none; background: transparent; padding: 10px 0; outline: none; }
        .btn-icon { background: transparent; color: #94a3b8; cursor: pointer; border: none; padding: 4px; display: flex; align-items: center; outline: none; }
        .btn-send { width: 32px; height: 32px; border-radius: 50%; background: #e2e8f0; color: white; display: flex; align-items: center; justify-content: center; }
        .btn-send.active { background: var(--primary); }

        .chat-centered { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 60vh; text-align: center; padding: 20px; }
        .btn-main { background: var(--primary); color: white; padding: 12px 24px; border-radius: 8px; font-weight: 600; margin-top: 10px; }
      `}</style>
    </div>
  );
}
