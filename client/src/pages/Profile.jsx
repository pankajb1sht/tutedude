import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Avatar,
  Button,
  Grid,
  Card,
  CardContent,
  Divider,
  CircularProgress,
} from '@mui/material';
import { getUserProfile } from '../store/slices/userSlice';
import {
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  removeFriend,
} from '../store/slices/friendSlice';

const Profile = () => {
  const { userId } = useParams();
  const dispatch = useDispatch();
  const { currentProfile, loading } = useSelector((state) => state.users);
  const { user: currentUser } = useSelector((state) => state.auth);
  const { friends, friendRequests } = useSelector((state) => state.friend);

  useEffect(() => {
    if (userId) {
      dispatch(getUserProfile(userId));
    }
  }, [dispatch, userId]);

  const isCurrentUser = currentUser?._id === userId;
  const isFriend = friends.some((friend) => friend._id === userId);
  const pendingRequest = friendRequests.find(
    (request) => request.from._id === userId
  );

  const handleFriendAction = () => {
    if (pendingRequest) {
      dispatch(acceptFriendRequest(pendingRequest._id));
    } else if (!isFriend) {
      dispatch(sendFriendRequest(userId));
    } else {
      dispatch(removeFriend(userId));
    }
  };

  if (loading || !currentProfile) {
    return (
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '50vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', maxWidth: '100%' }}>
      {/* Profile Header */}
      <Card sx={{ width: '100%', mb: 4 }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', flexWrap: 'wrap', gap: 3 }}>
            <Avatar
              sx={{
                width: 120,
                height: 120,
                fontSize: '3rem',
                bgcolor: 'secondary.main',
              }}
            >
              {currentProfile.username.charAt(0).toUpperCase()}
            </Avatar>
            <Box sx={{ flex: 1, minWidth: 200 }}>
              <Typography variant="h4" gutterBottom>
                {currentProfile.username}
              </Typography>
              <Typography variant="body1" color="text.secondary" gutterBottom>
                {currentProfile.email}
              </Typography>
              {!isCurrentUser && (
                <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                  <Button
                    variant={isFriend ? "outlined" : "contained"}
                    color={isFriend ? "error" : "primary"}
                    onClick={handleFriendAction}
                    size="large"
                  >
                    {isFriend
                      ? 'Remove Friend'
                      : pendingRequest
                      ? 'Accept Request'
                      : 'Add Friend'}
                  </Button>
                  {pendingRequest && (
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => dispatch(rejectFriendRequest(pendingRequest._id))}
                      size="large"
                    >
                      Reject Request
                    </Button>
                  )}
                </Box>
              )}
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Divider sx={{ my: 4 }} />

      {/* Friends Section */}
      <Box sx={{ width: '100%' }}>
        <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
          Friends ({currentProfile.friends?.length || 0})
        </Typography>
        <Grid container spacing={3}>
          {currentProfile.friends?.map((friend) => (
            <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={friend._id}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ width: 50, height: 50, bgcolor: 'secondary.main' }}>
                      {friend.username.charAt(0).toUpperCase()}
                    </Avatar>
                    <Box>
                      <Typography variant="h6">{friend.username}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {friend.email}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        {(!currentProfile.friends || currentProfile.friends.length === 0) && (
          <Box 
            sx={{ 
              py: 6,
              textAlign: 'center',
              backgroundColor: 'background.paper',
              borderRadius: 2,
              width: '100%',
            }}
          >
            <Typography variant="body1" color="text.secondary">
              No friends yet
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Profile; 