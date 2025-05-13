import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the user type
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'owner' | 'delivery';
  avatar?: string;
}

// Define the authentication state
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  token: null,
  loading: false,
  error: null,
};

// Create the auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Login request action
    loginRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    // Login success action
    login: (state, action: PayloadAction<{ user: User; token?: string }>) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token || null;
      state.error = null;
    },
    // Login failure action
    loginFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.error = action.payload;
    },
    // Logout action
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.error = null;
    },
    // Update user profile action
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    // Clear error action
    clearError: (state) => {
      state.error = null;
    },
  },
});

// Export actions
export const { 
  loginRequest, 
  login, 
  loginFailure, 
  logout, 
  updateUser, 
  clearError 
} = authSlice.actions;

// Export reducer
export default authSlice.reducer; 