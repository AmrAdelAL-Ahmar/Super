/**
 * User management related type definitions
 */

/**
 * User interface - represents a user in the system
 */
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  addresses?: Address[];
  createdAt?: string;
  updatedAt?: string;
}

/**
 * User roles enum
 */
export type UserRole = 'customer' | 'owner' | 'delivery';

/**
 * Login credentials
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Registration data
 */
export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone: string;
  role?: UserRole;
}

/**
 * Address interface
 */
export interface Address {
  _id?: string;
  address: string;
  city: string;
  coordinates: Coordinates;
  isDefault: boolean;
}

/**
 * Coordinates for address locations
 */
export interface Coordinates {
  lat: number;
  lng: number;
}

/**
 * User profile update data
 */
export interface ProfileUpdateData {
  name?: string;
  email?: string;
  phone?: string;
  avatar?: string;
}

/**
 * Password update data
 */
export interface PasswordUpdateData {
  currentPassword: string;
  newPassword: string;
}

/**
 * Auth state for Redux store
 */
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
  loading: boolean;
  error: string | null;
}

/**
 * API responses
 */
export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: User;
  error?: string;
}

export interface UserResponse {
  success: boolean;
  data: User;
}

export interface UsersResponse {
  success: boolean;
  count: number;
  data: User[];
}

export interface AddressResponse {
  success: boolean;
  data: Address[];
}

/**
 * New employee creation data (for owner role)
 */
export interface NewEmployeeData extends RegisterData {
  role: 'delivery';
} 