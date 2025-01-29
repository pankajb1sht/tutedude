import { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Avatar,
  Tooltip,
  MenuItem,
  Badge,
  Button,
} from '@mui/material';
import { Notifications as NotificationsIcon } from '@mui/icons-material';
import { logout } from '../store/slices/authSlice';

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { friendRequests } = useSelector((state) => state.friend);
  
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [anchorElNotifications, setAnchorElNotifications] = useState(null);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleOpenNotifications = (event) => {
    setAnchorElNotifications(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleCloseNotifications = () => {
    setAnchorElNotifications(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      minHeight: '100vh', 
      width: '100vw',
      maxWidth: '100%',
      overflow: 'hidden',
      bgcolor: 'background.default' 
    }}>
      <AppBar position="sticky" elevation={0} sx={{ width: '100%' }}>
        <Box sx={{ width: '100%', px: { xs: 2, sm: 3 } }}>
          <Toolbar disableGutters sx={{ minHeight: 64 }}>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ 
                flexGrow: 0, 
                cursor: 'pointer', 
                mr: 4,
                fontSize: '1.5rem',
                fontWeight: 600,
              }}
              onClick={() => navigate('/')}
            >
              Friend Management
            </Typography>

            {/* Navigation Links */}
            <Box sx={{ flexGrow: 1, display: 'flex', gap: 1 }}>
              <Button
                color="inherit"
                component={Link}
                to="/"
                sx={{
                  px: 2,
                  py: 1,
                  borderRadius: 2,
                  backgroundColor: isActive('/') ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  },
                }}
              >
                Home
              </Button>
              <Button
                color="inherit"
                component={Link}
                to="/users"
                sx={{
                  px: 2,
                  py: 1,
                  borderRadius: 2,
                  backgroundColor: isActive('/users') ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  },
                }}
              >
                All Users
              </Button>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton
                size="large"
                color="inherit"
                onClick={handleOpenNotifications}
                sx={{
                  backgroundColor: Boolean(anchorElNotifications) ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  },
                }}
              >
                <Badge 
                  badgeContent={friendRequests.length} 
                  color="secondary"
                  sx={{
                    '& .MuiBadge-badge': {
                      backgroundColor: '#e74c3c',
                    },
                  }}
                >
                  <NotificationsIcon />
                </Badge>
              </IconButton>

              <Tooltip title="Account settings">
                <IconButton 
                  onClick={handleOpenUserMenu} 
                  sx={{ 
                    p: 0.5,
                    border: '2px solid transparent',
                    '&:hover': {
                      border: '2px solid rgba(255, 255, 255, 0.2)',
                    },
                  }}
                >
                  <Avatar 
                    alt={user?.username}
                    sx={{ 
                      width: 40, 
                      height: 40,
                      bgcolor: 'secondary.main',
                      fontWeight: 600,
                    }}
                  >
                    {user?.username?.charAt(0).toUpperCase()}
                  </Avatar>
                </IconButton>
              </Tooltip>
            </Box>

            {/* Notifications Menu */}
            <Menu
              anchorEl={anchorElNotifications}
              open={Boolean(anchorElNotifications)}
              onClose={handleCloseNotifications}
              onClick={handleCloseNotifications}
              PaperProps={{
                sx: {
                  mt: 1.5,
                  width: 320,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                },
              }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              {friendRequests.length === 0 ? (
                <MenuItem sx={{ py: 2 }}>
                  <Typography variant="body1" color="text.secondary" align="center" sx={{ width: '100%' }}>
                    No new notifications
                  </Typography>
                </MenuItem>
              ) : (
                friendRequests.map((request) => (
                  <MenuItem
                    key={request._id}
                    onClick={() => navigate(`/profile/${request.from._id}`)}
                    sx={{ 
                      py: 2,
                      '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.04)',
                      },
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ bgcolor: 'secondary.main' }}>
                        {request.from.username.charAt(0).toUpperCase()}
                      </Avatar>
                      <Typography variant="body1">
                        Friend request from <strong>{request.from.username}</strong>
                      </Typography>
                    </Box>
                  </MenuItem>
                ))
              )}
            </Menu>

            {/* User Menu */}
            <Menu
              anchorEl={anchorElUser}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
              onClick={handleCloseUserMenu}
              PaperProps={{
                sx: {
                  mt: 1.5,
                  minWidth: 180,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                },
              }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <MenuItem 
                onClick={() => navigate(`/profile/${user?._id}`)}
                sx={{ py: 1.5 }}
              >
                <Typography>Profile</Typography>
              </MenuItem>
              <MenuItem 
                onClick={handleLogout}
                sx={{ py: 1.5, color: 'error.main' }}
              >
                <Typography>Logout</Typography>
              </MenuItem>
            </Menu>
          </Toolbar>
        </Box>
      </AppBar>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: '100%',
          maxWidth: '100%',
          p: { xs: 2, sm: 3 },
          overflow: 'auto',
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Layout; 