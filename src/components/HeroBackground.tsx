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
      setImageUrl('/GeminiMeanImage.jpg');
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