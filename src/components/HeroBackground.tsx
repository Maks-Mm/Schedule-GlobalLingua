//src/compomponents/HeroBackground.tsx

import { useState, useEffect } from 'react';

type HeroProps = {
  children?: React.ReactNode;
  backgroundImage?: string;
};

export default function HeroBackground({ children, backgroundImage }: HeroProps) {
  const [imageUrl, setImageUrl] = useState<string>('');

  useEffect(() => {
    // Use provided image or a default premium image
    if (backgroundImage) {
      setImageUrl(backgroundImage);
    } else {
      // Premium education/language learning background
      setImageUrl('https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=2070&auto=format&fit=crop');
    }
  }, [backgroundImage]);

  return (
    <div 
      className="hero-background"
      style={{ backgroundImage: `url('${imageUrl}')` }}
    >
      <div className="hero-overlay">
        <div className="hero-content">
          {children}
        </div>
      </div>
    </div>
  );
}