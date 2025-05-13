import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the UI state
interface UIState {
  language: 'en' | 'ar';
  theme: 'light' | 'dark';
  direction: 'ltr' | 'rtl';
  sidebarOpen: boolean;
  loading: {
    global: boolean;
    [key: string]: boolean;
  };
  toasts: Toast[];
  layout: 'grid' | 'list';
}

// Define a toast item
export interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration: number;
  timestamp: number;
}

// Initial state
const initialState: UIState = {
  language: 'en',
  theme: 'light',
  direction: 'ltr',
  sidebarOpen: false,
  loading: {
    global: false,
  },
  toasts: [],
  layout: 'grid',
};

// Create the UI slice
const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // Set language
    setLanguage: (state, action: PayloadAction<'en' | 'ar'>) => {
      state.language = action.payload;
      state.direction = action.payload === 'ar' ? 'rtl' : 'ltr';
      // Update document direction
      if (typeof document !== 'undefined') {
        document.documentElement.dir = action.payload === 'ar' ? 'rtl' : 'ltr';
      }
    },
    
    // Toggle theme
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
      // Update document theme class
      if (typeof document !== 'undefined') {
        document.documentElement.classList.toggle('dark');
      }
    },
    
    // Set theme explicitly
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
      // Update document theme class
      if (typeof document !== 'undefined') {
        if (action.payload === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    },
    
    // Toggle sidebar
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    
    // Set sidebar state explicitly
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    
    // Set loading state for a specific key
    setLoading: (state, action: PayloadAction<{ key: string; isLoading: boolean }>) => {
      state.loading[action.payload.key] = action.payload.isLoading;
    },
    
    // Set global loading state
    setGlobalLoading: (state, action: PayloadAction<boolean>) => {
      state.loading.global = action.payload;
    },
    
    // Add a toast notification
    addToast: (state, action: PayloadAction<Omit<Toast, 'id' | 'timestamp'>>) => {
      const newToast: Toast = {
        ...action.payload,
        id: Date.now().toString(),
        timestamp: Date.now(),
      };
      state.toasts.push(newToast);
    },
    
    // Remove a toast notification
    removeToast: (state, action: PayloadAction<string>) => {
      state.toasts = state.toasts.filter((toast) => toast.id !== action.payload);
    },
    
    // Clear all toast notifications
    clearToasts: (state) => {
      state.toasts = [];
    },
    
    // Set layout (grid or list)
    setLayout: (state, action: PayloadAction<'grid' | 'list'>) => {
      state.layout = action.payload;
    },
  },
});

// Export actions
export const {
  setLanguage,
  toggleTheme,
  setTheme,
  toggleSidebar,
  setSidebarOpen,
  setLoading,
  setGlobalLoading,
  addToast,
  removeToast,
  clearToasts,
  setLayout,
} = uiSlice.actions;

// Export reducer
export default uiSlice.reducer; 