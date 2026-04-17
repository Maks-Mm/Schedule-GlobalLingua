//src/components/ConfirmDialog.tsx

import { useEffect, useState } from 'react';
import '../styles/confirm.css';  // Add this import

type ConfirmDialogProps = {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  type?: 'danger' | 'warning' | 'info';
};

export default function ConfirmDialog({ 
  isOpen, 
  title, 
  message, 
  onConfirm, 
  onCancel,
  type = 'danger' 
}: ConfirmDialogProps) {
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(() => {
      setIsLeaving(false);
      onCancel();
    }, 200);
  };

  const handleConfirm = () => {
    setIsLeaving(true);
    setTimeout(() => {
      setIsLeaving(false);
      onConfirm();
    }, 200);
  };

  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'danger':
        return '🗑️';
      case 'warning':
        return '⚠️';
      case 'info':
        return 'ℹ️';
      default:
        return '🗑️';
    }
  };

  const getButtonClass = () => {
    switch (type) {
      case 'danger':
        return 'confirm-btn-danger';
      case 'warning':
        return 'confirm-btn-warning';
      case 'info':
        return 'confirm-btn-info';
      default:
        return 'confirm-btn-danger';
    }
  };

  const getButtonText = () => {
    switch (type) {
      case 'danger':
        return 'Löschen';
      case 'warning':
        return 'Bestätigen';
      case 'info':
        return 'OK';
      default:
        return 'Löschen';
    }
  };

  return (
    <div className={`confirm-overlay ${isLeaving ? 'confirm-leaving' : ''}`}>
      <div className="confirm-modal">
        <div className="confirm-icon">{getIcon()}</div>
        <h3 className="confirm-title">{title}</h3>
        <p className="confirm-message">{message}</p>
        <div className="confirm-buttons">
          <button className="confirm-btn-cancel" onClick={handleClose}>
            Abbrechen
          </button>
          <button className={getButtonClass()} onClick={handleConfirm}>
            {getButtonText()}
          </button>
        </div>
      </div>
    </div>
  );
}