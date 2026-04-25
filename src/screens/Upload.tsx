import { Camera as CameraIcon, ImageIcon, X, Check, RefreshCw } from 'lucide-react';
import { db } from '../storage/db';
import { useSessionStore } from '../state/sessionStore';
import { useRef, useState, useEffect } from 'react';

/**
 * UPLOAD / FULL-SCREEN CAMERA SCANNER
 * ----------------------------------
 * This screen provides a GPT-like full-screen camera experience.
 * It includes a flip camera feature and local image saving.
 */
export function Upload() {
  const setCurrentSessionId = useSessionStore((state) => state.setCurrentSessionId);
  
  // HTML Element Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // State
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment'); // environment = back camera

  /**
   * Action: Start/Restart Camera
   * ----------------------------
   * This handles both initial start and camera flipping.
   */
  const startCamera = async (mode: 'user' | 'environment') => {
    try {
      // If a stream already exists, stop it first (important for flipping)
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }

      setIsCameraActive(true); 
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: mode },
        audio: false 
      });
      setStream(mediaStream);
      setFacingMode(mode);
    } catch (err) {
      console.error("Camera Error:", err);
      alert("Camera access denied or unavailable.");
      setIsCameraActive(false);
    }
  };

  /**
   * Action: Flip Camera
   * -------------------
   * Switches between Front (user) and Back (environment) cameras.
   */
  const toggleCamera = () => {
    const newMode = facingMode === 'user' ? 'environment' : 'user';
    startCamera(newMode);
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsCameraActive(false);
  };

  useEffect(() => {
    if (isCameraActive && stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [isCameraActive, stream]);

  useEffect(() => {
    return () => stopCamera();
  }, []);

  /**
   * Logic: Save Captured Image
   */
  const saveImageData = async (imageBlob: Blob) => {
    setIsProcessing(true);
    const sessionId = crypto.randomUUID();
    const now = Date.now();

    try {
      await db.sessions.add({
        id: sessionId,
        name: `Scan ${new Date().toLocaleTimeString()}`,
        createdAt: now, updatedAt: now, status: 'active'
      });

      await db.images.add({ sessionId, blob: imageBlob, timestamp: now });
      setCurrentSessionId(sessionId);
      
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    } catch (err) {
      console.error("Save Error:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => { if (blob) saveImageData(blob); }, 'image/jpeg', 0.8);
      }
    }
  };

  return (
    <div className="page upload-container">
      
      {/* 1. Initial State: Simple Entry Point */}
      {!isCameraActive && (
        <div className="upload-intro">
          <h2>Document Scanner</h2>
          <p>Scan your form to get instant help</p>
          <button className="gpt-btn-primary" onClick={() => startCamera('environment')}>
            <CameraIcon size={20} />
            <span>Open Camera</span>
          </button>
          <button className="gpt-btn-outline" onClick={() => fileInputRef.current?.click()}>
            <ImageIcon size={20} />
            <span>Pick from Gallery</span>
          </button>
        </div>
      )}

      {/* 2. Full-Screen Camera Overlay (GPT Style) */}
      {isCameraActive && (
        <div className="camera-overlay">
          {/* Live Video Feed */}
          <video ref={videoRef} autoPlay playsInline muted className="full-video" />
          
          {/* Top Controls */}
          <div className="camera-header">
            <button className="icon-btn" onClick={stopCamera}><X size={24} /></button>
            <button className="icon-btn" onClick={toggleCamera}><RefreshCw size={24} /></button>
          </div>

          {/* Bottom Capture Controls */}
          <div className="camera-footer">
            <button className="shutter-btn" onClick={handleCapture} disabled={isProcessing}>
              <div className="shutter-inner"></div>
            </button>
            <p className="capture-status">{isProcessing ? 'Saving...' : 'Tap to scan'}</p>
          </div>

          {/* Success Notification */}
          {showSuccess && (
            <div className="success-popup">
              <Check size={32} />
              <span>Saved Successfully</span>
            </div>
          )}
        </div>
      )}

      {/* Hidden Helpers */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept="image/*" 
             onChange={(e) => { const f = e.target.files?.[0]; if (f) saveImageData(f); }} />

      {/* CSS For Full-Screen GPT Experience */}
      <style>{`
        .upload-container { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 80vh; }
        .upload-intro { text-align: center; display: flex; flex-direction: column; gap: 16px; width: 100%; max-width: 300px; }
        
        .gpt-btn-primary { background: var(--primary); color: white; padding: 16px; border-radius: 12px; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 10px; }
        .gpt-btn-outline { background: #f1f5f9; color: #475569; padding: 16px; border-radius: 12px; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 10px; }

        /* Full Screen Camera Styles */
        .camera-overlay {
          position: fixed; inset: 0; background: black; z-index: 2000;
          display: flex; flex-direction: column;
        }
        .full-video { width: 100%; height: 100%; object-fit: cover; }

        .camera-header {
          position: absolute; top: 0; left: 0; right: 0; padding: 20px;
          display: flex; justify-content: space-between; background: linear-gradient(to bottom, rgba(0,0,0,0.5), transparent);
        }
        .icon-btn { background: rgba(255,255,255,0.2); color: white; border-radius: 50%; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; }

        .camera-footer {
          position: absolute; bottom: 0; left: 0; right: 0; padding: 40px 20px;
          display: flex; flex-direction: column; align-items: center; gap: 15px;
          background: linear-gradient(to top, rgba(0,0,0,0.5), transparent);
        }
        .shutter-btn {
          width: 70px; height: 70px; border-radius: 50%; border: 4px solid white;
          background: transparent; padding: 4px;
        }
        .shutter-inner { width: 100%; height: 100%; background: white; border-radius: 50%; }
        .capture-status { color: white; font-size: 0.9rem; font-weight: 500; }

        .success-popup {
          position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
          background: var(--online); color: white; padding: 20px 30px; border-radius: 20px;
          display: flex; flex-direction: column; align-items: center; gap: 10px;
          animation: popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        @keyframes popIn { from { opacity: 0; transform: translate(-50%, -50%) scale(0.5); } to { opacity: 1; transform: translate(-50%, -50%) scale(1); } }
      `}</style>
    </div>
  );
}
