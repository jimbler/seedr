import React, { useState } from 'react';
import PlantCard from './PlantCard';
import { Plant } from '../types/Plant';

interface PlantListProps {
  plants: Plant[];
}

type SortField = keyof Plant;
type SortOrder = 'asc' | 'desc';

const PlantList: React.FC<PlantListProps> = ({ plants }) => {
  const [sortBy, setSortBy] = useState<SortField>('botanicalName');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

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
        <div className="sort-controls">
          <label htmlFor="sort-select">Sort by:</label>
          <select
            id="sort-select"
            value={sortBy}
            onChange={(e) => handleSortChange(e.target.value as SortField)}
            className="sort-select"
          >
            <option value="botanicalName">Botanical Name</option>
            <option value="commonName">Common Name</option>
            <option value="family">Family</option>
            <option value="zone">Hardiness Zone</option>
            <option value="seasonality">Seasonality</option>
            <option value="price">Price</option>
          </select>
          <button
            className="sort-order-btn"
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            title={`Sort ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
          </button>
        </div>
      </div>

      <div className="plants-grid">
        {sortedPlants.map((plant, index) => (
          <PlantCard key={`${plant.botanicalName}-${index}`} plant={plant} />
        ))}
      </div>
    </div>
  );
};

export default PlantList;
