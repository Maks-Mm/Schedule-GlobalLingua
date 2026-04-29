import { useEffect, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import '../styles/confirm.css';

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
  const { t } = useLanguage();
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
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
        return t.deleteConfirm;
      case 'warning':
        return t.proceed;
      case 'info':
        return t.ok;
      default:
        return t.deleteConfirm;
    }
  };

  const getTitle = () => {
    switch (type) {
      case 'danger':
        return t.confirmDeleteTitle;
      case 'warning':
        return t.confirmWarningTitle;
      case 'info':
        return t.confirmInfoTitle;
      default:
        return t.confirmDeleteTitle;
    }
  };

  const getMessage = () => {
    switch (type) {
      case 'danger':
        return t.confirmDeleteMessage;
      default:
        return message;
    }
  };

  return (
    <div className={`confirm-overlay ${isLeaving ? 'confirm-leaving' : ''}`}>
      <div className="confirm-modal">
        <div className="confirm-icon">{getIcon()}</div>

        <h3 className="confirm-title">{getTitle()}</h3>

        <p className="confirm-message">{getMessage()}</p>

        <div className="confirm-buttons">
          <button className="confirm-btn-cancel" onClick={handleClose}>
            {t.cancel}
          </button>

          <button className={getButtonClass()} onClick={handleConfirm}>
            {getButtonText()}
          </button>
        </div>
      </div>
    </div>
  );
}