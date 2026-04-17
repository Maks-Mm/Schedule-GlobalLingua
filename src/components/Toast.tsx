//components/Toast.tsx

import { useEffect, useState } from 'react';

type ToastProps = {
  message: string;
  type?: 'success' | 'error';
  duration?: number;
  onClose: () => void;
};

export default function Toast({ message, type = 'success', duration = 2400, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!isVisible) return null;

  return (
    <div className="toast-modern" style={{ borderLeftColor: type === 'error' ? '#ef4444' : '#10b981' }}>
      {message}
    </div>
  );
}