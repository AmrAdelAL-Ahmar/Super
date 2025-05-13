import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define types for the UI state
export interface UiState {
  language: 'en' | 'ar';
  direction: 'ltr' | 'rtl';
  theme: 'light' | 'dark';
  sidebarOpen: boolean;
  loading: boolean;
  notifications: {
    id: string;
    type: 'success' | 'error' | 'info' | 'warning';
    message: string;
    read: boolean;
  }[];
  modal: {
    isOpen: boolean;
    type: string | null;
    data: any | null;
  };
}

// Get language from localStorage or browser default
const getDefaultLanguage = (): 'en' | 'ar' => {
  if (typeof window !== 'undefined') {
    const storedLang = localStorage.getItem('language');
    if (storedLang === 'en' || storedLang === 'ar') {
      return storedLang;
    }
    // Check browser language
    const browserLang = navigator.language;
    if (browserLang.startsWith('ar')) {
      return 'ar';
    }
  }
  return 'en';
};

// Define the initial state using the UiState type
const initialState: UiState = {
  language: getDefaultLanguage(),
  direction: getDefaultLanguage() === 'ar' ? 'rtl' : 'ltr',
  theme: 'light',
  sidebarOpen: false,
  loading: false,
  notifications: [],
  modal: {
    isOpen: false,
    type: null,
    data: null,
  },
};

// Create a slice for UI
export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<'en' | 'ar'>) => {
      state.language = action.payload;
      state.direction = action.payload === 'ar' ? 'rtl' : 'ltr';
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('language', action.payload);
      }
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('theme', action.payload);
      }
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    addNotification: (state, action: PayloadAction<{
      id: string;
      type: 'success' | 'error' | 'info' | 'warning';
      message: string;
    }>) => {
      state.notifications.push({ ...action.payload, read: false });
    },
    markNotificationAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find(n => n.id === action.payload);
      if (notification) {
        notification.read = true;
      }
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    openModal: (state, action: PayloadAction<{ type: string; data?: any }>) => {
      state.modal = {
        isOpen: true,
        type: action.payload.type,
        data: action.payload.data || null,
      };
    },
    closeModal: (state) => {
      state.modal = {
        isOpen: false,
        type: null,
        data: null,
      };
    },
  },
});

// Export actions and reducer
export const {
  setLanguage,
  setTheme,
  toggleSidebar,
  setSidebarOpen,
  setLoading,
  addNotification,
  markNotificationAsRead,
  clearNotifications,
  openModal,
  closeModal,
} = uiSlice.actions;

export default uiSlice.reducer; 