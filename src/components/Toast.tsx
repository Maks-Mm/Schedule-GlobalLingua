// components/Toast.tsx

import { useEffect, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

type ToastProps = {
  message: string;
  type?: 'success' | 'error' | 'info';
  duration?: number;
  onClose: () => void;
};

export default function Toast({ message, type = 'success', duration = 3000, onClose }: ToastProps) {
  const [isLeaving, setIsLeaving] = useState(false);
  const { t } = useLanguage(); // ✅ Added translation hook

  useEffect(() => {
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

  // ✅ Now using translated strings instead of hardcoded German
  const titles = {
    success: t.toastSuccess,
    error: t.toastError,
    info: t.toastInfo
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