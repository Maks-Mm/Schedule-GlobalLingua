//src/App.tsx

import { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import AppLayout from './components/AppLayout';

function App() {
  const [showDashboard, setShowDashboard] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleEnter = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setShowDashboard(true);
      setIsTransitioning(false);
    }, 500);
  };

  if (!showDashboard) {
    return <LandingPage onEnter={handleEnter} />;
  }

  return (
    <div className={isTransitioning ? 'fade-out' : 'fade-in'}>
      <AppLayout />
    </div>
  );
}

export default App;