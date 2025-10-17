import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  ToggleButtonGroup,
  ToggleButton,
  Stack,
  IconButton,
  Grid,
  SelectChangeEvent,
} from '@mui/material';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import ViewListIcon from '@mui/icons-material/ViewList';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import PlantCard from './PlantCard';
import PlantTable from './PlantTable';
import { FavoritesService } from '../services/favoritesService';
import { Plant } from '../types/Plant';

interface PlantListProps {
  plants: Plant[];
  onToggleFavorite: (plantId: string) => void;
}

type SortField = keyof Plant;
type SortOrder = 'asc' | 'desc';
type ViewMode = 'cards' | 'table';

const PlantList: React.FC<PlantListProps> = ({ plants, onToggleFavorite }) => {
  const [sortBy, setSortBy] = useState<SortField>('BotanicalName');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [viewMode, setViewMode] = useState<ViewMode>('cards');

  const handleSortChange = (newSortBy: SortField) => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortOrder('asc');
    }
  };

  const sortedPlants = [...plants].sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];

    // Handle undefined values
    if (aValue === undefined) aValue = '';
    if (bValue === undefined) bValue = '';

    // Handle string comparison
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }

    if (sortOrder === 'asc') {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });

  if (plants.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h5" color="text.secondary" gutterBottom>
          No plants found
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Try adjusting your filters to see more results.
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Paper sx={{ p: 2, mb: 3 }}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          alignItems={{ xs: 'stretch', sm: 'center' }}
          justifyContent="space-between"
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="h6" component="h2">
              Plant Collection
            </Typography>
            <Typography variant="body2" color="text.secondary">
              ({plants.length} {plants.length === 1 ? 'plant' : 'plants'})
            </Typography>
          </Box>

          <Stack direction="row" spacing={2} alignItems="center">
            <ToggleButtonGroup
              value={viewMode}
              exclusive
              onChange={(_, newMode) => newMode && setViewMode(newMode)}
              size="small"
            >
              <ToggleButton value="cards" aria-label="card view">
                <ViewModuleIcon fontSize="small" sx={{ mr: 0.5 }} />
                Cards
              </ToggleButton>
              <ToggleButton value="table" aria-label="table view">
                <ViewListIcon fontSize="small" sx={{ mr: 0.5 }} />
                Table
              </ToggleButton>
            </ToggleButtonGroup>

            {viewMode === 'cards' && (
              <Stack direction="row" spacing={1} alignItems="center">
                <FormControl size="small" sx={{ minWidth: 150 }}>
                  <InputLabel>Sort by</InputLabel>
                  <Select
                    value={sortBy}
                    onChange={(e: SelectChangeEvent) => handleSortChange(e.target.value as SortField)}
                    label="Sort by"
                  >
                    <MenuItem value="BotanicalName">Botanical Name</MenuItem>
                    <MenuItem value="CommonName">Common Name</MenuItem>
                    <MenuItem value="Family">Family</MenuItem>
                    <MenuItem value="Zone">Zone</MenuItem>
                    <MenuItem value="Seasonality">Seasonality</MenuItem>
                    <MenuItem value="Price">Price</MenuItem>
                  </Select>
                </FormControl>
                <IconButton
                  size="small"
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  title={`Sort ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
                >
                  {sortOrder === 'asc' ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
                </IconButton>
              </Stack>
            )}
          </Stack>
        </Stack>
      </Paper>

      {viewMode === 'cards' ? (
        <Grid container spacing={3}>
          {sortedPlants.map((plant) => (
            <Grid item xs={12} sm={6} lg={4} key={FavoritesService.getPlantId(plant)}>
              <PlantCard 
                plant={plant} 
                onToggleFavorite={onToggleFavorite}
              />
            </Grid>
          ))}
        </Grid>
      ) : (
        <PlantTable 
          plants={plants} 
          onToggleFavorite={onToggleFavorite}
        />
      )}
    </Box>
  );
};

export default PlantList;
