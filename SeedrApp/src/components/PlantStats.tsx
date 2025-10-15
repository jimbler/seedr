import React from 'react';
import { getPlantStats } from '../services/plantService';
import { Plant } from '../types/Plant';

interface PlantStatsProps {
  plants: Plant[];
  totalPlants: number;
}

const PlantStats: React.FC<PlantStatsProps> = ({ plants, totalPlants }) => {
  const stats = getPlantStats(plants);
  const commonNamePercentage = totalPlants > 0 ? Math.round((stats.withCommonNames / totalPlants) * 100) : 0;

  return (
    <div className="plant-stats">
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-number">{stats.total}</div>
          <div className="stat-label">Showing</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{totalPlants}</div>
          <div className="stat-label">Total Plants</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.withCommonNames}</div>
          <div className="stat-label">With Common Names</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{commonNamePercentage}%</div>
          <div className="stat-label">Common Name Coverage</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.active}</div>
          <div className="stat-label">Active</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.archived}</div>
          <div className="stat-label">Archived</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.families}</div>
          <div className="stat-label">Plant Families</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.zones.length}</div>
          <div className="stat-label">Hardiness Zones</div>
        </div>
      </div>
    </div>
  );
};

export default PlantStats;
