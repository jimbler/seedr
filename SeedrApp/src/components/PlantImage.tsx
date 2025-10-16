import React, { useState } from 'react';
import { Plant } from '../types/Plant';

interface PlantImageProps {
  plant: Plant;
  useThumbnail?: boolean;
  showLicense?: boolean;
  className?: string;
  onClick?: () => void;
}

const PlantImage: React.FC<PlantImageProps> = ({ 
  plant, 
  useThumbnail = true, 
  showLicense = false,
  className = '',
  onClick 
}) => {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const imageUrl = useThumbnail && plant.thumbnailUrl ? plant.thumbnailUrl : plant.imageUrl;
  const hasImage = !imageError && imageUrl && imageUrl.trim() !== '';

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const handleImageError = () => {
    setImageError(true);
    setIsLoading(false);
  };

  if (!hasImage) {
    return (
      <div className={`plant-image-placeholder ${className}`} onClick={onClick}>
        <img 
          src="/plant-placeholder.svg" 
          alt="No image available"
          loading="lazy"
        />
      </div>
    );
  }

  return (
    <div className={`plant-image-container ${className}`} onClick={onClick}>
      {isLoading && (
        <div className="image-loading">
          <div className="spinner-small"></div>
        </div>
      )}
      <img
        src={imageUrl}
        alt={plant.CommonName || plant.BotanicalName}
        onLoad={handleImageLoad}
        onError={handleImageError}
        loading="lazy"
        className={`plant-image ${isLoading ? 'loading' : ''}`}
      />
      {showLicense && plant.imageSource && (
        <div className="image-attribution">
          <small>
            Source: {plant.imageSource}
            {plant.imageLicense && ` | ${plant.imageLicense}`}
          </small>
        </div>
      )}
    </div>
  );
};

export default PlantImage;

