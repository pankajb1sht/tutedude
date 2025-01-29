import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import userReducer from './slices/userSlice';
import friendReducer from './slices/friendSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: userReducer,
    friend: friendReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
}); 