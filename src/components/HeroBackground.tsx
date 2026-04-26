// src/components/HeroBackground.tsx

import { useState, useEffect } from 'react';

type HeroProps = {
  children?: React.ReactNode;
  backgroundImage?: string;
};

export default function HeroBackground({ children, backgroundImage }: HeroProps) {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    // Use provided image or a default premium image
    if (backgroundImage) {
      setImageUrl(backgroundImage);
    } else {
      // Use a reliable online background image instead of local file that may not exist
      setImageUrl('https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=1973&auto=format&fit=crop');
    }
  }, [backgroundImage]);

  return (
    <div 
      className="hero-background"
      style={{ 
        backgroundImage: !imageError && imageUrl ? `url('${imageUrl}')` : 'none',
        backgroundColor: '#0a0c10'
      }}
    >
      <div className="hero-overlay">
        <div className="hero-content">
          {children}
        </div>
      </div>
    </div>
  );
}