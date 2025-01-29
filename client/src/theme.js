import { createTheme } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2c3e50', // Dark blue-gray
      light: '#34495e',
      dark: '#1a252f',
    },
    secondary: {
      main: '#e74c3c', // Coral red
      light: '#ff6b6b',
      dark: '#c0392b',
    },
    background: {
      default: '#f5f6fa',
      paper: '#ffffff',
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: '8px',
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          backgroundColor: '#2c3e50',
        },
      },
    },
  },
  shape: {
    borderRadius: 8,
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
});

export default theme; 