import axios from 'axios';
import { CartItem } from '@/types/cart';

// API base URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface Address {
  id?: string;
  name: string;
  nameAr?: string;
  recipient: string;
  street: string;
  city: string;
  state?: string;
  zipCode: string;
  phone: string;
  isDefault?: boolean;
}

export interface CheckoutData {
  items: CartItem[];
  address: Address;
  paymentMethod: string;
  orderNotes?: string;
  subtotal: number;
  shippingCost: number;
  discount?: number;
  total: number;
}

/**
 * Place an order with the provided checkout data
 */
export const placeOrder = async (checkoutData: CheckoutData): Promise<{ orderId: string; success: boolean }> => {
  try {
    // In a real app, this would be an API call
    // const response = await axios.post(`${API_URL}/orders`, checkoutData);
    // return response.data;
    
    // For now, simulate a successful order
    return {
      orderId: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
      success: true
    };
  } catch (error) {
    console.error('Error placing order:', error);
    throw error;
  }
};

/**
 * Get user saved addresses
 */
export const getUserAddresses = async (): Promise<Address[]> => {
  try {
    // In a real app, this would be an API call
    // const response = await axios.get(`${API_URL}/user/addresses`);
    // return response.data;
    
    // For now, return mock addresses
    return [
      {
        id: '1',
        name: 'Home',
        nameAr: 'المنزل',
        recipient: 'John Doe',
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        phone: '555-123-4567',
        isDefault: true
      },
      {
        id: '2',
        name: 'Work',
        nameAr: 'العمل',
        recipient: 'John Doe',
        street: '456 Office Ave',
        city: 'New York',
        state: 'NY',
        zipCode: '10002',
        phone: '555-987-6543',
        isDefault: false
      }
    ];
  } catch (error) {
    console.error('Error fetching user addresses:', error);
    throw error;
  }
};

/**
 * Save a new address
 */
export const saveAddress = async (address: Address): Promise<Address> => {
  try {
    // In a real app, this would be an API call
    // const response = await axios.post(`${API_URL}/user/addresses`, address);
    // return response.data;
    
    // For now, simulate a successful save
    return {
      ...address,
      id: `addr-${Math.floor(100000 + Math.random() * 900000)}`
    };
  } catch (error) {
    console.error('Error saving address:', error);
    throw error;
  }
};

export default {
  placeOrder,
  getUserAddresses,
  saveAddress
}; 