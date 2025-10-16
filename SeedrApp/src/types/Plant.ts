// TypeScript type definitions for Plant model
// These correspond to the C# Plant class properties

export enum Seasonality {
  Perennial = 0,
  Annual = 1,
  Biennial = 2
}

export enum Zone {
  Default = 0,
  Zone1 = 1,   // Below -60°F
  Zone2 = 2,   // -50° to -40°F
  Zone3 = 3,   // -40° to -30°F
  Zone4 = 4,   // -30° to -20°F
  Zone5 = 5,   // -20° to -10°F
  Zone6 = 6,   // -10° to 0°F
  Zone7 = 7,   // 0° to 10°F
  Zone8 = 8,   // 10° to 20°F
  Zone9 = 9,   // 20° to 30°F
  Zone10 = 10, // 30° to 40°F
  Zone11 = 11, // 40° to 50°F
  Zone12 = 12, // 50° to 60°F
  Zone13 = 13  // 60° to 70°F
}

export enum PreTreatment {
  None = 0,
  Light = 1,           // Light is required or seed is so tiny that it should not be buried
  Scarify = 2,         // Scarify seed by rubbing lightly on sandpaper or nick seed coat
  Cover = 4,           // Cover seed to a depth of about 4 times the minimum seed dimension
  Rub = 8,             // Rub vigorously between hands to remove impermeable seed coat or fuzz, etc.
  Edgewise = 16,       // Seed is flat and wide — insert seed in sowing medium to stand on edge
  GibberelicAcid = 32, // Gibberelic Acid (GA3) treatment helpful in stimulating germination
  Water = 64           // Water treatment: germination takes place under water
}

export enum Germination {
  Default = 0,
  NoColdStrat = 1,           // No cold stratification necessary: germination is usually complete within a month or less
  NoColdStratStaggered = 2,  // No cold stratification necessary: germination may be staggered over several weeks
  ColdStratWeeks = 3,        // Cold stratification required for the number of weeks indicated
  ColdStratWeeksStaggered = 4, // Cold stratification required for the number of weeks indicated, followed by exposure to warmth
  WarmMoistStrat = 5,        // Warm, moist stratification required for 3 to 4 months
  Ferns = 6,                 // Germination of fern spores
  Orchids = 7                // Germination of orchid seeds requires specialized equipment
}

export enum ExternalCatalog {
  Default = 0,
  AlPlains = 1
}

export interface Plant {
  CommonName: string;
  BotanicalName: string;
  Family: string;
  Description: string;
  externalPlantCode: string;
  plantGuid: string;
  Size: string;
  Origin: string;
  Elevation: number;
  ElevationMeters: number;
  Quantity: string;
  Price: number;
  WildOrigin: boolean;
  IsArchived: boolean;
  ExternalCatalog: ExternalCatalog;
  Seasonality: Seasonality;
  Zone: Zone;
  PreTreatment: PreTreatment;
  Germination: Germination;
  imageUrl: string;
  thumbnailUrl: string;
  imageSource: string;
  imageLicense: string;
  isFavorite?: boolean;
}

export interface PlantFilters {
  search: string;
  family: string;
  seasonality: string;
  zone: string;
  isArchived: boolean | null;
  showFavoritesOnly: boolean;
  hasPhotos: boolean;
}

export interface PlantStats {
  total: number;
  withCommonNames: number;
  archived: number;
  active: number;
  families: number;
  zones: number[];
  seasonalities: number[];
}
