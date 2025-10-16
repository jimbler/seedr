import React, { useState } from 'react';
import { formatSeasonality, formatZone, formatPreTreatment, formatGermination } from '../services/plantService';
import { FavoritesService } from '../services/favoritesService';
import { Plant } from '../types/Plant';
import PlantImage from './PlantImage';

interface PlantCardProps {
  plant: Plant;
  onToggleFavorite: (plantId: string) => void;
}

const PlantCard: React.FC<PlantCardProps> = ({ plant, onToggleFavorite }) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const getStatusBadge = () => {
    if (plant.IsArchived) {
      return <span className="status-badge archived">Archived</span>;
    }
    return <span className="status-badge active">Active</span>;
  };

  const getCommonNameDisplay = () => {
    if (plant.CommonName && plant.CommonName.trim() !== '') {
      return <div className="common-name">{plant.CommonName}</div>;
    }
    return <div className="no-common-name">No common name available</div>;
  };

  return (
    <div className={`plant-card ${isExpanded ? 'expanded' : ''}`}>
      <PlantImage plant={plant} useThumbnail={true} />
      
      <div className="card-header" onClick={toggleExpanded}>
        <div className="plant-names">
          <div className="botanical-name">{plant.BotanicalName}</div>
          {getCommonNameDisplay()}
        </div>
        <div className="card-badges">
          {getStatusBadge()}
          <button
            className={`favorite-btn ${plant.isFavorite ? 'favorited' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(FavoritesService.getPlantId(plant));
            }}
            title={plant.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            {plant.isFavorite ? '⭐' : '☆'}
          </button>
          <span className="expand-icon">{isExpanded ? '−' : '+'}</span>
        </div>
      </div>

      <div className="card-basic-info">
        <div className="info-row">
          <span className="label">Family:</span>
          <span className="value">{plant.Family}</span>
        </div>
        <div className="info-row">
          <span className="label">Zone:</span>
          <span className="value">{formatZone(plant.Zone)}</span>
        </div>
        <div className="info-row">
          <span className="label">Type:</span>
          <span className="value">{formatSeasonality(plant.Seasonality)}</span>
        </div>
        {plant.Price > 0 && (
          <div className="info-row">
            <span className="label">Price:</span>
            <span className="value">${plant.Price}</span>
          </div>
        )}
      </div>

      {isExpanded && (
        <div className="card-details">
          <div className="details-section">
            <h4>Plant Details</h4>
            <div className="info-grid">
              <div className="info-row">
                <span className="label">Plant Code:</span>
                <span className="value">{plant.externalPlantCode}</span>
              </div>
              <div className="info-row">
                <span className="label">Size:</span>
                <span className="value">{plant.Size}</span>
              </div>
              <div className="info-row">
                <span className="label">Quantity:</span>
                <span className="value">{plant.Quantity}</span>
              </div>
              <div className="info-row">
                <span className="label">Wild Origin:</span>
                <span className="value">{plant.WildOrigin ? 'Yes' : 'No'}</span>
              </div>
            </div>
          </div>

          <div className="details-section">
            <h4>Growing Information</h4>
            <div className="info-grid">
              <div className="info-row">
                <span className="label">Pre-Treatment:</span>
                <span className="value">{formatPreTreatment(plant.PreTreatment)}</span>
              </div>
              <div className="info-row">
                <span className="label">Germination:</span>
                <span className="value">{formatGermination(plant.Germination)}</span>
              </div>
              {plant.Origin && (
                <div className="info-row">
                  <span className="label">Origin:</span>
                  <span className="value">{plant.Origin}</span>
                </div>
              )}
              {plant.Elevation > 0 && (
                <div className="info-row">
                  <span className="label">Elevation:</span>
                  <span className="value">{plant.Elevation}ft ({plant.ElevationMeters}m)</span>
                </div>
              )}
            </div>
          </div>

          {plant.Description && (
            <div className="details-section">
              <h4>Description</h4>
              <p className="description">{plant.Description}</p>
            </div>
          )}
          
          {plant.imageSource && (
            <div className="details-section">
              <h4>Image Attribution</h4>
              <div className="info-grid">
                <div className="info-row">
                  <span className="label">Source:</span>
                  <span className="value">{plant.imageSource}</span>
                </div>
                {plant.imageLicense && (
                  <div className="info-row">
                    <span className="label">License:</span>
                    <span className="value">{plant.imageLicense}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PlantCard;
