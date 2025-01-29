import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

// Get all users
export const getAllUsers = createAsyncThunk('users/getAll', async ({ page, limit }) => {
  try {
    const res = await api.get(`/users/all?page=${page}&limit=${limit}`);
    return res.data;
  } catch (error) {
    throw error.response.data;
  }
});

// Search users
export const searchUsers = createAsyncThunk('users/search', async (query) => {
  try {
    const res = await api.get(`/users/search?query=${query}`);
    return res.data;
  } catch (error) {
    throw error.response.data;
  }
});

// Get recommendations
export const getRecommendations = createAsyncThunk('users/recommendations', async () => {
  try {
    const res = await api.get('/users/recommendations');
    return res.data;
  } catch (error) {
    throw error.response.data;
  }
});

// Get user profile
export const getUserProfile = createAsyncThunk('users/profile', async (userId) => {
  try {
    const res = await api.get(`/users/profile/${userId}`);
    return res.data;
  } catch (error) {
    throw error.response.data;
  }
});

const initialState = {
  allUsers: [],
  pagination: {
    total: 0,
    page: 1,
    pages: 1,
    hasMore: false
  },
  searchResults: [],
  recommendations: [],
  currentProfile: null,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearSearchResults: (state) => {
      state.searchResults = [];
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Get all users
    builder
      .addCase(getAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        if (action.meta.arg.page === 1) {
          state.allUsers = action.payload.users;
        } else {
          state.allUsers = [...state.allUsers, ...action.payload.users];
        }
        state.pagination = {
          total: action.payload.total,
          page: action.payload.page,
          pages: action.payload.pages,
          hasMore: action.payload.hasMore
        };
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Search users
      .addCase(searchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.searchResults = action.payload;
      })
      .addCase(searchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Get recommendations
      .addCase(getRecommendations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getRecommendations.fulfilled, (state, action) => {
        state.loading = false;
        state.recommendations = action.payload;
      })
      .addCase(getRecommendations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Get user profile
      .addCase(getUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProfile = action.payload;
      })
      .addCase(getUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearSearchResults, clearError } = userSlice.actions;
export default userSlice.reducer; 