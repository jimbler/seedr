import React from 'react';
import { Container, Box, Typography, Card, CardContent, Grid, Divider, Link } from '@mui/material';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import LinkIcon from '@mui/icons-material/Link';
import InfoIcon from '@mui/icons-material/Info';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

const ResourcesPage: React.FC = () => {
  const seedCatalogs = [
    {
      name: 'AlPlains',
      description: 'Premier source for rare and native plant seeds from the Rocky Mountain region and beyond.',
      url: 'https://www.alplains.com',
      isPrimary: false,
      logo: '/assets/alplains_logo.jpg',
    },
    {
      name: 'Western Native Seed',
      description: 'Specializes in seeds native to the Rocky Mountains and western Great Plains, offering wildflowers, grasses, trees, shrubs, and wetland species.',
      url: 'https://www.westernnativeseed.com',
      isPrimary: false,
      logo: '/assets/western_native_seed_logo.gif',
    },
    {
      name: 'Applewood Seed Company',
      description: 'Regional native seed mixes for pollinator conservation, including mixtures for the High Plains and Southern Rocky Mountains.',
      url: 'https://www.applewoodseed.com',
      isPrimary: false,
      logo: '/assets/applewood_seed_co_logo.png',
    },
    {
      name: 'Wildland Seed Co',
      description: 'Rocky Mountain Wildflower Mix designed for elevations above 7,000 feet, ideal for high mountain environments and pollinator habitats.',
      url: 'https://www.wildlandseedco.com',
      isPrimary: false,
      logo: '/assets/wildland_seed_co_logo.avif',
    },
    {
      name: 'Colorado Seed LLC',
      description: 'Rocky Mountain Native Mix with cold and warm season native grasses, offering excellent cold and drought tolerance.',
      url: 'http://www.coloradoseedllc.com',
      isPrimary: false,
      logo: '/assets/colorado_seed_llc_logo.avif',
    },
    {
      name: 'Granite Seed',
      description: 'Wide range of native seeds and custom seed mixes for land restoration and reclamation projects throughout the Rocky Mountain region.',
      url: 'https://graniteseed.com',
      isPrimary: false,
      logo: '/assets/granite_seed_logo.svg',
    },
    {
      name: 'Prairie Moon Nursery',
      description: 'Extensive online catalog of native seeds and plants suitable for various regions, including the Rocky Mountains. Ships nationwide.',
      url: 'https://www.prairiemoon.com',
      isPrimary: false,
      logo: '/assets/prairie_moon_nursery_logo.png',
    },
  ];

  const externalResources = [
    {
      title: 'USDA PLANTS Database',
      description: 'Comprehensive database of plants native to the United States',
      url: 'https://plants.usda.gov/',
      logo: '/assets/usda_logo.png',
    },
    {
      title: 'Missouri Botanical Garden',
      description: 'Plant research and botanical information',
      url: 'https://www.missouribotanicalgarden.org/',
      logo: '/assets/missouri_botanical_logo.svg',
    },
    {
      title: 'Royal Horticultural Society',
      description: 'Plant finder and growing guides',
      url: 'https://www.rhs.org.uk/plants',
      logo: '/assets/rhs_logo.svg',
    },
    {
      title: 'Wikimedia Commons',
      description: 'Free plant images and botanical illustrations',
      url: 'https://commons.wikimedia.org/',
      logo: '/assets/wikimedia_commons_logo.svg',
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

      {/* Seed Catalogs Section */}
      <Box sx={{ mb: 6 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
          <ShoppingCartIcon color="primary" />
          <Typography variant="h4" fontWeight={600}>
            Seed Catalogs
          </Typography>
        </Box>
        <Grid container spacing={3}>
          {seedCatalogs.map((catalog, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Link
                href={catalog.url}
                target="_blank"
                rel="noopener noreferrer"
                underline="none"
                sx={{ display: 'block', height: '100%' }}
              >
                <Card
                  sx={{
                    height: '100%',
                    transition: 'all 0.3s',
                    cursor: 'pointer',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 6,
                    },
                  }}
                >
                  <CardContent>
                    {catalog.logo && (
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          mb: 2,
                          minHeight: 80,
                        }}
                      >
                        <Box
                          component="img"
                          src={catalog.logo}
                          alt={`${catalog.name} logo`}
                          sx={{
                            maxHeight: 80,
                            maxWidth: '100%',
                            objectFit: 'contain',
                            ...(catalog.name === 'Granite Seed' && {
                              backgroundColor: '#3d6b1f',
                              padding: '5px',
                            }),
                          }}
                        />
                      </Box>
                    )}
                    <Typography
                      variant="h6"
                      gutterBottom
                      fontWeight={600}
                      sx={{
                        ...(catalog.isPrimary && { 
                          fontFamily: 'Papyrus, fantasy',
                          fontSize: '1.5rem',
                        }),
                        color: 'primary.main',
                        mb: 2,
                      }}
                    >
                      {catalog.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {catalog.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Link>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Divider sx={{ my: 6 }} />

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
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Link
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                underline="none"
                sx={{ display: 'block', height: '100%' }}
              >
                <Card
                  sx={{
                    height: '100%',
                    transition: 'all 0.3s',
                    cursor: 'pointer',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 6,
                    },
                  }}
                >
                  <CardContent>
                    {resource.logo && (
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          mb: 2,
                          minHeight: 80,
                        }}
                      >
                        <Box
                          component="img"
                          src={resource.logo}
                          alt={`${resource.title} logo`}
                          sx={{
                            maxHeight: 80,
                            maxWidth: '100%',
                            objectFit: 'contain',
                          }}
                        />
                      </Box>
                    )}
                    <Typography
                      variant="h6"
                      gutterBottom
                      fontWeight={600}
                      sx={{
                        color: 'primary.main',
                        mb: 2,
                      }}
                    >
                      {resource.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {resource.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Link>
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

