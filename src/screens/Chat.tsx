import { Send, User, Paperclip, Mic, MicOff, Camera as CameraIcon, ImageIcon, X, RefreshCw } from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../storage/db';
import { useSessionStore } from '../state/sessionStore';
import { useState, useRef, useEffect } from 'react';

/**
 * FIXED PROFESSIONAL CHAT
 * -----------------------
 * Fixed missing stopListening and cleaned up unused icons.
 */
export function Chat() {
  const { currentSessionId, setCurrentSessionId } = useSessionStore();
  
  // UI State
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [stagedImage, setStagedImage] = useState<Blob | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');

  // Refs
  const scrollRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const ensureSession = async () => {
    if (currentSessionId) return currentSessionId;
    const newId = crypto.randomUUID();
    const now = Date.now();
    await db.sessions.add({
      id: newId,
      name: `Session ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      createdAt: now, updatedAt: now, status: 'active'
    });
    setCurrentSessionId(newId);
    return newId;
  };

  const startCamera = async (mode: 'user' | 'environment') => {
    try {
      if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
      setIsCameraActive(true); setShowMenu(false);
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: mode }, audio: false });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      setFacingMode(mode);
    } catch (err) { alert("Camera access denied."); setIsCameraActive(false); }
  };

  const stopCamera = () => {
    if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
    setIsCameraActive(false);
  };

  const handleCapture = async () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      canvas.width = video.videoWidth; canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => { if (blob) { setStagedImage(blob); stopCamera(); } }, 'image/jpeg', 0.8);
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) recognitionRef.current.stop();
    setIsListening(false);
  };

  const toggleListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return alert("Voice not supported.");
    if (!recognitionRef.current) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true; recognitionRef.current.interimResults = true;
      recognitionRef.current.onstart = () => setIsListening(true);
      recognitionRef.current.onresult = (e: any) => {
        let t = ''; for (let i = 0; i < e.results.length; i++) { t += e.results[i][0].transcript; }
        setInputText(t);
      };
      recognitionRef.current.onend = () => setIsListening(false);
    }
    if (isListening) stopListening(); else recognitionRef.current.start();
  };

  const messages = useLiveQuery(() => db.chats.where('sessionId').equals(currentSessionId || '').sortBy('timestamp'), [currentSessionId]);
  useEffect(() => { scrollRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, inputText, stagedImage]);

  const handleSend = async () => {
    if (!inputText.trim() && !stagedImage) return;
    const sessionId = await ensureSession();
    setIsProcessing(true);
    try {
      await db.chats.add({
        sessionId,
        text: inputText || (stagedImage ? 'Image uploaded' : ''),
        sender: 'user',
        timestamp: Date.now(),
        imageBlob: stagedImage || undefined
      } as any);
      if (stagedImage) await db.images.add({ sessionId, blob: stagedImage, timestamp: Date.now() });
      await db.sessions.update(sessionId, { updatedAt: Date.now() });
      setInputText('');
      setStagedImage(null);
      if (isListening) stopListening();
    } catch (err) { console.error(err); } finally { setIsProcessing(false); }
  };

  return (
    <div className="chat-mobile-container" onClick={() => showMenu && setShowMenu(false)}>
      <header className="chat-header">
        <div className="header-title">GovForm Assistant</div>
      </header>

      <div className="chat-messages">
        {(!messages || messages.length === 0) ? (
          <div className="chat-welcome">
            <h3>How can I help?</h3>
            <p>Scan a form or type your question below.</p>
          </div>
        ) : (
          messages.map((msg: any) => (
            <div key={msg.id} className={`chat-row ${msg.sender}`}>
              <div className="chat-avatar">{msg.sender === 'user' ? <User size={14} /> : 'A'}</div>
              <div className="chat-bubble">
                {msg.imageBlob && (
                  <img src={URL.createObjectURL(msg.imageBlob)} className="chat-img" alt="Captured" onLoad={(e) => URL.revokeObjectURL((e.target as any).src)} />
                )}
                {msg.text && <p>{msg.text}</p>}
              </div>
            </div>
          ))
        )}
        <div ref={scrollRef} />
      </div>

      {isCameraActive && (
        <div className="camera-fullscreen">
          <video ref={videoRef} autoPlay playsInline muted className="full-video" />
          <div className="cam-controls top">
            <button type="button" className="icon-btn-circle" onClick={stopCamera}><X size={24} /></button>
            <button type="button" className="icon-btn-circle" onClick={() => startCamera(facingMode === 'user' ? 'environment' : 'user')}><RefreshCw size={24} /></button>
          </div>
          <div className="cam-controls bottom">
            <button type="button" className="shutter" onClick={handleCapture} disabled={isProcessing}>
              <div className="shutter-in"></div>
            </button>
            <p>Align document and capture</p>
          </div>
        </div>
      )}

      {isListening && (
        <div className="voice-wave-box">
          <div className="b"></div><div className="b"></div><div className="b"></div><span>Listening...</span>
        </div>
      )}

      <div className="chat-input-area">
        {stagedImage && (
          <div className="image-preview-bar">
            <div className="preview-card">
              <img src={URL.createObjectURL(stagedImage)} alt="Preview" onLoad={(e) => URL.revokeObjectURL((e.target as any).src)} />
              <button type="button" className="remove-preview" onClick={() => setStagedImage(null)}><X size={14} /></button>
            </div>
            <span>Ready to send...</span>
          </div>
        )}

        {showMenu && (
          <div className="chat-pop-menu">
            <button type="button" className="pop-item" onClick={() => startCamera('environment')}>
              <div className="pop-icon cam"><CameraIcon size={20} /></div>
              <span>Scan Document</span>
            </button>
            <button type="button" className="pop-item" onClick={() => fileInputRef.current?.click()}>
              <div className="pop-icon gal"><ImageIcon size={20} /></div>
              <span>Gallery Upload</span>
            </button>
          </div>
        )}

        <div className="input-wrapper">
          <button type="button" className={`btn-icon ${showMenu ? 'active' : ''}`} onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}>
            <Paperclip size={20} />
          </button>
          <input type="text" placeholder="Message..." value={inputText} onChange={(e) => setInputText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} />
          <button type="button" className={`btn-icon mic-btn ${isListening ? 'active' : ''}`} onClick={toggleListening}>
            {isListening ? <MicOff size={22} color="white" /> : <Mic size={22} />}
          </button>
          <button type="button" className={`btn-send ${(inputText.trim() || stagedImage) ? 'active' : ''}`} onClick={handleSend} disabled={isProcessing}>
            <Send size={18} />
          </button>
        </div>
      </div>

      <canvas ref={canvasRef} style={{ display: 'none' }} />
      <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept="image/*" onChange={(e) => { const f = e.target.files?.[0]; if (f) { setStagedImage(f); setShowMenu(false); } }} />

      <style>{`
        .chat-mobile-container { display: flex; flex-direction: column; height: calc(100vh - var(--header-height) - var(--nav-height)); background: #fff; position: relative; overflow: hidden; }
        .chat-header { padding: 12px; text-align: center; border-bottom: 1px solid #f1f5f9; font-weight: 800; }
        .chat-messages { flex: 1; overflow-y: auto; padding: 20px; display: flex; flex-direction: column; gap: 16px; }
        .chat-welcome { text-align: center; margin: auto; padding: 0 40px; }
        .chat-welcome h3 { font-weight: 800; font-size: 1.4rem; color: #1e293b; }
        .chat-welcome p { color: #94a3b8; margin-top: 8px; font-size: 0.95rem; }
        .chat-row { display: flex; gap: 10px; max-width: 88%; }
        .chat-row.user { align-self: flex-end; flex-direction: row-reverse; }
        .chat-bubble { padding: 10px 14px; border-radius: 18px; font-size: 0.95rem; background: #f1f5f9; border: 1px solid #e2e8f0; }
        .chat-row.user .chat-bubble { background: var(--primary); color: #fff; border: none; }
        .chat-img { max-width: 100%; border-radius: 12px; margin-bottom: 6px; display: block; }
        .chat-avatar { width: 30px; height: 30px; border-radius: 50%; background: #f1f5f9; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 800; }
        .image-preview-bar { padding: 12px 16px; background: #f8fafc; border-top: 1px solid #e2e8f0; display: flex; align-items: center; gap: 12px; }
        .preview-card { position: relative; width: 60px; height: 60px; border-radius: 8px; overflow: hidden; border: 2px solid #fff; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }
        .preview-card img { width: 100%; height: 100%; object-fit: cover; }
        .remove-preview { position: absolute; top: 2px; right: 2px; width: 18px; height: 18px; border-radius: 50%; background: rgba(0,0,0,0.6); color: #fff; border: none; display: flex; align-items: center; justify-content: center; }
        .camera-fullscreen { position: fixed; inset: 0; background: #000; z-index: 5000; display: flex; flex-direction: column; }
        .full-video { width: 100%; height: 100%; object-fit: cover; }
        .cam-controls { position: absolute; left: 0; right: 0; padding: 25px; display: flex; justify-content: space-between; z-index: 5001; }
        .cam-controls.top { top: 0; }
        .cam-controls.bottom { bottom: 0; flex-direction: column; align-items: center; gap: 20px; background: linear-gradient(transparent, rgba(0,0,0,0.5)); }
        .icon-btn-circle { width: 48px; height: 48px; border-radius: 50%; background: rgba(255,255,255,0.2); color: #fff; display: flex; align-items: center; justify-content: center; border: none; }
        .shutter { width: 72px; height: 72px; border-radius: 50%; border: 4px solid #fff; background: transparent; padding: 4px; }
        .shutter-in { width: 100%; height: 100%; background: #fff; border-radius: 50%; }
        .chat-pop-menu { position: absolute; bottom: 75px; left: 16px; background: #fff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 8px; box-shadow: 0 10px 25px rgba(0,0,0,0.1); z-index: 1000; display: flex; flex-direction: column; width: 210px; }
        .pop-item { display: flex; align-items: center; gap: 12px; padding: 12px; border: none; background: transparent; cursor: pointer; border-radius: 10px; width: 100%; }
        .pop-icon { width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #fff; }
        .pop-icon.cam { background: #8b5cf6; }
        .pop-icon.gal { background: #3b82f6; }
        .chat-input-area { padding: 12px 16px; border-top: 1px solid #f1f5f9; background: #fff; }
        .input-wrapper { display: flex; align-items: center; gap: 10px; background: #f1f5f9; border: 1px solid #e2e8f0; border-radius: 28px; padding: 4px 12px; }
        .input-wrapper input { flex: 1; border: none; background: transparent; padding: 12px 0; outline: none; font-size: 1rem; }
        .btn-icon { background: transparent; color: #64748b; border: none; cursor: pointer; display: flex; align-items: center; }
        .btn-icon.active { color: var(--primary); transform: rotate(45deg); }
        .mic-btn { width: 40px; height: 40px; border-radius: 50%; }
        .mic-btn.active { background: var(--primary); color: #fff; }
        .btn-send { width: 36px; height: 36px; border-radius: 50%; background: #cbd5e1; color: #fff; display: flex; align-items: center; justify-content: center; border: none; }
        .btn-send.active { background: var(--primary); }
        .voice-wave-box { display: flex; align-items: center; justify-content: center; gap: 4px; padding: 10px; background: #f8fafc; border-top: 1px solid #e2e8f0; }
        .b { width: 3px; height: 12px; background: var(--primary); animation: v-wave 0.6s infinite; }
        @keyframes v-wave { 0%, 100% { transform: scaleY(1); } 50% { transform: scaleY(1.5); } }
      `}</style>
    </div>
  );
}
