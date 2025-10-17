import React from 'react';
import { Container, Box, Typography, Card, CardContent, Grid, Divider, Link } from '@mui/material';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import LinkIcon from '@mui/icons-material/Link';
import InfoIcon from '@mui/icons-material/Info';

const ResourcesPage: React.FC = () => {
  const externalResources = [
    {
      title: 'USDA PLANTS Database',
      description: 'Comprehensive database of plants native to the United States',
      url: 'https://plants.usda.gov/',
    },
    {
      title: 'Missouri Botanical Garden',
      description: 'Plant research and botanical information',
      url: 'https://www.missouribotanicalgarden.org/',
    },
    {
      title: 'Royal Horticultural Society',
      description: 'Plant finder and growing guides',
      url: 'https://www.rhs.org.uk/plants',
    },
    {
      title: 'Wikimedia Commons',
      description: 'Free plant images and botanical illustrations',
      url: 'https://commons.wikimedia.org/',
    },
  ];

  const plantingGuides = [
    {
      title: 'Seed Stratification',
      description: 'Understanding cold and warm stratification requirements for successful germination.',
    },
    {
      title: 'Hardiness Zones',
      description: 'Learn about USDA hardiness zones and how to choose plants for your climate.',
    },
    {
      title: 'Native Plants',
      description: 'Benefits of growing native plants and finding species native to your region.',
    },
    {
      title: 'Seed Storage',
      description: 'Proper techniques for storing seeds to maintain viability over time.',
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Box sx={{ mb: 6, textAlign: 'center' }}>
        <MenuBookIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
        <Typography variant="h3" component="h1" gutterBottom fontWeight={600}>
          Resources
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
          Helpful guides, references, and external links for plant enthusiasts and gardeners
        </Typography>
      </Box>

      {/* Growing Guides Section */}
      <Box sx={{ mb: 6 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
          <InfoIcon color="primary" />
          <Typography variant="h4" fontWeight={600}>
            Growing Guides
          </Typography>
        </Box>
        <Grid container spacing={3}>
          {plantingGuides.map((guide, index) => (
            <Grid item xs={12} sm={6} key={index}>
              <Card
                sx={{
                  height: '100%',
                  transition: 'all 0.3s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4,
                  },
                }}
              >
                <CardContent>
                  <Typography variant="h6" gutterBottom fontWeight={600} color="primary.main">
                    {guide.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {guide.description}
                  </Typography>
                  <Typography variant="body2" color="text.disabled" sx={{ mt: 2, fontStyle: 'italic' }}>
                    Coming soon...
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Divider sx={{ my: 6 }} />

      {/* External Resources Section */}
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
          <LinkIcon color="primary" />
          <Typography variant="h4" fontWeight={600}>
            External Resources
          </Typography>
        </Box>
        <Grid container spacing={3}>
          {externalResources.map((resource, index) => (
            <Grid item xs={12} sm={6} key={index}>
              <Card
                sx={{
                  height: '100%',
                  transition: 'all 0.3s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4,
                  },
                }}
              >
                <CardContent>
                  <Typography variant="h6" gutterBottom fontWeight={600}>
                    <Link
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      color="primary.main"
                      underline="hover"
                    >
                      {resource.title}
                    </Link>
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {resource.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* About Data Section */}
      <Box sx={{ mt: 6 }}>
        <Card sx={{ backgroundColor: 'rgba(61, 107, 31, 0.04)' }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h5" gutterBottom fontWeight={600}>
              About Our Data
            </Typography>
            <Typography variant="body1" paragraph>
              The Seedr plant database contains information sourced from reputable botanical databases
              and seed catalogs. Plant images are sourced from Wikimedia Commons, iNaturalist, GBIF,
              and other public domain repositories under various Creative Commons licenses.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              All plant data is provided for informational and educational purposes. Please verify
              growing requirements with local experts and seed suppliers before planting.
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default ResourcesPage;

