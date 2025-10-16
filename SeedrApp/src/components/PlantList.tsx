import React, { useState } from 'react';
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
      <div className="plant-list">
        <div className="no-plants">
          <h3>No plants found</h3>
          <p>Try adjusting your filters to see more results.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="plant-list">
      <div className="list-header">
        <h3>🌿 Plant Collection ({plants.length} plants)</h3>
        <div className="view-controls">
          <div className="view-toggle">
            <button
              className={`view-btn ${viewMode === 'cards' ? 'active' : ''}`}
              onClick={() => setViewMode('cards')}
              title="Card view"
            >
              📋 Cards
            </button>
            <button
              className={`view-btn ${viewMode === 'table' ? 'active' : ''}`}
              onClick={() => setViewMode('table')}
              title="Table view"
            >
              📊 Table
            </button>
          </div>
          {viewMode === 'cards' && (
            <div className="sort-controls">
              <label htmlFor="sort-select">Sort by:</label>
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value as SortField)}
                className="sort-select"
              >
                <option value="BotanicalName">Botanical Name</option>
                <option value="CommonName">Common Name</option>
                <option value="Family">Family</option>
                <option value="Zone">Hardiness Zone</option>
                <option value="Seasonality">Seasonality</option>
                <option value="Price">Price</option>
              </select>
              <button
                className="sort-order-btn"
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                title={`Sort ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
              >
                {sortOrder === 'asc' ? '↑' : '↓'}
              </button>
            </div>
          )}
        </div>
      </div>

      {viewMode === 'cards' ? (
        <div className="plants-grid">
          {sortedPlants.map((plant) => (
            <PlantCard 
              key={FavoritesService.getPlantId(plant)} 
              plant={plant} 
              onToggleFavorite={onToggleFavorite}
            />
          ))}
        </div>
      ) : (
        <PlantTable 
          plants={plants} 
          onToggleFavorite={onToggleFavorite}
        />
      )}
    </div>
  );
};

export default PlantList;
