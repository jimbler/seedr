import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Chip,
  IconButton,
  Collapse,
  Box,
  Divider,
  Stack,
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { formatSeasonality, formatZone, formatPreTreatment, formatGermination } from '../services/plantService';
import { FavoritesService } from '../services/favoritesService';
import { Plant } from '../types/Plant';
import PlantImage from './PlantImage';

interface PlantCardProps {
  plant: Plant;
  onToggleFavorite: (plantId: string) => void;
}

const PlantCard: React.FC<PlantCardProps> = ({ plant, onToggleFavorite }) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite(FavoritesService.getPlantId(plant));
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4,
        },
      }}
    >
      <Box sx={{ position: 'relative' }}>
        <PlantImage plant={plant} useThumbnail={true} />
        <Box
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            display: 'flex',
            gap: 0.5,
          }}
        >
          <Chip
            label={plant.IsArchived ? 'Archived' : 'Active'}
            size="small"
            color={plant.IsArchived ? 'warning' : 'success'}
            sx={{ fontWeight: 500 }}
          />
          <IconButton
            size="small"
            onClick={handleFavoriteClick}
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 1)',
              },
            }}
            title={plant.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            {plant.isFavorite ? (
              <StarIcon sx={{ color: 'warning.main' }} />
            ) : (
              <StarBorderIcon />
            )}
          </IconButton>
        </Box>
      </Box>

      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        <Typography
          variant="h6"
          component="h3"
          gutterBottom
          sx={{
            fontSize: '1.1rem',
            fontWeight: 600,
            lineHeight: 1.3,
            fontStyle: 'italic',
          }}
        >
          {plant.BotanicalName}
        </Typography>

        {plant.CommonName && plant.CommonName.trim() !== '' ? (
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {plant.CommonName}
          </Typography>
        ) : (
          <Typography variant="body2" color="text.disabled" gutterBottom sx={{ fontStyle: 'italic' }}>
            No common name available
          </Typography>
        )}

        <Divider sx={{ my: 1.5 }} />

        <Stack spacing={1}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2" color="text.secondary">
              Family:
            </Typography>
            <Typography variant="body2" fontWeight={500}>
              {plant.Family}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2" color="text.secondary">
              Zone:
            </Typography>
            <Typography variant="body2" fontWeight={500}>
              {formatZone(plant.Zone)}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2" color="text.secondary">
              Type:
            </Typography>
            <Typography variant="body2" fontWeight={500}>
              {formatSeasonality(plant.Seasonality)}
            </Typography>
          </Box>
          {plant.Price > 0 && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" color="text.secondary">
                Price:
              </Typography>
              <Typography variant="body2" fontWeight={500} color="success.main">
                ${plant.Price}
              </Typography>
            </Box>
          )}
        </Stack>
      </CardContent>

      <CardActions sx={{ justifyContent: 'center', pt: 0 }}>
        <IconButton
          onClick={toggleExpanded}
          aria-expanded={isExpanded}
          aria-label="show more"
          sx={{
            transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.3s',
          }}
        >
          <ExpandMoreIcon />
        </IconButton>
      </CardActions>

      <Collapse in={isExpanded} timeout="auto" unmountOnExit>
        <CardContent sx={{ pt: 0 }}>
          <Divider sx={{ mb: 2 }} />

          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" fontWeight={600} gutterBottom color="primary">
              Plant Details
            </Typography>
            <Stack spacing={1}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">
                  Plant Code:
                </Typography>
                <Typography variant="body2">{plant.externalPlantCode}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">
                  Size:
                </Typography>
                <Typography variant="body2">{plant.Size}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">
                  Quantity:
                </Typography>
                <Typography variant="body2">{plant.Quantity}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">
                  Wild Origin:
                </Typography>
                <Typography variant="body2">{plant.WildOrigin ? 'Yes' : 'No'}</Typography>
              </Box>
            </Stack>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" fontWeight={600} gutterBottom color="primary">
              Growing Information
            </Typography>
            <Stack spacing={1}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">
                  Pre-Treatment:
                </Typography>
                <Typography variant="body2" sx={{ textAlign: 'right', maxWidth: '60%' }}>
                  {formatPreTreatment(plant.PreTreatment)}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">
                  Germination:
                </Typography>
                <Typography variant="body2" sx={{ textAlign: 'right', maxWidth: '60%' }}>
                  {formatGermination(plant.Germination)}
                </Typography>
              </Box>
              {plant.Origin && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">
                    Origin:
                  </Typography>
                  <Typography variant="body2" sx={{ textAlign: 'right', maxWidth: '60%' }}>
                    {plant.Origin}
                  </Typography>
                </Box>
              )}
              {plant.Elevation > 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">
                    Elevation:
                  </Typography>
                  <Typography variant="body2">
                    {plant.Elevation}ft ({plant.ElevationMeters}m)
                  </Typography>
                </Box>
              )}
            </Stack>
          </Box>

          {plant.Description && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" fontWeight={600} gutterBottom color="primary">
                Description
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                {plant.Description}
              </Typography>
            </Box>
          )}

          {plant.imageSource && (
            <Box>
              <Typography variant="subtitle2" fontWeight={600} gutterBottom color="primary">
                Image Attribution
              </Typography>
              <Stack spacing={0.5}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">
                    Source:
                  </Typography>
                  <Typography variant="body2" sx={{ textAlign: 'right', maxWidth: '70%' }}>
                    {plant.imageSource}
                  </Typography>
                </Box>
                {plant.imageLicense && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">
                      License:
                    </Typography>
                    <Typography variant="body2" sx={{ textAlign: 'right', maxWidth: '70%' }}>
                      {plant.imageLicense}
                    </Typography>
                  </Box>
                )}
              </Stack>
            </Box>
          )}
        </CardContent>
      </Collapse>
    </Card>
  );
};

export default PlantCard;
