import { Response } from 'express';
import { MapsService } from '../services/maps.service';
import { logger } from '../utils/logger.util';
import { AuthRequest } from '../interfaces/auth.interface';
import { mapsValidation } from '../validations/maps.validation';
import { validateSchema } from '../middleware/validation.middleware';

export class MapsController {
  private mapsService: MapsService;

  constructor() {
    this.mapsService = new MapsService();
  }

  getNearbyStores = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const validatedData = await validateSchema(mapsValidation.getNearbyStores, req.query);
      const stores = await this.mapsService.getNearbyStores({
        latitude: Number(validatedData.latitude),
        longitude: Number(validatedData.longitude),
        radius: Number(validatedData.radius),
        limit: Number(validatedData.limit)
      });
      res.status(200).json({
        success: true,
        data: stores
      });
    } catch (error) {
      logger.error('Get nearby stores error:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting nearby stores'
      });
    }
  };

  getStoreLocation = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const location = await this.mapsService.getStoreLocation(req.params.storeId);
      if (!location) {
        res.status(404).json({
          success: false,
          message: 'Store location not found'
        });
        return;
      }
      res.status(200).json({
        success: true,
        data: location
      });
    } catch (error) {
      logger.error('Get store location error:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting store location'
      });
    }
  };

  getDeliveryEstimate = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const validatedData = await validateSchema(mapsValidation.getDeliveryEstimate, req.body);
      const estimate = await this.mapsService.getDeliveryEstimate({
        storeId: validatedData.storeId,
        deliveryAddress: validatedData.deliveryAddress
      });
      res.status(200).json({
        success: true,
        data: estimate
      });
    } catch (error) {
      logger.error('Get delivery estimate error:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting delivery estimate'
      });
    }
  };

  getRouteOptimization = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.user?.storeId) {
        res.status(401).json({
          success: false,
          message: 'Unauthorized - Store owner access required'
        });
        return;
      }

      const validatedData = await validateSchema(mapsValidation.getRouteOptimization, req.body);
      const route = await this.mapsService.getRouteOptimization({
        storeId: req.user.storeId,
        orders: validatedData.orders
      });
      res.status(200).json({
        success: true,
        data: route
      });
    } catch (error) {
      logger.error('Get route optimization error:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting route optimization'
      });
    }
  };

  updateStoreLocation = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.user?.storeId) {
        res.status(401).json({
          success: false,
          message: 'Unauthorized - Store owner access required'
        });
        return;
      }

      const validatedData = await validateSchema(mapsValidation.updateStoreLocation, req.body);
      const location = await this.mapsService.updateStoreLocation(req.user.storeId, {
        latitude: Number(validatedData.latitude),
        longitude: Number(validatedData.longitude),
        address: validatedData.address
      });
      res.status(200).json({
        success: true,
        data: location
      });
    } catch (error) {
      logger.error('Update store location error:', error);
      res.status(500).json({
        success: false,
        message: 'Error updating store location'
      });
    }
  };
} 