import React, { useState } from 'react';
import { Box, Skeleton, Typography } from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';
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
      <Box
        className={className}
        onClick={onClick}
        sx={{
          width: '100%',
          height: useThumbnail ? 200 : 300,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.04)',
          cursor: onClick ? 'pointer' : 'default',
          borderRadius: 1,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <ImageIcon sx={{ fontSize: 60, color: 'text.disabled' }} />
      </Box>
    );
  }

  return (
    <Box
      className={className}
      onClick={onClick}
      sx={{
        width: '100%',
        height: useThumbnail ? 200 : 300,
        position: 'relative',
        overflow: 'hidden',
        cursor: onClick ? 'pointer' : 'default',
        borderRadius: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.02)',
      }}
    >
      {isLoading && (
        <Skeleton
          variant="rectangular"
          width="100%"
          height="100%"
          animation="wave"
          sx={{ position: 'absolute', top: 0, left: 0 }}
        />
      )}
      <Box
        component="img"
        src={imageUrl}
        alt={plant.CommonName || plant.BotanicalName}
        onLoad={handleImageLoad}
        onError={handleImageError}
        loading="lazy"
        sx={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: isLoading ? 'none' : 'block',
        }}
      />
      {showLicense && plant.imageSource && !isLoading && (
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            color: 'white',
            padding: 0.5,
            fontSize: '0.7rem',
          }}
        >
          <Typography variant="caption" sx={{ color: 'white' }}>
            Source: {plant.imageSource}
            {plant.imageLicense && ` | ${plant.imageLicense}`}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default PlantImage;
