import axios from 'axios';
import { logger } from '../utils/logger.util';
import { calculateDistance, calculateDeliveryTime, calculateDeliveryFee } from '../utils/geocoding.util';
import StoreModel from '../models/store.model';
import { IStore, IStoreLocation } from '../interfaces/models/store.interface';
import { IAddress } from 'src/interfaces/models/address.interface';

interface Coordinates {
  lat: number;
  lng: number;
}



export class MapsService {
  private readonly apiKey: string;

  constructor() {
    this.apiKey = process.env.GOOGLE_MAPS_API_KEY || '';
    if (!this.apiKey) {
      throw new Error('Google Maps API key is required');
    }
  }

  async getCoordinatesFromAddress(address: IAddress): Promise<Coordinates> {
    try {
      const addressString = [
        address.street,
        address.city,
        address.state,
        address.country,
        address.zipCode
      ].filter(Boolean).join(', ');

      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(addressString)}&key=${this.apiKey}`
      );

      if (response.data.status !== 'OK') {
        throw new Error('Geocoding failed');
      }

      const { lat, lng } = response.data.results[0].geometry.location;
      return { lat, lng };
    } catch (error) {
      logger.error('Get coordinates from address error:', error);
      throw error;
    }
  }

  async getAddressFromCoordinates(coordinates: Coordinates): Promise<string> {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${coordinates.lat},${coordinates.lng}&key=${this.apiKey}`
      );

      if (response.data.status !== 'OK') {
        throw new Error('Reverse geocoding failed');
      }

