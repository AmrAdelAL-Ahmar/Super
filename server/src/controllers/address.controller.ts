import { Response } from 'express';
import { AuthRequest } from '../interfaces/auth.interface';
import { AddressService } from '../services/address.service';
import { AppError } from '../utils/error.util';
import { logger } from '../utils/logger.util';



export class AddressController {
  private addressService: AddressService;

  constructor() {
    this.addressService = new AddressService();
  }

  getAddresses = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const addresses = await this.addressService.getAddressesByUser(req.user!._id);
      res.json({ success: true, data: addresses });
    } catch (error) {
      throw new AppError('Failed to get addresses', 500);
    }
  };

  getAddressById = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const address = await this.addressService.getAddressById(req.params.id);
      if (!address) {
        throw new AppError('Address not found', 404);
      }
      res.json({ success: true, data: address });
    } catch (error) {
      throw new AppError('Failed to get address', 500);
    }
  };

  createAddress = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const address = await this.addressService.createAddress({
        ...req.body,
        userId: req.user!._id
      });
      res.status(201).json({ success: true, data: address });
    } catch (error) {
      throw new AppError('Failed to create address', 500);
    }
  };

  updateAddress = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const address = await this.addressService.updateAddress(
        req.params.id,
        req.body,
      );
      if (!address) {
        throw new AppError('Address not found', 404);
      }
      res.json({ success: true, data: address });
    } catch (error) {
      throw new AppError('Failed to update address', 500);
    }
  };

  deleteAddress = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const result = await this.addressService.deleteAddress(req.params.id);
      if (!result) {
        throw new AppError('Address not found', 404);
      }
      res.json({ success: true, message: 'Address deleted successfully' });
    } catch (error) {
      throw new AppError('Failed to delete address', 500);
    }
  };

  findNearby = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { lat, lng, radius } = req.query;
      const addresses = await this.addressService.findNearbyAddresses(
      [  Number(lat),
        Number(lng)],
        Number(radius) || 10
      );
      res.json({ success: true, data: addresses });
    } catch (error) {
      throw new AppError('Failed to find nearby addresses', 500);
    }
  };

  getAddressesByUser = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.user?._id) {
        res.status(401).json({
          success: false,
          message: 'Unauthorized'
        });
        return;
      }

      const { page, limit, sort } = req.query;
      const result = await this.addressService.getAddressesByUser(req.user._id, {
        page: Number(page),
        limit: Number(limit),
        sort: sort as string
      });
      res.status(200).json({
        success: true,
        data: result.addresses,
        total: result.total
      });
    } catch (error) {
      logger.error('Get addresses by user error:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting addresses'
      });
    }
  };

  setDefaultAddress = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.user?._id) {
        res.status(401).json({
          success: false,
          message: 'Unauthorized'
        });
        return;
      }

      await this.addressService.setDefaultAddress(req.user._id, req.params.id);
      res.status(200).json({
        success: true,
        message: 'Default address updated successfully'
      });
    } catch (error) {
      logger.error('Set default address error:', error);
      res.status(500).json({
        success: false,
        message: 'Error setting default address'
      });
    }
  };

  getDefaultAddress = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.user?._id) {
        res.status(401).json({
          success: false,
          message: 'Unauthorized'
        });
        return;
      }

      const address = await this.addressService.getDefaultAddress(req.user._id);
      res.status(200).json({
        success: true,
        data: address
      });
    } catch (error) {
      logger.error('Get default address error:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting default address'
      });
    }
  };
} 