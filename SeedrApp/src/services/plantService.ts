// Plant data service
// This service handles loading and processing plant data

import { Plant, PlantStats, Seasonality, Zone, PreTreatment, Germination } from '../types/Plant';

export const loadPlantData = async (): Promise<Plant[]> => {
  try {
    // In a real application, this would be an API call
    // For now, we'll load from the public directory
    const response = await fetch('/plant-data.json');
    
    if (!response.ok) {
      throw new Error(`Failed to load plant data: ${response.status}`);
    }
    
    const data: Plant[] = await response.json();
    
    // Filter out plants without a botanical name
    const filteredData = data.filter(plant => 
      plant.BotanicalName && plant.BotanicalName.trim() !== ''
    );
    
    // Log how many plants were filtered out for debugging
    if (data.length !== filteredData.length) {
      console.log(`Filtered out ${data.length - filteredData.length} plants without botanical names`);
    }
    
    return filteredData;
  } catch (error) {
    console.error('Error loading plant data:', error);
    throw new Error('Unable to load plant data. Please ensure the data file is available.');
  }
};

export const getPlantStats = (plants: Plant[]): PlantStats => {
  const stats: PlantStats = {
    total: plants.length,
    withCommonNames: plants.filter(p => p.CommonName && p.CommonName.trim() !== '').length,
    archived: plants.filter(p => p.IsArchived).length,
    active: plants.filter(p => !p.IsArchived).length,
    families: [...new Set(plants.map(p => p.Family))].length,
    zones: [...new Set(plants.map(p => p.Zone))].sort((a, b) => a - b),
    seasonalities: [...new Set(plants.map(p => p.Seasonality))]
  };
  
  return stats;
};

export const getUniqueFamilies = (plants: Plant[]): string[] => {
  return [...new Set(plants.map(p => p.Family))].sort();
};

export const getUniqueSeasonalities = (plants: Plant[]): number[] => {
  // Return all possible seasonality values, not just those present in data
  return [Seasonality.Perennial, Seasonality.Annual, Seasonality.Biennial];
};

export const getUniqueZones = (plants: Plant[]): number[] => {
  // Return all possible zone values, not just those present in data
  return [
    Zone.Default, Zone.Zone1, Zone.Zone2, Zone.Zone3, Zone.Zone4, Zone.Zone5,
    Zone.Zone6, Zone.Zone7, Zone.Zone8, Zone.Zone9, Zone.Zone10, Zone.Zone11,
    Zone.Zone12, Zone.Zone13
  ];
};

export const formatSeasonality = (seasonality: number): string => {
  const seasonalityMap: Record<number, string> = {
    [Seasonality.Perennial]: 'Perennial',
    [Seasonality.Annual]: 'Annual', 
    [Seasonality.Biennial]: 'Biennial'
  };
  return seasonalityMap[seasonality] || 'Unknown';
};

export const formatZone = (zone: number): string => {
  return zone === Zone.Default ? 'N/A' : `Zone ${zone}`;
};

export const formatPreTreatment = (preTreatment: number): string => {
  const treatments: string[] = [];
  if (preTreatment & PreTreatment.Light) treatments.push('Light');
  if (preTreatment & PreTreatment.Scarify) treatments.push('Scarify');
  if (preTreatment & PreTreatment.Cover) treatments.push('Cover');
  if (preTreatment & PreTreatment.Rub) treatments.push('Rub');
  if (preTreatment & PreTreatment.Edgewise) treatments.push('Edgewise');
  if (preTreatment & PreTreatment.GibberelicAcid) treatments.push('Gibberelic Acid');
  if (preTreatment & PreTreatment.Water) treatments.push('Water');
  
  return treatments.length > 0 ? treatments.join(', ') : 'None';
};

export const formatGermination = (germination: number): string => {
  const germinationMap: Record<number, string> = {
    [Germination.Default]: 'Default',
    [Germination.NoColdStrat]: 'No Cold Stratification',
    [Germination.NoColdStratStaggered]: 'No Cold Stratification (Staggered)',
    [Germination.ColdStratWeeks]: 'Cold Stratification Required',
    [Germination.ColdStratWeeksStaggered]: 'Cold Stratification (Staggered)',
    [Germination.WarmMoistStrat]: 'Warm Moist Stratification',
    [Germination.Ferns]: 'Fern Spores',
    [Germination.Orchids]: 'Orchid Seeds'
  };
  return germinationMap[germination] || 'Unknown';
};

export const formatFamily = (family: string): string => {
  // Return N/A if family is blank or doesn't end with "ae"
  if (!family || family.trim() === '' || !family.endsWith('ae')) {
    return 'N/A';
  }
  return family;
};

export const shouldDisplayOrigin = (origin: string): boolean => {
  // Don't display origin if it contains "..."
  return Boolean(origin) && !origin.includes('...');
};
