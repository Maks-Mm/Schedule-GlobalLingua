// src/components/LandingPage.tsx

import HeroBackground from './HeroBackground';
import { useLanguage } from '../contexts/LanguageContext';

type LandingPageProps = {
  onEnter: () => void;
};

export default function LandingPage({ onEnter }: LandingPageProps) {
  const { t } = useLanguage();

  return (
    <div className="landing-container">
      <HeroBackground />
      <div className="hero-content">
        <div className="hero-badge">{t.heroBadge}</div>
        <h1 className="hero-title">{t.welcomeTitle}</h1>
        <p className="hero-subtitle">{t.welcomeSubtitle}</p>
        <button onClick={onEnter} className="enter-button">
          {t.enterButton}
        </button>
      </div>
    </div>
  );
}