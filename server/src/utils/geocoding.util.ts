import axios from 'axios';
import { logger } from './logger.util';

interface Coordinates {
  lat: number;
  lng: number;
}

interface AddressData {
  street?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
}

interface Address {
  street: string;
  city: string;
  state?: string;
  country: string;
  postalCode: string;
}

// Calculate distance between two points using Haversine formula
export const calculateDistance = (coord1: Coordinates, coord2: Coordinates): number => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRad(coord2.lat - coord1.lat);
  const dLon = toRad(coord2.lng - coord1.lng);
  const lat1 = toRad(coord1.lat);
  const lat2 = toRad(coord2.lat);

  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Convert degrees to radians
const toRad = (value: number): number => {
  return value * Math.PI / 180;
};

// Format address components into a single string
export const formatAddress = (address: Address): string => {
  const components = [
    address.street,
    address.city,
    address.state,
    address.postalCode,
    address.country,
  ].filter(Boolean);

  return components.join(', ');
};

// Validate coordinates
export const isValidCoordinates = (coordinates: Coordinates): boolean => {
  return (
    coordinates.lat >= -90 &&
    coordinates.lat <= 90 &&
    coordinates.lng >= -180 &&
    coordinates.lng <= 180
  );
};

// Calculate delivery time estimate based on distance
export const calculateDeliveryTime = (
  distance: number,
  averageSpeed: number = 30 // km/h
): number => {
  return Math.ceil((distance / averageSpeed) * 60); // Returns time in minutes
};

// Calculate delivery fee based on distance
export const calculateDeliveryFee = (
  distance: number,
  baseFee: number = 5,
  perKmFee: number = 2
): number => {
  return baseFee + distance * perKmFee;
};

// Check if a point is within a certain radius of another point
export const isWithinRadius = (
  point1: Coordinates,
  point2: Coordinates,
  radius: number
): boolean => {
  return calculateDistance(point1, point2) <= radius;
};

export const getCoordinatesFromAddress = async (addressData: AddressData): Promise<Coordinates> => {
  try {
    const addressString = [
      addressData.street,
      addressData.city,
      addressData.state,
      addressData.country,
      addressData.postalCode
    ].filter(Boolean).join(', ');

    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(addressString)}&key=${process.env.GOOGLE_MAPS_API_KEY}`
    );

    if (response.data.status !== 'OK') {
      throw new Error('Geocoding failed');
    }

    const { lat, lng } = response.data.results[0].geometry.location;
    return { lat, lng };
  } catch (error) {
    logger.error('Geocoding error:', error);
    throw error;
  }
};

export const getAddressFromCoordinates = async (coordinates: Coordinates): Promise<string> => {
  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${coordinates.lat},${coordinates.lng}&key=${process.env.GOOGLE_MAPS_API_KEY}`
    );

    if (response.data.status !== 'OK') {
      throw new Error('Reverse geocoding failed');
    }

    return response.data.results[0].formatted_address;
  } catch (error) {
    logger.error('Reverse geocoding error:', error);
    throw error;
  }
}; 