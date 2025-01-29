import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

// Login
export const login = createAsyncThunk('auth/login', async (data) => {
  try {
    const res = await api.post('/auth/login', data);
    localStorage.setItem('token', res.data.token);
    return res.data;
  } catch (error) {
    throw error.response.data;
  }
});

// Register
export const register = createAsyncThunk('auth/register', async (data) => {
  try {
    const res = await api.post('/auth/register', data);
    localStorage.setItem('token', res.data.token);
    return res.data;
  } catch (error) {
    throw error.response.data;
  }
});

const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem('token');
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer; 