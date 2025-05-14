import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define a cart item type
export interface CartItem {
  id: string;
  name: string;
  nameAr: string;
  price: number;
  image: string;
  quantity: number;
  stock: number;
  unit: string;
  discount?: number;  // Make discount optional for backward compatibility
}

// Define the cart state
interface CartState {
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
}

// Calculate cart totals helper function
const calculateCartTotals = (items: CartItem[]) => {
  return items.reduce(
    (totals, item) => {
      const itemPrice = item.discount ? item.price * (1 - item.discount / 100) : item.price;
      totals.totalItems += item.quantity;
      totals.totalAmount += itemPrice * item.quantity;
      return totals;
    },
    { totalItems: 0, totalAmount: 0 }
  );
};

// Initial state
const initialState: CartState = {
  items: [],
  totalItems: 0,
  totalAmount: 0,
};

// Create the cart slice
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Add item to cart
    addItem: (state, action: PayloadAction<CartItem>) => {
      const existingItemIndex = state.items.findIndex(
        (item) => item.id === action.payload.id
      );

      if (existingItemIndex >= 0) {
        // If item already exists in cart, increase quantity
        state.items[existingItemIndex].quantity += action.payload.quantity || 1;
      } else {
        // Otherwise, add new item with the specified quantity
        state.items.push({ 
          ...action.payload, 
          quantity: action.payload.quantity || 1 
        });
      }

      // Update totals
      const { totalItems, totalAmount } = calculateCartTotals(state.items);
      state.totalItems = totalItems;
      state.totalAmount = totalAmount;
    },

    // Remove item from cart
    removeItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);

      // Update totals
      const { totalItems, totalAmount } = calculateCartTotals(state.items);
      state.totalItems = totalItems;
      state.totalAmount = totalAmount;
    },

    // Update item quantity
    updateQuantity: (
      state,
      action: PayloadAction<{ id: string; quantity: number }>
    ) => {
      const { id, quantity } = action.payload;

      const itemIndex = state.items.findIndex((item) => item.id === id);

      if (itemIndex >= 0) {
        state.items[itemIndex].quantity = quantity;
      }

      // Update totals
      const { totalItems, totalAmount } = calculateCartTotals(state.items);
      state.totalItems = totalItems;
      state.totalAmount = totalAmount;
    },

    // Clear the cart
    clearCart: (state) => {
      state.items = [];
      state.totalItems = 0;
      state.totalAmount = 0;
    },
  },
});

// Export actions
export const { addItem, removeItem, updateQuantity, clearCart } =
  cartSlice.actions;

// Export reducer
export default cartSlice.reducer; 