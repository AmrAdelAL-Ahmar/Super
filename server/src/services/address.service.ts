import { IAddress } from '../interfaces/models/address.interface';
import { logger } from '../utils/logger.util';
import AddressModel from '../models/address.model';
import { getCoordinatesFromAddress } from '../utils/geocoding.util';

export class AddressService {
  async createAddress(addressData: Partial<IAddress>): Promise<IAddress> {
    try {
      // Get coordinates from address
      const coordinates = await getCoordinatesFromAddress(addressData);
      
      const address = await AddressModel.create({
        ...addressData,
        coordinates: {
          latitude: coordinates.lat,
          longitude: coordinates.lng
        }
      });

      return address.toObject() as IAddress;
    } catch (error) {
      logger.error('Create address error:', error);
      throw error;
    }
  }

  async getAddressById(id: string): Promise<IAddress | null> {
    try {
      return await AddressModel.findById(id)
        .populate('userId', 'firstName lastName email');
    } catch (error) {
      logger.error('Get address error:', error);
      throw error;
    }
  }

  async updateAddress(id: string, updateData: Partial<IAddress>): Promise<IAddress | null> {
    try {
      // If address fields are updated, get new coordinates
      if (updateData.street || updateData.city || updateData.state || updateData.country) {
        const coordinates = await getCoordinatesFromAddress(updateData);
        updateData.coordinates = {
          latitude: coordinates.lat,
          longitude: coordinates.lng
        };
      }

      return await AddressModel.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true }
      );
    } catch (error) {
      logger.error('Update address error:', error);
      throw error;
    }
  }

  async deleteAddress(id: string): Promise<IAddress | null> {
    try {
      return await AddressModel.findByIdAndDelete(id);
    } catch (error) {
      logger.error('Delete address error:', error);
      throw error;
    }
  }

  async getAddressesByUser(userId: string, options: any = {}): Promise<{ addresses: IAddress[]; total: number }> {
    try {
      const { page = 1, limit = 10, sort = '-createdAt' } = options;
      const skip = (page - 1) * limit;

      const [addresses, total] = await Promise.all([
        AddressModel.find({ userId })
          .sort(sort)
          .skip(skip)
          .limit(limit),
        AddressModel.countDocuments({ userId })
      ]);

      return { addresses: addresses.map(address => address.toObject() as IAddress), total };
    } catch (error) {
      logger.error('Get addresses by user error:', error);
      throw error;
    }
  }

  async setDefaultAddress(userId: string, addressId: string): Promise<void> {
    try {
      // Remove default status from all user addresses
      await AddressModel.updateMany(
        { userId },
        { $set: { isDefault: false } }
      );

      // Set the selected address as default
      await AddressModel.findByIdAndUpdate(
        addressId,
        { $set: { isDefault: true } }
      );
    } catch (error) {
      logger.error('Set default address error:', error);
      throw error;
    }
  }

  async getDefaultAddress(userId: string): Promise<IAddress | null> {
    try {
      return await AddressModel.findOne({ userId, isDefault: true });
    } catch (error) {
      logger.error('Get default address error:', error);
      throw error;
    }
  }

  async findNearbyAddresses(coordinates: [number, number], radius: number): Promise<IAddress[]> {
    try {
      return await AddressModel.find({
        location: {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates
            },
            $maxDistance: radius * 1000 // Convert km to meters
          }
        }
      });
    } catch (error) {
      logger.error('Find nearby addresses error:', error);
      throw error;
    }
  }
} 