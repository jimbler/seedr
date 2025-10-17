import { createTheme } from '@mui/material/styles';

// Nature-inspired theme for Seedr - Plant Seed Database
// Color palette: Forest Green, Light Tan, Charcoal Gray
export const seedrTheme = createTheme({
  palette: {
    primary: {
      main: '#3d6b1f',       // Forest Green
      dark: '#2d5016',       // Darker Forest Green
      light: '#4e8224',      // Lighter Forest Green
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#e8dcc4',       // Light Tan
      light: '#f5f0e0',      // Lighter Tan
      dark: '#d4c5a0',       // Darker Tan
      contrastText: '#3a3a3a',
    },
    background: {
      default: '#f5f0e0',    // Light Tan background
      paper: '#ffffff',      // White for cards/papers
    },
    text: {
      primary: '#3a3a3a',    // Charcoal Gray
      secondary: '#5a5a5a',  // Lighter Charcoal
    },
    success: {
      main: '#4e8224',       // Green for active status
      light: '#6ba832',
      dark: '#3d6b1f',
    },
    warning: {
      main: '#d4a543',       // Amber for archived status
      light: '#e0b85e',
      dark: '#b88f32',
    },
    error: {
      main: '#c44536',
      light: '#d16155',
      dark: '#a33628',
    },
    info: {
      main: '#5a8a9f',
      light: '#7ba3b5',
      dark: '#456c7e',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica Neue", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
      letterSpacing: '-0.02em',
      color: '#ffffff',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
    },
    h6: {
      fontSize: '1.1rem',
      fontWeight: 600,
    },
    subtitle1: {
      fontSize: '1rem',
      fontWeight: 500,
      lineHeight: 1.75,
    },
    subtitle2: {
      fontSize: '0.875rem',
      fontWeight: 500,
      lineHeight: 1.57,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
    caption: {
      fontSize: '0.75rem',
      lineHeight: 1.66,
    },
  },
  shape: {
    borderRadius: 8,
  },
  spacing: 8,
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
          transition: 'box-shadow 0.3s ease-in-out, transform 0.2s ease-in-out',
          '&:hover': {
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.12)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 16px',
          fontWeight: 500,
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
          borderRadius: 6,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
        elevation1: {
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
        },
        elevation2: {
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          borderRadius: 0,
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
        },
        head: {
          fontWeight: 600,
          backgroundColor: '#f5f0e0',
        },
      },
    },
  },
});

