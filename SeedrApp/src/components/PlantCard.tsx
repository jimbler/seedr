import React, { useState } from 'react';
import { formatSeasonality, formatZone, formatPreTreatment, formatGermination } from '../services/plantService';
import { Plant } from '../types/Plant';

interface PlantCardProps {
  plant: Plant;
}

const PlantCard: React.FC<PlantCardProps> = ({ plant }) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const getStatusBadge = () => {
    if (plant.isArchived) {
      return <span className="status-badge archived">Archived</span>;
    }
    return <span className="status-badge active">Active</span>;
  };

  const getCommonNameDisplay = () => {
    if (plant.commonName && plant.commonName.trim() !== '') {
      return <div className="common-name">{plant.commonName}</div>;
    }
    return <div className="no-common-name">No common name available</div>;
  };

  return (
    <div className={`plant-card ${isExpanded ? 'expanded' : ''}`}>
      <div className="card-header" onClick={toggleExpanded}>
        <div className="plant-names">
          <div className="botanical-name">{plant.botanicalName}</div>
          {getCommonNameDisplay()}
        </div>
        <div className="card-badges">
          {getStatusBadge()}
          <span className="expand-icon">{isExpanded ? '−' : '+'}</span>
        </div>
      </div>

      <div className="card-basic-info">
        <div className="info-row">
          <span className="label">Family:</span>
          <span className="value">{plant.family}</span>
        </div>
        <div className="info-row">
          <span className="label">Zone:</span>
          <span className="value">{formatZone(plant.zone)}</span>
        </div>
        <div className="info-row">
          <span className="label">Type:</span>
          <span className="value">{formatSeasonality(plant.seasonality)}</span>
        </div>
        {plant.price > 0 && (
          <div className="info-row">
            <span className="label">Price:</span>
            <span className="value">${plant.price}</span>
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
                <span className="value">{plant.plantCode}</span>
              </div>
              <div className="info-row">
                <span className="label">Size:</span>
                <span className="value">{plant.size}</span>
              </div>
              <div className="info-row">
                <span className="label">Quantity:</span>
                <span className="value">{plant.quantity}</span>
              </div>
              <div className="info-row">
                <span className="label">Wild Origin:</span>
                <span className="value">{plant.wildOrigin ? 'Yes' : 'No'}</span>
              </div>
            </div>
          </div>

          <div className="details-section">
            <h4>Growing Information</h4>
            <div className="info-grid">
              <div className="info-row">
                <span className="label">Pre-Treatment:</span>
                <span className="value">{formatPreTreatment(plant.preTreatment)}</span>
              </div>
              <div className="info-row">
                <span className="label">Germination:</span>
                <span className="value">{formatGermination(plant.germination)}</span>
              </div>
              {plant.origin && (
                <div className="info-row">
                  <span className="label">Origin:</span>
                  <span className="value">{plant.origin}</span>
                </div>
              )}
              {plant.elevation > 0 && (
                <div className="info-row">
                  <span className="label">Elevation:</span>
                  <span className="value">{plant.elevation}ft ({plant.elevationMeters}m)</span>
                </div>
              )}
            </div>
          </div>

          {plant.description && (
            <div className="details-section">
              <h4>Description</h4>
              <p className="description">{plant.description}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PlantCard;
