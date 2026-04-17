//src/components/LandingPage.tsx

import HeroBackground from './HeroBackground';

type LandingPageProps = {
  onEnter?: () => void;
};

export default function LandingPage({ onEnter }: LandingPageProps) {
  return (
    <HeroBackground>
      <h1>GlobalLingua Academy</h1>
      <p>
        Master languages with our premium scheduling platform.<br />
        Connect teachers and students seamlessly.
      </p>
      <button className="hero-btn" onClick={onEnter}>
        Enter Dashboard →
      </button>
    </HeroBackground>
  );
}