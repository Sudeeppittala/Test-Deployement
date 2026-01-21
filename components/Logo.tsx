
import React, { useState } from 'react';
import { getAssetUrl } from '../logoConfig';

export type LogoVariant = 'header' | 'footer' | 'hero' | 'symbol' | 'watermark' | 'wordmark';

interface LogoProps {
  variant?: LogoVariant;
  className?: string;
  /**
   * Optional override to force a specific width, useful for responsive designs
   */
  width?: number | string;
}

const Logo: React.FC<LogoProps> = ({ 
  variant = 'header', 
  className = '',
  width
}) => {
  const [hasError, setHasError] = useState(false);
  
  let src = '';
  let alt = 'Placemein';
  const defaultClasses = 'object-contain select-none pointer-events-none transition-opacity duration-500';

  switch (variant) {
    case 'header':
      src = getAssetUrl('fullPrimary');
      alt = 'Placemein';
      break;
    case 'footer':
      src = getAssetUrl('fullLight');
      alt = 'Placemein';
      break;
    case 'hero':
      src = getAssetUrl('hero3d');
      alt = 'Placemein 3D';
      break;
    case 'symbol':
      src = getAssetUrl('symbolPrimary');
      alt = 'Placemein Symbol';
      break;
    case 'watermark':
      // Using metallic or primary symbol for watermarks
      src = getAssetUrl('symbolPrimary'); 
      alt = 'Placemein Watermark';
      break;
    case 'wordmark':
      src = getAssetUrl('wordmarkPrimary');
      alt = 'Placemein';
      break;
    default:
      src = getAssetUrl('fullPrimary');
  }

  // Fallback UI if image fails to load
  if (hasError) {
    const isLight = variant === 'footer' || variant === 'hero';
    const isSymbol = variant === 'symbol' || variant === 'hero' || variant === 'watermark';

    return (
      <div 
        className={`font-sans font-bold tracking-tighter flex items-center select-none ${className} ${isLight ? 'text-white' : 'text-primary'}`}
        style={width ? { width } : undefined}
      >
        {isSymbol ? (
          <div className="w-8 h-8 rounded-lg bg-current opacity-20 flex items-center justify-center">
            <span className="text-current opacity-100">P</span>
          </div>
        ) : (
          <span>PLACEMEIN</span>
        )}
      </div>
    );
  }

  return (
    <img 
      src={src} 
      alt={alt} 
      className={`${defaultClasses} ${className}`}
      style={width ? { width } : undefined}
      draggable={false}
      onError={() => setHasError(true)}
      loading="lazy"
    />
  );
};

export default Logo;
