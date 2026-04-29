// src/components/LanguageToggle.tsx

import { useLanguage } from '../contexts/LanguageContext';

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'de' : 'en');
  };

  return (
    <button 
      className="language-toggle" 
      onClick={toggleLanguage}
      aria-label={language === 'en' ? 'Switch to German' : 'Auf Englisch umschalten'}
    >
      <span className={`flag ${language === 'en' ? 'active' : ''}`}>🇬🇧 EN</span>
      <span className="toggle-separator">|</span>
      <span className={`flag ${language === 'de' ? 'active' : ''}`}>🇩🇪 DE</span>
    </button>
  );
}