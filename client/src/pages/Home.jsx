import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Typography,
  TextField,
  Card,
  CardContent,
  CardActions,
  Button,
  Avatar,
  InputAdornment,
  IconButton,
  Divider,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { searchUsers, getRecommendations, clearSearchResults } from '../store/slices/userSlice';
import { sendFriendRequest } from '../store/slices/friendSlice';
import debounce from 'lodash/debounce';

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState('');
  const { searchResults, recommendations, loading, error } = useSelector((state) => state.users);
  const { friends } = useSelector((state) => state.friend);

  useEffect(() => {
    dispatch(getRecommendations());
  }, [dispatch]);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((query) => {
      if (query.trim()) {
        dispatch(searchUsers(query));
      } else {
        dispatch(clearSearchResults());
      }
    }, 300),
    [dispatch]
  );

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    debouncedSearch(query);
  };

  const handleSendFriendRequest = (userId) => {
    dispatch(sendFriendRequest(userId));
  };

  const isAlreadyFriend = (userId) => {
    return friends.some((friend) => friend._id === userId);
  };

  const UserCard = ({ user, showMutualFriends = false }) => (
    <Card sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 2 }}>
      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar 
            sx={{ 
              width: 64, 
              height: 64, 
              mr: 2, 
              bgcolor: 'secondary.main',
              fontSize: '1.5rem',
              fontWeight: 600,
            }}
          >
            {user.username.charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              {user.username}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {user.email}
            </Typography>
            {showMutualFriends && user.mutualFriendsCount > 0 && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {user.mutualFriendsCount} mutual friend
                {user.mutualFriendsCount !== 1 ? 's' : ''}
              </Typography>
            )}
          </Box>
        </Box>
      </CardContent>
      <CardActions sx={{ p: 2, pt: 0, gap: 1 }}>
        <Button
          variant="outlined"
          size="medium"
          onClick={() => navigate(`/profile/${user._id}`)}
          sx={{ width: 'auto' }}
        >
          View Profile
        </Button>
        {!isAlreadyFriend(user._id) && (
          <Button
            variant="contained"
            size="medium"
            onClick={() => handleSendFriendRequest(user._id)}
            sx={{ width: 'auto' }}
          >
            Add Friend
          </Button>
        )}
      </CardActions>
    </Card>
  );

  return (
    <Box sx={{ width: '100%', height: '100%', p: { xs: 2, sm: 3 } }}>

      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
          Find Friends
        </Typography>
        <Box sx={{ maxWidth: '100%', mx: 'auto' }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search users by username or email"
            value={searchQuery}
            onChange={handleSearchChange}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                backgroundColor: 'background.paper',
              },
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  {loading ? (
                    <CircularProgress size={24} />
                  ) : (
                    <IconButton edge="end">
                      <SearchIcon />
                    </IconButton>
                  )}
                </InputAdornment>
              ),
            }}
          />
        </Box>
      </Box>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
            Search Results
          </Typography>
          <Grid container spacing={2}>
            {searchResults.map((user) => (
              <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={user._id}>
                <UserCard user={user} />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {searchQuery.trim() === '' && (
        <>
          <Divider sx={{ my: 4 }} />

          {/* Recommendations Section */}
          <Box>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
              Recommended Friends
            </Typography>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
              </Box>
            ) : recommendations.length > 0 ? (
              <Grid container spacing={2}>
                {recommendations.map((user) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={user._id}>
                    <UserCard user={user} showMutualFriends />
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Box 
                sx={{ 
                  py: 6,
                  textAlign: 'center',
                  backgroundColor: 'background.paper',
                  borderRadius: 2,
                }}
              >
                <Typography variant="body1" color="text.secondary">
                  No recommendations available at the moment
                </Typography>
              </Box>
            )}
          </Box>
        </>
      )}
    </Box>
  );
};

export default Home;
