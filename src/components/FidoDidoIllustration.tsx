import React from 'react';

interface FidoDidoIllustrationProps {
  className?: string;
  pose?: 'chill' | 'thumbs_up' | 'drinking' | 'arcade';
  showCan?: boolean;
}

export const FidoDidoIllustration: React.FC<FidoDidoIllustrationProps> = ({
  className = 'w-48 h-64',
}) => {
  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      <img
        src="/fido 1.svg"
        alt="Fido Dido"
        className="w-full h-full object-contain filter drop-shadow-md"
        loading="eager"
      />
    </div>
  );
};

