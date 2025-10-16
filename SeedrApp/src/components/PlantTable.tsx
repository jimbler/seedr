import React, { useState } from 'react';
import { formatSeasonality, formatZone, formatPreTreatment, formatGermination } from '../services/plantService';
import { FavoritesService } from '../services/favoritesService';
import { Plant } from '../types/Plant';

interface PlantTableProps {
  plants: Plant[];
  onToggleFavorite: (plantId: string) => void;
}

type SortField = keyof Plant;
type SortOrder = 'asc' | 'desc';

const PlantTable: React.FC<PlantTableProps> = ({ plants, onToggleFavorite }) => {
  const [sortBy, setSortBy] = useState<SortField>('BotanicalName');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const handleSortChange = (newSortBy: SortField) => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortOrder('asc');
    }
  };

  const toggleRowExpansion = (plantId: string) => {
    const newExpandedRows = new Set(expandedRows);
    if (newExpandedRows.has(plantId)) {
      newExpandedRows.delete(plantId);
    } else {
      newExpandedRows.add(plantId);
    }
    setExpandedRows(newExpandedRows);
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

  const getSortIcon = (field: SortField) => {
    if (sortBy !== field) return '↕️';
    return sortOrder === 'asc' ? '↑' : '↓';
  };

  const getStatusBadge = (plant: Plant) => {
    if (plant.IsArchived) {
      return <span className="status-badge archived">Archived</span>;
    }
    return <span className="status-badge active">Active</span>;
  };

  if (plants.length === 0) {
    return (
      <div className="plant-table">
        <div className="no-plants">
          <h3>No plants found</h3>
          <p>Try adjusting your filters to see more results.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="plant-table">
      <div className="table-header">
        <h3>🌿 Plant Collection ({plants.length} plants)</h3>
      </div>
      
      <div className="table-container">
        <table className="plants-table">
          <thead>
            <tr>
              <th 
                className="sortable" 
                onClick={() => handleSortChange('BotanicalName')}
                title="Click to sort"
              >
                Botanical Name {getSortIcon('BotanicalName')}
              </th>
              <th 
                className="sortable" 
                onClick={() => handleSortChange('CommonName')}
                title="Click to sort"
              >
                Common Name {getSortIcon('CommonName')}
              </th>
              <th 
                className="sortable" 
                onClick={() => handleSortChange('Family')}
                title="Click to sort"
              >
                Family {getSortIcon('Family')}
              </th>
              <th 
                className="sortable" 
                onClick={() => handleSortChange('Zone')}
                title="Click to sort"
              >
                Zone {getSortIcon('Zone')}
              </th>
              <th 
                className="sortable" 
                onClick={() => handleSortChange('Seasonality')}
                title="Click to sort"
              >
                Seasonality {getSortIcon('Seasonality')}
              </th>
              <th 
                className="sortable" 
                onClick={() => handleSortChange('Price')}
                title="Click to sort"
              >
                Price {getSortIcon('Price')}
              </th>
              <th>Status</th>
              <th>Favorite</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedPlants.map((plant) => {
              const plantId = FavoritesService.getPlantId(plant);
              const isExpanded = expandedRows.has(plantId);
              
              return (
                <React.Fragment key={plantId}>
                  <tr className="plant-row">
                    <td className="botanical-name">
                      <strong>{plant.BotanicalName}</strong>
                    </td>
                    <td className="common-name">
                      {plant.CommonName && plant.CommonName.trim() !== '' 
                        ? plant.CommonName 
                        : <span className="no-common-name">No common name</span>
                      }
                    </td>
                    <td className="family">{plant.Family}</td>
                    <td className="zone">{formatZone(plant.Zone)}</td>
                    <td className="seasonality">{formatSeasonality(plant.Seasonality)}</td>
                    <td className="price">${plant.Price.toFixed(2)}</td>
                    <td className="status">{getStatusBadge(plant)}</td>
                    <td className="favorite">
                      <button
                        className={`favorite-btn ${plant.isFavorite ? 'favorited' : ''}`}
                        onClick={() => onToggleFavorite(plantId)}
                        title={plant.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                      >
                        {plant.isFavorite ? '⭐' : '☆'}
                      </button>
                    </td>
                    <td className="actions">
                      <button 
                        className="expand-btn"
                        onClick={() => toggleRowExpansion(plantId)}
                        title={isExpanded ? 'Collapse details' : 'Expand details'}
                      >
                        {isExpanded ? '−' : '+'}
                      </button>
                    </td>
                  </tr>
                  {isExpanded && (
                    <tr className="expanded-row">
                      <td colSpan={9} className="expanded-content">
                        <div className="plant-details">
                          <div className="details-grid">
                            <div className="detail-item">
                              <strong>Plant Code:</strong> {plant.externalPlantCode}
                            </div>
                            <div className="detail-item">
                              <strong>Size:</strong> {plant.Size || 'N/A'}
                            </div>
                            <div className="detail-item">
                              <strong>Origin:</strong> {plant.Origin || 'N/A'}
                            </div>
                            <div className="detail-item">
                              <strong>Elevation:</strong> {plant.Elevation} ft / {plant.ElevationMeters} m
                            </div>
                            <div className="detail-item">
                              <strong>Quantity:</strong> {plant.Quantity}
                            </div>
                            <div className="detail-item">
                              <strong>Wild Origin:</strong> {plant.WildOrigin ? 'Yes' : 'No'}
                            </div>
                            <div className="detail-item">
                              <strong>External Catalog:</strong> {plant.ExternalCatalog}
                            </div>
                            <div className="detail-item">
                              <strong>Pre-Treatment:</strong> {formatPreTreatment(plant.PreTreatment)}
                            </div>
                            <div className="detail-item">
                              <strong>Germination:</strong> {formatGermination(plant.Germination)}
                            </div>
                          </div>
                          <div className="description-section">
                            <strong>Description:</strong>
                            <p className="plant-description">{plant.Description}</p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PlantTable;
