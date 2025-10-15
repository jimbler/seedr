import React, { useState, useEffect } from 'react';
import './App.css';
import PlantList from './components/PlantList';
import PlantFilters from './components/PlantFilters';
import PlantStats from './components/PlantStats';
import { loadPlantData } from './services/plantService';
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
    isArchived: null
  });

  useEffect(() => {
    loadPlantData()
      .then(data => {
        setPlants(data);
        setFilteredPlants(data);
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
        plant.botanicalName.toLowerCase().includes(searchLower) ||
        plant.commonName.toLowerCase().includes(searchLower) ||
        plant.family.toLowerCase().includes(searchLower)
      );
    }

    // Apply family filter
    if (filters.family) {
      filtered = filtered.filter(plant => plant.family === filters.family);
    }

    // Apply seasonality filter
    if (filters.seasonality) {
      filtered = filtered.filter(plant => plant.seasonality === parseInt(filters.seasonality));
    }

    // Apply zone filter
    if (filters.zone) {
      filtered = filtered.filter(plant => plant.zone === parseInt(filters.zone));
    }

    // Apply archived filter
    if (filters.isArchived !== null) {
      filtered = filtered.filter(plant => plant.isArchived === filters.isArchived);
    }

    setFilteredPlants(filtered);
  }, [plants, filters]);

  const handleFilterChange = (newFilters: Partial<PlantFiltersType>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
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
        <PlantList plants={filteredPlants} />
      </main>
    </div>
  );
}

export default App;
