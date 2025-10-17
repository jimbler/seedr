import React, { useCallback, useState, useEffect, useMemo } from 'react';
import { Box, useTheme, useMediaQuery, Grid } from '@mui/material';
import PlantCard from './PlantCard';
import { Plant } from '../types/Plant';
import { FavoritesService } from '../services/favoritesService';

// Import react-window - use default export approach for CJS compatibility
// @ts-ignore
const { FixedSizeList } = require('react-window');

interface VirtualPlantGridProps {
  plants: Plant[];
  onToggleFavorite: (plantId: string) => void;
}

const VirtualPlantGrid: React.FC<VirtualPlantGridProps> = ({ plants, onToggleFavorite }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isDesktop = useMediaQuery(theme.breakpoints.between('md', 'lg'));
  
  // Calculate number of columns based on screen size
  const getColumnCount = () => {
    if (isMobile) return 1;
    if (isTablet) return 2;
    if (isDesktop) return 3;
    return 4; // lg and up
  };

  const columnCount = getColumnCount();
  
  // Card dimensions
  const cardHeight = 480;
  const gap = 24; // MUI spacing(3)
  
  // Row height includes card height + gap
  const rowHeight = cardHeight + gap;
  
  // Calculate container dimensions
  const [containerWidth, setContainerWidth] = useState(window.innerWidth - 100); // Account for padding and sidebar
  const [containerHeight, setContainerHeight] = useState(window.innerHeight - 350); // Account for header/stats/controls

  useEffect(() => {
    const handleResize = () => {
      setContainerWidth(window.innerWidth - 100);
      setContainerHeight(window.innerHeight - 350);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Group plants into rows - memoize to prevent recalculation
  const rows = useMemo(() => {
    const result = [];
    for (let i = 0; i < plants.length; i += columnCount) {
      result.push(plants.slice(i, i + columnCount));
    }
    return result;
  }, [plants, columnCount]);

  // Row renderer - renders a row of cards
  const Row = useCallback(({ index, style }: any) => {
    const rowPlants = rows[index];
    
    return (
      <Box style={style}>
        <Grid container spacing={3} sx={{ px: 1.5 }}>
          {rowPlants.map((plant) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={FavoritesService.getPlantId(plant)}>
              <PlantCard
                plant={plant}
                onToggleFavorite={onToggleFavorite}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }, [rows, onToggleFavorite]);

  // Fallback to regular Grid if FixedSizeList is not available
  if (!FixedSizeList) {
    console.warn('react-window not loaded properly, falling back to regular Grid');
    return (
      <Grid container spacing={3}>
        {plants.map((plant) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={FavoritesService.getPlantId(plant)}>
            <PlantCard plant={plant} onToggleFavorite={onToggleFavorite} />
          </Grid>
        ))}
      </Grid>
    );
  }

  return (
    <Box sx={{ width: '100%', height: containerHeight, minHeight: 500 }}>
      <FixedSizeList
        height={containerHeight}
        itemCount={rows.length}
        itemSize={rowHeight}
        width={containerWidth}
        overscanCount={2}
      >
        {Row}
      </FixedSizeList>
    </Box>
  );
};

export default React.memo(VirtualPlantGrid);

