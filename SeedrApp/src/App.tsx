import React, { useState, useEffect } from 'react';
import './App.css';
import PlantList from './components/PlantList';
import PlantFilters from './components/PlantFilters';
import PlantStats from './components/PlantStats';
import { loadPlantData } from './services/plantService';
import { FavoritesService } from './services/favoritesService';
import { Plant, PlantFilters as PlantFiltersType } from './types/Plant';

const App: React.FC = () => {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [filteredPlants, setFilteredPlants] = useState<Plant[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<PlantFiltersType>({
    search: '',
    family: '',
    seasonality: '',
    zone: '',
    isArchived: null,
    showFavoritesOnly: false
  });

  useEffect(() => {
    // Initialize favorites service
    FavoritesService.initialize();
    
    loadPlantData()
      .then(data => {
        // Apply favorites status to plants
        const plantsWithFavorites = FavoritesService.applyFavoritesToPlants(data);
        setPlants(plantsWithFavorites);
        setFilteredPlants(plantsWithFavorites);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    let filtered = plants;

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
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

    setFilteredPlants(filtered);
  }, [plants, filters]);

  const handleFilterChange = (newFilters: Partial<PlantFiltersType>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleToggleFavorite = (plantId: string) => {
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
  };

  if (loading) {
    return (
      <div className="app">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading plant data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app">
        <div className="error">
          <h2>Error Loading Data</h2>
          <p>{error}</p>
          <p>Make sure the plant data JSON file is available.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>🌱 Seedr Plant Database</h1>
        <p>Explore and manage your plant collection</p>
      </header>
      
      <main className="app-main">
        <PlantStats plants={filteredPlants} totalPlants={plants.length} />
        <PlantFilters 
          plants={plants}
          filters={filters}
          onFilterChange={handleFilterChange}
        />
        <PlantList 
          plants={filteredPlants} 
          onToggleFavorite={handleToggleFavorite}
        />
      </main>
    </div>
  );
}

export default App;
