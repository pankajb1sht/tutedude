import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Avatar,
  CircularProgress,
  Alert,
} from '@mui/material';
import { getAllUsers } from '../store/slices/userSlice';
import { sendFriendRequest } from '../store/slices/friendSlice';
import InfiniteScroll from 'react-infinite-scroll-component';

const Users = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { allUsers, pagination, loading, error } = useSelector((state) => state.users);
  const { friends } = useSelector((state) => state.friend);

  useEffect(() => {
    dispatch(getAllUsers({ page: 1, limit: 20 }));
  }, [dispatch]);

  const loadMore = useCallback(() => {
    if (pagination.hasMore && !loading) {
      dispatch(getAllUsers({ page: pagination.page + 1, limit: 20 }));
    }
  }, [dispatch, pagination.hasMore, pagination.page, loading]);

  const handleSendFriendRequest = (userId) => {
    dispatch(sendFriendRequest(userId));
  };

  const isAlreadyFriend = (userId) => {
    return friends.some((friend) => friend._id === userId);
  };

  const UserCard = ({ user }) => (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        borderRadius: 2,
      }}
    >
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
          </Box>
        </Box>
      </CardContent>
      <CardActions sx={{ p: 2, pt: 0, gap: 1 }}>
        <Button
          variant="outlined"
          size="medium"
          onClick={() => navigate(`/profile/${user._id}`)}
          fullWidth
        >
          View Profile
        </Button>
        {!isAlreadyFriend(user._id) && (
          <Button
            variant="contained"
            size="medium"
            onClick={() => handleSendFriendRequest(user._id)}
            fullWidth
          >
            Add Friend
          </Button>
        )}
      </CardActions>
    </Card>
  );

  return (
    <Box sx={{ width: '100%', p: { xs: 2, sm: 3 } }}>
      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
          All Users
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {pagination.total} users found
        </Typography>
      </Box>

      <InfiniteScroll
        dataLength={allUsers.length}
        next={loadMore}
        hasMore={pagination.hasMore}
        loader={
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        }
        endMessage={
          <Typography 
            variant="body1" 
            color="text.secondary" 
            align="center"
            sx={{ my: 4 }}
          >
            No more users to show
          </Typography>
        }
      >
        <Grid container spacing={3}>
          {allUsers.map((user) => (
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={user._id}>
              <UserCard user={user} />
            </Grid>
          ))}
        </Grid>
      </InfiniteScroll>

      {loading && allUsers.length === 0 && (
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: 400,
          }}
        >
          <CircularProgress />
        </Box>
      )}
    </Box>
  );
};

export default Users; 