// components/Toast.tsx
import { useEffect, useState } from 'react';

type ToastProps = {
  message: string;
  type?: 'success' | 'error' | 'info';
  duration?: number;
  onClose: () => void;
};

export default function Toast({ message, type = 'success', duration = 3000, onClose }: ToastProps) {
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    // Start leaving animation before the actual unmount
    const leaveTimer = setTimeout(() => {
      setIsLeaving(true);
    }, duration - 300);

    const closeTimer = setTimeout(() => {
      onClose();
    }, duration);

    return () => {
      clearTimeout(leaveTimer);
      clearTimeout(closeTimer);
    };
  }, [duration, onClose]);

  const icons = {
    success: '✅',
    error: '❌',
    info: 'ℹ️'
  };

  const titles = {
    success: 'Erfolg',
    error: 'Fehler',
    info: 'Information'
  };

  return (
    <div 
      className={`toast-modern toast-${type} ${isLeaving ? 'toast-leaving' : 'toast-entering'}`}
      onClick={onClose}
    >
      <div className="toast-icon">{icons[type]}</div>
      <div className="toast-content">
        <div className="toast-title">{titles[type]}</div>
        <div className="toast-message">{message}</div>
      </div>
      <button className="toast-close" onClick={(e) => { e.stopPropagation(); onClose(); }}>×</button>
      
      <div className="toast-progress-bar">
        <div 
          className="toast-progress-fill" 
          style={{ animationDuration: `${duration}ms` }} 
        />
      </div>
    </div>
  );
}