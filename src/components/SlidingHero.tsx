//src/components/SlidingHero.tsx

import { useState, useEffect } from 'react';

const backgrounds = [
  'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070',
  'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=2073',
  'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?q=80&w=2070',
];

export default function SlidingHero({ children }: { children: React.ReactNode }) {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % backgrounds.length);
    }, 15000); // Change every 15 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div 
      className="hero-background"
      style={{ backgroundImage: `url('${backgrounds[currentImage]}')` }}
    >
      <div className="hero-overlay">
        <div className="hero-content">
          {children}
        </div>
      </div>
    </div>
  );
}