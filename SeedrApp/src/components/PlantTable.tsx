import React, { useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Collapse,
  Box,
  Typography,
  TableSortLabel,
  Avatar,
  TablePagination,
  Link,
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { formatSeasonality, formatZone, formatPreTreatment, formatGermination, formatFamily, shouldDisplayOrigin } from '../services/plantService';
import { FavoritesService } from '../services/favoritesService';
import { Plant, ExternalCatalog } from '../types/Plant';
import PlantImage from './PlantImage';

interface PlantTableProps {
  plants: Plant[];
  onToggleFavorite: (plantId: string) => void;
}

type SortField = keyof Plant;
type SortOrder = 'asc' | 'desc';

interface RowProps {
  plant: Plant;
  onToggleFavorite: (plantId: string) => void;
}

const Row: React.FC<RowProps> = React.memo(({ plant, onToggleFavorite }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const plantId = FavoritesService.getPlantId(plant);

  return (
    <>
      <TableRow hover>
        <TableCell padding="checkbox">
          <IconButton
            size="small"
            onClick={() => setIsExpanded(!isExpanded)}
            aria-label="expand row"
          >
            {isExpanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell padding="checkbox">
          <Avatar
            variant="rounded"
            sx={{ width: 40, height: 40 }}
            src={plant.thumbnailUrl}
            alt={plant.BotanicalName}
          >
            {plant.BotanicalName.charAt(0)}
          </Avatar>
        </TableCell>
        <TableCell>
          <Typography variant="body2" fontWeight={500} sx={{ fontStyle: 'italic' }}>
            {plant.BotanicalName}
          </Typography>
        </TableCell>
        <TableCell>
          {plant.CommonName && plant.CommonName.trim() !== '' ? (
            <Typography variant="body2">{plant.CommonName}</Typography>
          ) : (
            <Typography variant="body2" color="text.disabled" sx={{ fontStyle: 'italic' }}>
              No common name
            </Typography>
          )}
        </TableCell>
        <TableCell>
          <Typography variant="body2">{formatFamily(plant.Family)}</Typography>
        </TableCell>
        <TableCell align="center">
          <Typography variant="body2">{formatZone(plant.Zone)}</Typography>
        </TableCell>
        <TableCell>
          <Typography variant="body2">{formatSeasonality(plant.Seasonality)}</Typography>
        </TableCell>
        <TableCell align="right">
          <Typography variant="body2" fontWeight={500} color="success.main">
            ${plant.Price.toFixed(2)}
          </Typography>
        </TableCell>
        <TableCell>
          <Chip
            label={plant.IsArchived ? 'Archived' : 'Active'}
            size="small"
            color={plant.IsArchived ? 'warning' : 'success'}
          />
        </TableCell>
        <TableCell padding="checkbox">
          <IconButton
            size="small"
            onClick={() => onToggleFavorite(plantId)}
            title={plant.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            {plant.isFavorite ? (
              <StarIcon sx={{ color: 'warning.main' }} />
            ) : (
              <StarBorderIcon />
            )}
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={10}>
          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            <Box sx={{ py: 3, px: 2, backgroundColor: 'rgba(61, 107, 31, 0.02)' }}>
              <Box sx={{ display: 'flex', gap: 3, mb: 2 }}>
                <Box sx={{ width: 150, flexShrink: 0 }}>
                  <PlantImage plant={plant} useThumbnail={false} />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle2" fontWeight={600} gutterBottom color="primary">
                    Plant Details
                  </Typography>
                  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 1.5 }}>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Plant Code:
                      </Typography>
                      <Typography variant="body2">{plant.externalPlantCode}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Size:
                      </Typography>
                      <Typography variant="body2">{plant.Size || 'N/A'}</Typography>
                    </Box>
                    {plant.Origin && shouldDisplayOrigin(plant.Origin) && (
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Origin:
                        </Typography>
                        <Typography variant="body2">{plant.Origin}</Typography>
                      </Box>
                    )}
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Elevation:
                      </Typography>
                      <Typography variant="body2">
                        {plant.Elevation} ft / {plant.ElevationMeters} m
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Quantity:
                      </Typography>
                      <Typography variant="body2">{plant.Quantity}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Wild Origin:
                      </Typography>
                      <Typography variant="body2">{plant.WildOrigin ? 'Yes' : 'No'}</Typography>
                    </Box>
                    {plant.ExternalCatalog === ExternalCatalog.AlPlains && (
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Catalog:
                        </Typography>
                        <Link
                          href="https://www.alplains.com"
                          target="_blank"
                          rel="noopener noreferrer"
                          sx={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 0.5,
                            textDecoration: 'none',
                            '&:hover': {
                              textDecoration: 'underline',
                            },
                          }}
                        >
                          <Typography variant="body2" color="primary">
                            AlPlains
                          </Typography>
                          <OpenInNewIcon sx={{ fontSize: 14 }} />
                        </Link>
                      </Box>
                    )}
                  </Box>

                  <Typography variant="subtitle2" fontWeight={600} gutterBottom color="primary" sx={{ mt: 2 }}>
                    Growing Information
                  </Typography>
                  <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 1.5 }}>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Pre-Treatment:
                      </Typography>
                      <Typography variant="body2">{formatPreTreatment(plant.PreTreatment)}</Typography>
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Germination:
                      </Typography>
                      <Typography variant="body2">{formatGermination(plant.Germination)}</Typography>
                    </Box>
                  </Box>

                  {plant.Description && (
                    <>
                      <Typography variant="subtitle2" fontWeight={600} gutterBottom color="primary" sx={{ mt: 2 }}>
                        Description
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                        {plant.Description}
                      </Typography>
                    </>
                  )}

                  {plant.imageSource && (
                    <>
                      <Typography variant="subtitle2" fontWeight={600} gutterBottom color="primary" sx={{ mt: 2 }}>
                        Image Attribution
                      </Typography>
                      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 1 }}>
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            Source:
                          </Typography>
                          <Typography variant="body2">{plant.imageSource}</Typography>
                        </Box>
                        {plant.imageLicense && (
                          <Box>
                            <Typography variant="caption" color="text.secondary">
                              License:
                            </Typography>
                            <Typography variant="body2">{plant.imageLicense}</Typography>
                          </Box>
                        )}
                      </Box>
                    </>
                  )}
                </Box>
              </Box>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
});

