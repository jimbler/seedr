import React from 'react';
import { Container, Box, Typography, Button, Grid, Card, CardContent, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import LocalFloristIcon from '@mui/icons-material/LocalFlorist';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <SearchIcon sx={{ fontSize: 48 }} />,
      title: 'Search & Filter',
      description: 'Easily find plants by name, family, hardiness zone, and more with powerful filtering options.',
    },
    {
      icon: <FavoriteIcon sx={{ fontSize: 48 }} />,
      title: 'Favorites System',
      description: 'Save your favorite plants for quick access and build your personal collection.',
    },
    {
      icon: <ViewModuleIcon sx={{ fontSize: 48 }} />,
      title: 'Multiple Views',
      description: 'Switch between card and table views to browse plants in your preferred format.',
    },
    {
      icon: <LocalFloristIcon sx={{ fontSize: 48 }} />,
      title: '2,200+ Plants',
      description: 'Comprehensive database with detailed information about seeds, growing conditions, and origins.',
    },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #3d6b1f 0%, #2d5016 100%)',
          color: 'white',
          py: 10,
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Box
            component="img"
            src="/assets/seedr_logo_only.png"
            alt="Seedr Logo"
            sx={{
              height: 120,
              mb: 3,
              filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2))',
            }}
          />
          <Typography variant="h2" component="h1" gutterBottom fontWeight={700}>
            Welcome to Seedr
          </Typography>
          <Typography variant="h5" sx={{ mb: 4, opacity: 0.95 }}>
            Your comprehensive plant seed database for exploration and discovery
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/database')}
            sx={{
              backgroundColor: 'white',
              color: 'primary.main',
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
              fontWeight: 600,
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                transform: 'translateY(-2px)',
              },
              transition: 'all 0.3s',
            }}
          >
            Explore Database
          </Button>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h3" align="center" gutterBottom fontWeight={600} sx={{ mb: 6 }}>
          Features
        </Typography>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  height: '100%',
                  textAlign: 'center',
                  transition: 'all 0.3s',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: 6,
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ color: 'primary.main', mb: 2 }}>{feature.icon}</Box>
                  <Typography variant="h6" gutterBottom fontWeight={600}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* About Section */}
      <Box sx={{ backgroundColor: 'background.default', py: 8 }}>
        <Container maxWidth="md">
          <Paper elevation={0} sx={{ p: 4, backgroundColor: 'white' }}>
            <Typography variant="h4" gutterBottom fontWeight={600} align="center" sx={{ mb: 3 }}>
              About Seedr
            </Typography>
            <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
              Seedr is a comprehensive plant seed database designed for gardeners, botanists, and plant enthusiasts.
              Our collection includes over 2,200 plant species with detailed information about growing conditions,
              hardiness zones, germination requirements, and seed origins.
            </Typography>
            <Typography variant="body1" paragraph sx={{ lineHeight: 1.8 }}>
              Whether you're planning your next garden, researching native plants, or building a seed collection,
              Seedr provides the tools and information you need to make informed decisions about plant cultivation.
            </Typography>
            <Box sx={{ textAlign: 'center', mt: 4 }}>
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate('/database')}
                sx={{ mr: 2 }}
              >
                Browse Database
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate('/resources')}
              >
                View Resources
              </Button>
            </Box>
          </Paper>
        </Container>
      </Box>

      {/* Statistics Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                textAlign: 'center',
                backgroundColor: 'rgba(61, 107, 31, 0.08)',
              }}
            >
              <Typography variant="h3" fontWeight={700} color="primary.main">
                2,200+
              </Typography>
              <Typography variant="h6" color="text.secondary">
                Plant Species
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                textAlign: 'center',
                backgroundColor: 'rgba(232, 220, 196, 0.5)',
              }}
            >
              <Typography variant="h3" fontWeight={700} color="primary.main">
                70%+
              </Typography>
              <Typography variant="h6" color="text.secondary">
                With Photos
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                textAlign: 'center',
                backgroundColor: 'rgba(78, 130, 36, 0.12)',
              }}
            >
              <Typography variant="h3" fontWeight={700} color="primary.main">
                150+
              </Typography>
              <Typography variant="h6" color="text.secondary">
                Plant Families
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default HomePage;

