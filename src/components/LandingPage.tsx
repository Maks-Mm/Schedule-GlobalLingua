//src/components/LandingPage.tsx
import HeroBackground from './HeroBackground';

type LandingPageProps = {
  onEnter?: () => void;
};

export default function LandingPage({ onEnter }: LandingPageProps) {
  return (
    <HeroBackground>
      <h1>Schedule Orchestrator</h1>
      <p>
        Eliminate scheduling chaos. Coordinate teachers, students, and platforms<br />
        in one centralized system. Never miss or double-book a lesson again.
      </p>
      <button className="hero-btn" onClick={onEnter}>
        Launch Orchestrator →
      </button>
    </HeroBackground>
  );
}