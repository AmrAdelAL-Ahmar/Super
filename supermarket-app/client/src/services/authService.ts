import axios from 'axios';
import {
  User,
  LoginCredentials,
  RegisterData,
  Address,
  ProfileUpdateData,
  PasswordUpdateData,
  UserResponse,
  AddressResponse
} from '@/types/user';

// Correct API URL - removing /v1 to match server routes
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

/**
 * Login user
 */
export const loginUser = async (credentials: LoginCredentials): Promise<User> => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, credentials, {
      withCredentials: true
    });
    
    return response.data.user;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

/**
 * Register user
 */
export const registerUser = async (userData: RegisterData): Promise<User> => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, userData, {
      withCredentials: true
    });
    
    return response.data.user;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

/**
 * Get current user profile
 */
export const getCurrentUser = async (): Promise<User> => {
  try {
    const response = await axios.get(`${API_URL}/auth/me`, {
      withCredentials: true
    });
    
    return response.data.data;
  } catch (error) {
    console.error('Error getting current user:', error);
    throw error;
  }
};

/**
 * Update user profile
 */
export const updateUserProfile = async (userData: ProfileUpdateData): Promise<User> => {
  try {
    const response = await axios.put(`${API_URL}/auth/updatedetails`, userData, {
      withCredentials: true
    });
    
    return response.data.data;
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
};

/**
 * Update password
 */
export const updatePassword = async (passwordData: PasswordUpdateData): Promise<boolean> => {
  try {
    await axios.put(`${API_URL}/auth/updatepassword`, passwordData, {
      withCredentials: true
    });
    
    return true;
  } catch (error) {
    console.error('Error updating password:', error);
    throw error;
  }
};

/**
 * Get user addresses
 */
export const getUserAddresses = async (): Promise<Address[]> => {
  try {
    const response = await axios.get(`${API_URL}/auth/me`, {
      withCredentials: true
    });
    
    return response.data.data.addresses || [];
  } catch (error) {
    console.error('Error fetching addresses:', error);
    throw error;
  }
};

/**
 * Add new address
 */
export const addAddress = async (address: Omit<Address, '_id'>): Promise<Address[]> => {
  try {
    const response = await axios.post(`${API_URL}/users/addresses`, address, {
      withCredentials: true
    });
    
    return response.data.data;
  } catch (error) {
    console.error('Error adding address:', error);
    throw error;
  }
};

/**
 * Update address
 */
export const updateAddress = async (addressId: string, address: Partial<Address>): Promise<Address[]> => {
  try {
    const response = await axios.put(`${API_URL}/users/addresses/${addressId}`, address, {
      withCredentials: true
    });
    
    return response.data.data;
  } catch (error) {
    console.error('Error updating address:', error);
    throw error;
  }
};

/**
 * Delete address
 */
export const deleteAddress = async (addressId: string): Promise<Address[]> => {
  try {
    const response = await axios.delete(`${API_URL}/users/addresses/${addressId}`, {
      withCredentials: true
    });
    
    return response.data.data;
  } catch (error) {
    console.error('Error deleting address:', error);
    throw error;
  }
};

/**
 * Forgot password
 */
export const forgotPassword = async (email: string): Promise<boolean> => {
  try {
    await axios.post(`${API_URL}/auth/forgotpassword`, { email });
    return true;
  } catch (error) {
    console.error('Error with forgot password:', error);
    throw error;
  }
};

/**
 * Logout user
 */
export const logoutUser = async (): Promise<boolean> => {
  try {
    await axios.get(`${API_URL}/auth/logout`, {
      withCredentials: true
    });
    return true;
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
}; 