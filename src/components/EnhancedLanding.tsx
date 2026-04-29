//src/components/EnhancedLanding.tsx

import HeroBackground from './HeroBackground';

export default function EnhancedLanding({ onEnter }: { onEnter: () => void }) {
  return (
    <HeroBackground>
      <div style={{ textAlign: 'center' }}>
        <span className="badge" style={{ 
          display: 'inline-block', 
          marginBottom: '1rem',
          fontSize: '0.9rem'
        }}>
          ✨ PREMIUM PLATFORM
        </span>
        <h1>GlobalLingua</h1>
        <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>
          Schedule Synchronization  Pro
        </p>
        <p>
          Effortlessly manage your language classes,<br />
          connect teachers and students, and optimize your schedule.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button className="hero-btn" onClick={onEnter}>
            Get Started
          </button>
          <button className="hero-btn" style={{ background: 'transparent', border: '2px solid var(--accent)' }}>
            Learn More
          </button>
        </div>
      </div>
    </HeroBackground>
  );
}