      return response.data.results[0].formatted_address;
    } catch (error) {
      logger.error('Get address from coordinates error:', error);
      throw error;
    }
  }

  async getDirections(origin: Coordinates, destination: Coordinates): Promise<{
    distance: number;
    duration: number;
    polyline: string;
  }> {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.lat},${origin.lng}&destination=${destination.lat},${destination.lng}&key=${this.apiKey}`
      );

      if (response.data.status !== 'OK') {
        throw new Error('Directions request failed');
      }

      const route = response.data.routes[0].legs[0];
      return {
        distance: route.distance.value / 1000, // Convert to kilometers
        duration: route.duration.value / 60, // Convert to minutes
        polyline: route.polyline.points
      };
    } catch (error) {
      logger.error('Get directions error:', error);
      throw error;
    }
  }

  async findNearbyStores(coordinates: Coordinates, radius: number): Promise<Array<{
    storeId: string;
    distance: number;
    coordinates: Coordinates;
  }>> {
    try {
      // This would typically query your database for stores within the radius
      // For now, we'll return a mock response
      return [];
    } catch (error) {
      logger.error('Find nearby stores error:', error);
      throw error;
    }
  }

  calculateDeliveryEstimate(
    origin: Coordinates,
    destination: Coordinates,
    options: {
      averageSpeed?: number;
      baseFee?: number;
      perKmFee?: number;
    } = {}
  ): {
    distance: number;
    duration: number;
    fee: number;
  } {
    try {
      const distance = calculateDistance(origin, destination);
      const duration = calculateDeliveryTime(distance, options.averageSpeed);
      const fee = calculateDeliveryFee(distance, options.baseFee, options.perKmFee);

      return {
        distance,
        duration,
        fee
      };
    } catch (error) {
      logger.error('Calculate delivery estimate error:', error);
      throw error;
    }
  }

  async validateAddress(address: IAddress): Promise<boolean> {
    try {
      const coordinates = await this.getCoordinatesFromAddress(address);
      return coordinates.lat !== 0 && coordinates.lng !== 0;
    } catch (error) {
      logger.error('Validate address error:', error);
      return false;
    }
  }

  async getPlaceDetails(placeId: string): Promise<any> {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${this.apiKey}`
      );

      if (response.data.status !== 'OK') {
        throw new Error('Place details request failed');
      }

      return response.data.result;
    } catch (error) {
      logger.error('Get place details error:', error);
      throw error;
    }
  }

  async searchPlaces(query: string, location?: Coordinates): Promise<Array<{
    placeId: string;
    name: string;
    address: string;
    coordinates: Coordinates;
  }>> {
    try {
      let url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&key=${this.apiKey}`;
      
      if (location) {
        url += `&location=${location.lat},${location.lng}`;
      }

      const response = await axios.get(url);

      if (response.data.status !== 'OK') {
        throw new Error('Places search failed');
      }

      return response.data.results.map((place: any) => ({
        placeId: place.place_id,
        name: place.name,
        address: place.formatted_address,
        coordinates: {
          lat: place.geometry.location.lat,
          lng: place.geometry.location.lng
        }
      }));
    } catch (error) {
      logger.error('Search places error:', error);
      throw error;
    }
  }

  async getNearbyStores(params: { latitude: number; longitude: number; radius: number; limit: number }): Promise<IStore[]> {
    try {
      const stores = await StoreModel.find({
        location: {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [params.longitude, params.latitude]
            },
            $maxDistance: params.radius * 1000 // Convert km to meters
          }
        }
      }).limit(params.limit);
      return stores.map(store => store.toObject());
    } catch (error) {
      logger.error('Get nearby stores error:', error);
      throw error;
    }
  }

  async getStoreLocation(storeId: string): Promise<IStoreLocation | null> {
    try {
      const store = await StoreModel.findById(storeId).select('location');
      return store?.toObject().location || null;
    } catch (error) {
      logger.error('Get store location error:', error);
      throw error;
    }
  }

  async getDeliveryEstimate(params: { storeId: string; deliveryAddress: string | IAddress }): Promise<{ distance: number; duration: number; fee: number }> {
    try {
      // Get store location
      const store = await StoreModel.findById(params.storeId).select('location');
      if (!store?.location) {
        throw new Error('Store location not found');
      }

      // Convert store location to coordinates (coordinates is [longitude, latitude] array)
      const storeCoordinates: Coordinates = {
        lat: store.location.coordinates[1], // Latitude is the second element
        lng: store.location.coordinates[0]  // Longitude is the first element
      };

      // Get customer coordinates
      let customerCoordinates: Coordinates;
      if (typeof params.deliveryAddress === 'string') {
        // If address is provided as a string, geocode it
        const response = await axios.get(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(params.deliveryAddress)}&key=${this.apiKey}`
        );

        if (response.data.status !== 'OK') {
          throw new Error('Geocoding failed for delivery address');
        }

        const { lat, lng } = response.data.results[0].geometry.location;
        customerCoordinates = { lat, lng };
      } else {
        // If address is provided as an object
        customerCoordinates = {
          lat: params.deliveryAddress.coordinates.latitude,
          lng: params.deliveryAddress.coordinates.longitude
        };
      }

      // Get route information using Google Maps Directions API
      const directions = await this.getDirections(storeCoordinates, customerCoordinates);
      
      // Calculate delivery fee based on distance
      const fee = calculateDeliveryFee(directions.distance);
      
      return {
        distance: directions.distance,
        duration: directions.duration,
        fee: fee
      };
    } catch (error) {
      logger.error('Get delivery estimate error:', error);
      // Fallback to calculation using local geocoding utilities if API fails
      if (error instanceof Error && error.message.includes('API')) {
        const store = await StoreModel.findById(params.storeId).select('location');
        if (!store?.location) {
          throw new Error('Store location not found');
        }

        let customerCoordinates: Coordinates;
        if (typeof params.deliveryAddress === 'string') {
          // Simple fallback for string addresses
          // In a real implementation, would need more robust fallback geocoding
          throw new Error('Cannot geocode string address without API');
        } else {
          customerCoordinates = {
            lat: params.deliveryAddress.coordinates.latitude,
            lng: params.deliveryAddress.coordinates.longitude
          };
          
          const storeCoordinates: Coordinates = {
            lat: store.location.coordinates[1], // Latitude is the second element
            lng: store.location.coordinates[0]  // Longitude is the first element
          };
          
          // Use local utility functions as fallback
          const distance = calculateDistance(storeCoordinates, customerCoordinates);
          const duration = calculateDeliveryTime(distance);
          const fee = calculateDeliveryFee(distance);
          
          return { distance, duration, fee };
        }
      }
      
      throw error;
    }
  }

  async getRouteOptimization(params: { storeId: string; orders: string[] }): Promise<{ route: any[]; totalDistance: number; estimatedTime: number }> {
    try {
      const store = await StoreModel.findById(params.storeId).select('location');
      if (!store?.location) {
        throw new Error('Store location not found');
      }
      // TODO: Implement actual route optimization using a mapping service
      return {
        route: [],
        totalDistance: 0,
        estimatedTime: 0
      };
    } catch (error) {
      logger.error('Get route optimization error:', error);
      throw error;
    }
  }

  async updateStoreLocation(storeId: string, location: { latitude: number; longitude: number; address: string }): Promise<IStoreLocation | null> {
    try {
      const store = await StoreModel.findByIdAndUpdate(
        storeId,
        {
          location: {
            type: 'Point',
            coordinates: [location.longitude, location.latitude],
            address: location.address
          }
        },
        { new: true }
      );
      return store?.toObject().location || null;
    } catch (error) {
      logger.error('Update store location error:', error);
      throw error;
    }
  }
} 