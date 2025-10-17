import React from 'react';
import {
  Card,
  CardContent,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Button,
  Typography,
  Box,
  Chip,
  Stack,
  InputAdornment,
  SelectChangeEvent,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import FilterListIcon from '@mui/icons-material/FilterList';
import StarIcon from '@mui/icons-material/Star';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
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

  const handleFamilyChange = (e: SelectChangeEvent<string>) => {
    onFilterChange({ family: e.target.value });
  };

  const handleSeasonalityChange = (e: SelectChangeEvent<string>) => {
    onFilterChange({ seasonality: e.target.value });
  };

  const handleZoneChange = (e: SelectChangeEvent<string>) => {
    onFilterChange({ zone: e.target.value });
  };

  const handleArchivedChange = (e: SelectChangeEvent<string>) => {
    const value = e.target.value === 'all' ? null : e.target.value === 'true';
    onFilterChange({ isArchived: value });
  };

  const handleFavoritesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ showFavoritesOnly: e.target.checked });
  };

  const handlePhotosChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ hasPhotos: e.target.checked });
  };

  const clearFilters = () => {
    onFilterChange({
      search: '',
      family: '',
      seasonality: '',
      zone: '',
      isArchived: null,
      showFavoritesOnly: false,
      hasPhotos: false
    });
  };

  const hasActiveFilters = filters.search || filters.family || filters.seasonality || filters.zone || filters.isArchived !== null || filters.showFavoritesOnly || filters.hasPhotos;
  
  const activeFilterCount = [
    filters.search,
    filters.family,
    filters.seasonality,
    filters.zone,
    filters.isArchived !== null,
    filters.showFavoritesOnly,
    filters.hasPhotos
  ].filter(Boolean).length;

  return (
    <Card sx={{ position: 'sticky', top: 80 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FilterListIcon color="primary" />
            <Typography variant="h6">Filters</Typography>
            {activeFilterCount > 0 && (
              <Chip 
                label={activeFilterCount} 
                size="small" 
                color="primary" 
                sx={{ ml: 1 }}
              />
            )}
          </Box>
          {hasActiveFilters && (
            <Button
              size="small"
              startIcon={<ClearIcon />}
              onClick={clearFilters}
              variant="outlined"
            >
              Clear
            </Button>
          )}
        </Box>
        
        <Stack spacing={2.5}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search by name or family..."
            value={filters.search}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
            size="small"
          />

          <FormControl fullWidth size="small">
            <InputLabel>Family</InputLabel>
            <Select
              value={filters.family}
              onChange={handleFamilyChange}
              label="Family"
            >
              <MenuItem value="">All Families</MenuItem>
              {families.map(family => (
                <MenuItem key={family} value={family}>{family}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth size="small">
            <InputLabel>Seasonality</InputLabel>
            <Select
              value={filters.seasonality}
              onChange={handleSeasonalityChange}
              label="Seasonality"
            >
              <MenuItem value="">All Types</MenuItem>
              {seasonalities.map(seasonality => (
                <MenuItem key={seasonality} value={seasonality}>
                  {formatSeasonality(seasonality)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth size="small">
            <InputLabel>Hardiness Zone</InputLabel>
            <Select
              value={filters.zone}
              onChange={handleZoneChange}
              label="Hardiness Zone"
            >
              <MenuItem value="">All Zones</MenuItem>
              {zones.map(zone => (
                <MenuItem key={zone} value={zone}>
                  {formatZone(zone)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth size="small">
            <InputLabel>Status</InputLabel>
            <Select
              value={filters.isArchived === null ? 'all' : filters.isArchived.toString()}
              onChange={handleArchivedChange}
              label="Status"
            >
              <MenuItem value="all">All Plants</MenuItem>
              <MenuItem value="false">Active Only</MenuItem>
              <MenuItem value="true">Archived Only</MenuItem>
            </Select>
          </FormControl>

          <Box>
            <FormControlLabel
              control={
                <Checkbox
                  checked={filters.showFavoritesOnly}
                  onChange={handleFavoritesChange}
                  icon={<StarIcon />}
                  checkedIcon={<StarIcon />}
                  color="primary"
                />
              }
              label="Show Favorites Only"
            />
          </Box>

          <Box>
            <FormControlLabel
              control={
                <Checkbox
                  checked={filters.hasPhotos}
                  onChange={handlePhotosChange}
                  icon={<PhotoCameraIcon />}
                  checkedIcon={<PhotoCameraIcon />}
                  color="primary"
                />
              }
              label="Has Photos"
            />
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default PlantFilters;
