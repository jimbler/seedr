import React, { useState, useMemo } from 'react';
import { Box, Grid, TablePagination, Paper } from '@mui/material';
import PlantCard from './PlantCard';
import { Plant } from '../types/Plant';
import { FavoritesService } from '../services/favoritesService';

interface PaginatedPlantGridProps {
  plants: Plant[];
  onToggleFavorite: (plantId: string) => void;
}

const PaginatedPlantGrid: React.FC<PaginatedPlantGridProps> = ({ plants, onToggleFavorite }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(24); // 24 cards per page (4 cols x 6 rows)

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Get paginated plants
  const paginatedPlants = useMemo(() => {
    const startIndex = page * rowsPerPage;
    return plants.slice(startIndex, startIndex + rowsPerPage);
  }, [plants, page, rowsPerPage]);

  return (
    <Box>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {paginatedPlants.map((plant) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={FavoritesService.getPlantId(plant)}>
            <PlantCard plant={plant} onToggleFavorite={onToggleFavorite} />
          </Grid>
        ))}
      </Grid>
      
      <Paper sx={{ mt: 3 }}>
        <TablePagination
          component="div"
          count={plants.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[12, 24, 48, 96]}
          labelRowsPerPage="Cards per page:"
          sx={{
            borderTop: 1,
            borderColor: 'divider',
          }}
        />
      </Paper>
    </Box>
  );
};

export default React.memo(PaginatedPlantGrid);