const PlantTable: React.FC<PlantTableProps> = React.memo(({ plants, onToggleFavorite }) => {
  const [sortBy, setSortBy] = useState<SortField>('BotanicalName');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(50);

  const handleSortChange = (newSortBy: SortField) => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortOrder('asc');
    }
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const sortedPlants = useMemo(() => {
    return [...plants].sort((a, b) => {
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
  }, [plants, sortBy, sortOrder]);

  // Get paginated plants
  const paginatedPlants = useMemo(() => {
    const startIndex = page * rowsPerPage;
    return sortedPlants.slice(startIndex, startIndex + rowsPerPage);
  }, [sortedPlants, page, rowsPerPage]);

  if (plants.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h5" color="text.secondary" gutterBottom>
          No plants found
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Try adjusting your filters to see more results.
        </Typography>
      </Box>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell padding="checkbox" />
            <TableCell padding="checkbox" />
            <TableCell>
              <TableSortLabel
                active={sortBy === 'BotanicalName'}
                direction={sortBy === 'BotanicalName' ? sortOrder : 'asc'}
                onClick={() => handleSortChange('BotanicalName')}
              >
                Botanical Name
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={sortBy === 'CommonName'}
                direction={sortBy === 'CommonName' ? sortOrder : 'asc'}
                onClick={() => handleSortChange('CommonName')}
              >
                Common Name
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={sortBy === 'Family'}
                direction={sortBy === 'Family' ? sortOrder : 'asc'}
                onClick={() => handleSortChange('Family')}
              >
                Family
              </TableSortLabel>
            </TableCell>
            <TableCell align="center">
              <TableSortLabel
                active={sortBy === 'Zone'}
                direction={sortBy === 'Zone' ? sortOrder : 'asc'}
                onClick={() => handleSortChange('Zone')}
              >
                Zone
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={sortBy === 'Seasonality'}
                direction={sortBy === 'Seasonality' ? sortOrder : 'asc'}
                onClick={() => handleSortChange('Seasonality')}
              >
                Type
              </TableSortLabel>
            </TableCell>
            <TableCell align="right">
              <TableSortLabel
                active={sortBy === 'Price'}
                direction={sortBy === 'Price' ? sortOrder : 'asc'}
                onClick={() => handleSortChange('Price')}
              >
                Price
              </TableSortLabel>
            </TableCell>
            <TableCell>Status</TableCell>
            <TableCell padding="checkbox">Favorite</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {paginatedPlants.map((plant) => (
            <Row
              key={FavoritesService.getPlantId(plant)}
              plant={plant}
              onToggleFavorite={onToggleFavorite}
            />
          ))}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[25, 50, 100]}
        component="div"
        count={sortedPlants.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{
          borderTop: 1,
          borderColor: 'divider',
        }}
      />
    </TableContainer>
  );
});

export default PlantTable;
