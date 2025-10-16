import React from 'react';
import { getUniqueFamilies, getUniqueSeasonalities, getUniqueZones, formatSeasonality, formatZone } from '../services/plantService';
import { Plant, PlantFilters as PlantFiltersType } from '../types/Plant';

interface PlantFiltersProps {
  plants: Plant[];
  filters: PlantFiltersType;
  onFilterChange: (newFilters: Partial<PlantFiltersType>) => void;
}

const PlantFilters: React.FC<PlantFiltersProps> = ({ plants, filters, onFilterChange }) => {
  const families = getUniqueFamilies(plants);
  const seasonalities = getUniqueSeasonalities(plants);
  const zones = getUniqueZones(plants);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ search: e.target.value });
  };

  const handleFamilyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ family: e.target.value });
  };

  const handleSeasonalityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ seasonality: e.target.value });
  };

  const handleZoneChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ zone: e.target.value });
  };

  const handleArchivedChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value === 'all' ? null : e.target.value === 'true';
    onFilterChange({ isArchived: value });
  };

  const handleFavoritesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ showFavoritesOnly: e.target.checked });
  };

  const clearFilters = () => {
    onFilterChange({
      search: '',
      family: '',
      seasonality: '',
      zone: '',
      isArchived: null,
      showFavoritesOnly: false
    });
  };

  const hasActiveFilters = filters.search || filters.family || filters.seasonality || filters.zone || filters.isArchived !== null || filters.showFavoritesOnly;

  return (
    <div className="plant-filters">
      <div className="filters-header">
        <h3>🔍 Filters</h3>
        {hasActiveFilters && (
          <button className="clear-filters-btn" onClick={clearFilters}>
            Clear All
          </button>
        )}
      </div>
      
      <div className="filters-grid">
        <div className="filter-group">
          <label htmlFor="search">Search</label>
          <input
            type="text"
            id="search"
            placeholder="Search by name or family..."
            value={filters.search}
            onChange={handleSearchChange}
            className="filter-input"
          />
        </div>

        <div className="filter-group">
          <label htmlFor="family">Family</label>
          <select
            id="family"
            value={filters.family}
            onChange={handleFamilyChange}
            className="filter-select"
          >
            <option value="">All Families</option>
            {families.map(family => (
              <option key={family} value={family}>{family}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="seasonality">Seasonality</label>
          <select
            id="seasonality"
            value={filters.seasonality}
            onChange={handleSeasonalityChange}
            className="filter-select"
          >
            <option value="">All Types</option>
            {seasonalities.map(seasonality => (
              <option key={seasonality} value={seasonality}>
                {formatSeasonality(seasonality)}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="zone">Hardiness Zone</label>
          <select
            id="zone"
            value={filters.zone}
            onChange={handleZoneChange}
            className="filter-select"
          >
            <option value="">All Zones</option>
            {zones.map(zone => (
              <option key={zone} value={zone}>
                {formatZone(zone)}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="archived">Status</label>
          <select
            id="archived"
            value={filters.isArchived === null ? 'all' : filters.isArchived.toString()}
            onChange={handleArchivedChange}
            className="filter-select"
          >
            <option value="all">All Plants</option>
            <option value="false">Active Only</option>
            <option value="true">Archived Only</option>
          </select>
        </div>

        <div className="filter-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={filters.showFavoritesOnly}
              onChange={handleFavoritesChange}
              className="filter-checkbox"
            />
            <span className="checkbox-text">⭐ Show Favorites Only</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default PlantFilters;
