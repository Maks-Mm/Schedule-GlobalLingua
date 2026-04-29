//src/components/AppWithHero.tsx

import { useState } from 'react';
import HeroBackground from './HeroBackground';
import AppLayout from './AppLayout';

export default function AppWithHero() {
  const [showHero, setShowHero] = useState(true);

  if (showHero) {
    return (
      <HeroBackground>
        <h1>Welcome to GlobalLingua</h1>
        <p>Your premier scheduling platform for language education</p>
        <button className="hero-btn" onClick={() => setShowHero(false)}>
           Dashboard →
        </button>
      </HeroBackground>
    );
  }

  return <AppLayout />;
}