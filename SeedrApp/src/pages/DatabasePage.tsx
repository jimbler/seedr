import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Container, Box, CircularProgress, Alert, Typography, Grid } from '@mui/material';
import PlantList from '../components/PlantList';
import PlantFilters from '../components/PlantFilters';
import PlantStats from '../components/PlantStats';
import { loadPlantData } from '../services/plantService';
import { FavoritesService } from '../services/favoritesService';
import { Plant, PlantFilters as PlantFiltersType } from '../types/Plant';

const DatabasePage: React.FC = () => {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<PlantFiltersType>({
    search: '',
    family: '',
    seasonality: '',
    zone: '',
    isArchived: null,
    showFavoritesOnly: false,
    hasPhotos: false
  });
  const [debouncedSearch, setDebouncedSearch] = useState<string>('');

  useEffect(() => {
    // Initialize favorites service
    FavoritesService.initialize();
    
    loadPlantData()
      .then(data => {
        // Apply favorites status to plants
        const plantsWithFavorites = FavoritesService.applyFavoritesToPlants(data);
        setPlants(plantsWithFavorites);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Debounce search input with 300ms delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(filters.search);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [filters.search]);

  // Memoize filtered plants calculation
  const filteredPlants = useMemo(() => {
    let filtered = plants;

    // Apply search filter (using debounced value)
    if (debouncedSearch) {
      const searchLower = debouncedSearch.toLowerCase();
      filtered = filtered.filter(plant => 
        plant.BotanicalName.toLowerCase().includes(searchLower) ||
        plant.CommonName.toLowerCase().includes(searchLower) ||
        plant.Family.toLowerCase().includes(searchLower)
      );
    }

    // Apply family filter
    if (filters.family) {
      filtered = filtered.filter(plant => plant.Family === filters.family);
    }

    // Apply seasonality filter
    if (filters.seasonality) {
      filtered = filtered.filter(plant => plant.Seasonality === parseInt(filters.seasonality));
    }

    // Apply zone filter
    if (filters.zone) {
      filtered = filtered.filter(plant => plant.Zone === parseInt(filters.zone));
    }

    // Apply archived filter
    if (filters.isArchived !== null) {
      filtered = filtered.filter(plant => plant.IsArchived === filters.isArchived);
    }

    // Apply favorites filter
    if (filters.showFavoritesOnly) {
      filtered = filtered.filter(plant => Boolean(plant.isFavorite));
    }

    // Apply photos filter
    if (filters.hasPhotos) {
      filtered = filtered.filter(plant => plant.imageUrl && plant.imageUrl.trim() !== '');
    }

    return filtered;
  }, [plants, debouncedSearch, filters.family, filters.seasonality, filters.zone, filters.isArchived, filters.showFavoritesOnly, filters.hasPhotos]);

  const handleFilterChange = useCallback((newFilters: Partial<PlantFiltersType>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const handleToggleFavorite = useCallback((plantId: string) => {
    const isNowFavorite = FavoritesService.toggleFavorite(plantId);
    
    // Update the plants array to reflect the new favorite status
    setPlants(prevPlants => 
      prevPlants.map((plant) => {
        const currentPlantId = FavoritesService.getPlantId(plant);
        if (currentPlantId === plantId) {
          return { ...plant, isFavorite: isNowFavorite };
        }
        return plant;
      })
    );
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '70vh',
          gap: 2,
        }}
      >
        <CircularProgress size={60} />
        <Typography variant="h6" color="text.secondary">
          Loading plant database...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 8 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            Error Loading Data
          </Typography>
          <Typography variant="body1">{error}</Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            Make sure the plant data JSON file is available.
          </Typography>
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <PlantStats plants={filteredPlants} totalPlants={plants.length} />
      
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={3}>
          <PlantFilters 
            plants={plants}
            filters={filters}
            onFilterChange={handleFilterChange}
          />
        </Grid>
        
        <Grid item xs={12} md={9}>
          <PlantList 
            plants={filteredPlants} 
            onToggleFavorite={handleToggleFavorite}
          />
        </Grid>
      </Grid>
    </Container>
  );
};

export default DatabasePage;

