// src/components/Header.tsx

import LanguageToggle from './LanguageToggle';
import { useLanguage } from '../contexts/LanguageContext';

export default function Header() {
  const { t } = useLanguage();

  return (
    <header className="glass-header">
      <div className="logo-area">
        <span className="logo">{t.appTitle}</span>
        <span className="badge">{t.appBadge}</span>
        <LanguageToggle />
      </div>
    </header>
  );
}