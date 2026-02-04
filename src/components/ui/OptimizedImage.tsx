import { useState } from 'react';
import { ImageOff } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OptimizedImageProps {
  src: string | null | undefined;
  alt: string;
  fallbackSrc?: string;
  className?: string;
  containerClassName?: string;
  showFallbackIcon?: boolean;
}

const DEFAULT_FALLBACK = '/placeholder.svg';

export const OptimizedImage = ({
  src,
  alt,
  fallbackSrc = DEFAULT_FALLBACK,
  className = '',
  containerClassName = '',
  showFallbackIcon = true,
}: OptimizedImageProps) => {
  const [imageSrc, setImageSrc] = useState<string>(src || fallbackSrc);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImageSrc(fallbackSrc);
    }
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  // If no source and showing fallback icon
  if (hasError && showFallbackIcon && imageSrc === DEFAULT_FALLBACK) {
    return (
      <div className={cn(
        "w-full h-full bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center",
        containerClassName
      )}>
        <ImageOff className="w-12 h-12 text-gray-400" />
      </div>
    );
  }

  return (
    <div className={cn("relative overflow-hidden", containerClassName)}>
      {isLoading && (
        <div className="absolute inset-0 bg-gradient-to-br from-purple-100 to-blue-100 animate-pulse" />
      )}
      <img
        src={imageSrc}
        alt={alt}
        loading="lazy"
        onError={handleError}
        onLoad={handleLoad}
        className={cn(
          "transition-opacity duration-300",
          isLoading ? "opacity-0" : "opacity-100",
          className
        )}
      />
    </div>
  );
};
