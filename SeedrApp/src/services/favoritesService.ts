// Favorites service for managing plant favorites
// Uses localStorage for persistence

import { Plant } from '../types/Plant';

const FAVORITES_STORAGE_KEY = 'seedr-favorites';

export class FavoritesService {
  private static favorites: Set<string> = new Set();

  // Initialize favorites from localStorage
  static initialize(): void {
    try {
      const stored = localStorage.getItem(FAVORITES_STORAGE_KEY);
      if (stored) {
        const favoritesArray = JSON.parse(stored);
        this.favorites = new Set(favoritesArray);
      }
    } catch (error) {
      console.error('Error loading favorites from localStorage:', error);
      this.favorites = new Set();
    }
  }

  // Save favorites to localStorage
  private static saveToStorage(): void {
    try {
      const favoritesArray = Array.from(this.favorites);
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favoritesArray));
    } catch (error) {
      console.error('Error saving favorites to localStorage:', error);
    }
  }

  // Get all favorite plant codes
  static getFavorites(): Set<string> {
    return new Set(this.favorites);
  }

  // Get the unique identifier for a plant using plantGuid
  static getPlantId(plant: Plant): string {
    // Use plantGuid if it exists and is not empty
    if (plant.plantGuid && plant.plantGuid.trim() !== '') {
      return plant.plantGuid;
    }
    // Fallback to externalPlantCode if plantGuid is not available
    if (plant.externalPlantCode && plant.externalPlantCode.trim() !== '') {
      return plant.externalPlantCode;
    }
    // Last resort: use botanical name (should not happen with new data)
    return plant.BotanicalName || 'unknown';
  }

  // Check if a plant is favorited
  static isFavorite(plantId: string): boolean {
    return this.favorites.has(plantId);
  }

  // Add a plant to favorites
  static addToFavorites(plantId: string): void {
    this.favorites.add(plantId);
    this.saveToStorage();
  }

  // Remove a plant from favorites
  static removeFromFavorites(plantId: string): void {
    this.favorites.delete(plantId);
    this.saveToStorage();
  }

  // Toggle favorite status
  static toggleFavorite(plantId: string): boolean {
    if (this.favorites.has(plantId)) {
      this.removeFromFavorites(plantId);
      return false;
    } else {
      this.addToFavorites(plantId);
      return true;
    }
  }

  // Clear all favorites
  static clearAllFavorites(): void {
    this.favorites.clear();
    this.saveToStorage();
  }

  // Get count of favorites
  static getFavoritesCount(): number {
    return this.favorites.size;
  }

  // Apply favorites status to plants array
  static applyFavoritesToPlants(plants: Plant[]): Plant[] {
    return plants.map((plant) => ({
      ...plant,
      isFavorite: this.isFavorite(this.getPlantId(plant))
    }));
  }

  // Get only favorite plants
  static getFavoritePlants(plants: Plant[]): Plant[] {
    return plants.filter((plant) => this.isFavorite(this.getPlantId(plant)));
  }
}
