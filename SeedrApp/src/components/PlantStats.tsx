import React from 'react';
import { Card, CardContent, Grid, Box, Typography, Paper } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import LocalFloristIcon from '@mui/icons-material/LocalFlorist';
import LabelIcon from '@mui/icons-material/Label';
import PercentIcon from '@mui/icons-material/Percent';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArchiveIcon from '@mui/icons-material/Archive';
import CategoryIcon from '@mui/icons-material/Category';
import TerrainIcon from '@mui/icons-material/Terrain';
import { getPlantStats } from '../services/plantService';
import { Plant } from '../types/Plant';

interface PlantStatsProps {
  plants: Plant[];
  totalPlants: number;
}

interface StatCardProps {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, value, label, color }) => (
  <Paper
    elevation={0}
    sx={{
      p: 2,
      backgroundColor: color,
      borderRadius: 2,
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
    }}
  >
    <Box sx={{ color: 'primary.main', mb: 1 }}>{icon}</Box>
    <Typography variant="h5" component="div" fontWeight={600} sx={{ mb: 0.5 }}>
      {value}
    </Typography>
    <Typography variant="body2" color="text.secondary">
      {label}
    </Typography>
  </Paper>
);

const PlantStats: React.FC<PlantStatsProps> = ({ plants, totalPlants }) => {
  const stats = getPlantStats(plants);
  const commonNamePercentage = totalPlants > 0 ? Math.round((stats.withCommonNames / totalPlants) * 100) : 0;

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={6} sm={4} md={3}>
            <StatCard
              icon={<VisibilityIcon fontSize="large" />}
              value={stats.total}
              label="Showing"
              color="rgba(61, 107, 31, 0.08)"
            />
          </Grid>
          <Grid item xs={6} sm={4} md={3}>
            <StatCard
              icon={<LocalFloristIcon fontSize="large" />}
              value={totalPlants}
              label="Total Plants"
              color="rgba(78, 130, 36, 0.08)"
            />
          </Grid>
          <Grid item xs={6} sm={4} md={3}>
            <StatCard
              icon={<LabelIcon fontSize="large" />}
              value={stats.withCommonNames}
              label="With Common Names"
              color="rgba(232, 220, 196, 0.5)"
            />
          </Grid>
          <Grid item xs={6} sm={4} md={3}>
            <StatCard
              icon={<PercentIcon fontSize="large" />}
              value={`${commonNamePercentage}%`}
              label="Coverage"
              color="rgba(212, 197, 160, 0.4)"
            />
          </Grid>
          <Grid item xs={6} sm={4} md={3}>
            <StatCard
              icon={<CheckCircleIcon fontSize="large" />}
              value={stats.active}
              label="Active"
              color="rgba(78, 130, 36, 0.12)"
            />
          </Grid>
          <Grid item xs={6} sm={4} md={3}>
            <StatCard
              icon={<ArchiveIcon fontSize="large" />}
              value={stats.archived}
              label="Archived"
              color="rgba(212, 165, 67, 0.12)"
            />
          </Grid>
          <Grid item xs={6} sm={4} md={3}>
            <StatCard
              icon={<CategoryIcon fontSize="large" />}
              value={stats.families}
              label="Families"
              color="rgba(90, 138, 159, 0.12)"
            />
          </Grid>
          <Grid item xs={6} sm={4} md={3}>
            <StatCard
              icon={<TerrainIcon fontSize="large" />}
              value={stats.zones.length}
              label="Zones"
              color="rgba(90, 138, 159, 0.12)"
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default PlantStats;
