import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define types for the cart state
export interface CartItem {
  id: string;
  name: string;
  nameAr: string;
  price: number;
  image: string;
  quantity: number;
  stock: number;
  unit: string;
}

export interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}

// Function to get cart from localStorage
const getLocalCart = (): CartItem[] => {
  if (typeof window !== 'undefined') {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
  }
  return [];
};

// Define the initial state using the CartState type
const initialState: CartState = {
  items: getLocalCart(),
  totalItems: getLocalCart().reduce((total, item) => total + item.quantity, 0),
  totalPrice: getLocalCart().reduce((total, item) => total + item.price * item.quantity, 0),
};

// Function to update localStorage
const updateLocalStorage = (items: CartItem[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('cart', JSON.stringify(items));
  }
};

// Create a slice for cart
export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<CartItem>) => {
      const existingItem = state.items.find((item) => item.id === action.payload.id);
      
      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
      
      state.totalItems = state.items.reduce((total, item) => total + item.quantity, 0);
      state.totalPrice = state.items.reduce((total, item) => total + item.price * item.quantity, 0);
      
      updateLocalStorage(state.items);
    },
    removeItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      state.totalItems = state.items.reduce((total, item) => total + item.quantity, 0);
      state.totalPrice = state.items.reduce((total, item) => total + item.price * item.quantity, 0);
      
      updateLocalStorage(state.items);
    },
    updateItemQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
      const item = state.items.find((item) => item.id === action.payload.id);
      
      if (item) {
        item.quantity = action.payload.quantity;
        state.totalItems = state.items.reduce((total, item) => total + item.quantity, 0);
        state.totalPrice = state.items.reduce((total, item) => total + item.price * item.quantity, 0);
        
        updateLocalStorage(state.items);
      }
    },
    clearCart: (state) => {
      state.items = [];
      state.totalItems = 0;
      state.totalPrice = 0;
      
      updateLocalStorage(state.items);
    },
  },
});

// Export actions and reducer
export const { addItem, removeItem, updateItemQuantity, clearCart } = cartSlice.actions;

export default cartSlice.reducer; 