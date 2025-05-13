import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define types for the auth state
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'owner' | 'delivery';
  phone: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Define the initial state using the AuthState type
const initialState: AuthState = {
  user: null,
  token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// Create a slice for auth
export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.error = null;
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', action.payload.token);
      }
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.error = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.error = null;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
      }
    },
    registerStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    registerSuccess: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.error = null;
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', action.payload.token);
      }
    },
    registerFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    updateUserSuccess: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

// Export actions and reducer
export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  registerStart,
  registerSuccess,
  registerFailure,
  updateUserSuccess,
  clearError,
} = authSlice.actions;

export default authSlice.reducer; 