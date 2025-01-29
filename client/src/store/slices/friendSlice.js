import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

// Async thunks
export const sendFriendRequest = createAsyncThunk(
  'friend/sendRequest',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.post('/friends/request', { userId });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const acceptFriendRequest = createAsyncThunk(
  'friend/acceptRequest',
  async (requestId, { rejectWithValue }) => {
    try {
      const response = await api.put('/friends/accept', { requestId });
      return { ...response.data, requestId };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const rejectFriendRequest = createAsyncThunk(
  'friend/rejectRequest',
  async (requestId, { rejectWithValue, getState }) => {
    try {
      const { auth: { token } } = getState();
      const response = await api.put('/friends/reject',
        { requestId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return { ...response.data, requestId };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const removeFriend = createAsyncThunk(
  'friend/remove',
  async (friendId, { rejectWithValue, getState }) => {
    try {
      const { auth: { token } } = getState();
      const response = await api.delete(`/friends/${friendId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return { ...response.data, friendId };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getFriendRequests = createAsyncThunk(
  'friend/getRequests',
  async (_, { rejectWithValue, getState }) => {
    try {
      const { auth: { token } } = getState();
      const response = await api.get('/friends/requests', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const getFriendsList = createAsyncThunk(
  'friend/getList',
  async (_, { rejectWithValue, getState }) => {
    try {
      const { auth: { token } } = getState();
      const response = await api.get('/friends/list', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  friends: [],
  friendRequests: [],
  loading: false,
  error: null,
  successMessage: null,
};

const friendSlice = createSlice({
  name: 'friend',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccessMessage: (state) => {
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Send Friend Request
      .addCase(sendFriendRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendFriendRequest.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(sendFriendRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to send friend request';
      })
      // Accept Friend Request
      .addCase(acceptFriendRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(acceptFriendRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.friendRequests = state.friendRequests.filter(
          (request) => request.id !== action.payload.requestId
        );
        if (action.payload.friend) {
          state.friends.push(action.payload.friend);
        }
      })
      .addCase(acceptFriendRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to accept friend request';
      })
      // Reject Friend Request
      .addCase(rejectFriendRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(rejectFriendRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.friendRequests = state.friendRequests.filter(
          request => request._id !== action.payload.requestId
        );
        state.successMessage = 'Friend request rejected';
      })
      .addCase(rejectFriendRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to reject friend request';
      })
      // Remove Friend
      .addCase(removeFriend.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFriend.fulfilled, (state, action) => {
        state.loading = false;
        state.friends = state.friends.filter(
          friend => friend._id !== action.payload.friendId
        );
        state.successMessage = 'Friend removed successfully';
      })
      .addCase(removeFriend.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to remove friend';
      })
      // Get Friend Requests
      .addCase(getFriendRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFriendRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.friendRequests = action.payload;
      })
      .addCase(getFriendRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to get friend requests';
      })
      // Get Friends List
      .addCase(getFriendsList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFriendsList.fulfilled, (state, action) => {
        state.loading = false;
        state.friends = action.payload;
      })
      .addCase(getFriendsList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to get friends list';
      });
  },
});

export const { clearError, clearSuccessMessage } = friendSlice.actions;
export default friendSlice.reducer; 