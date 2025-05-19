import { Request, Response } from 'express';
import { StoreService } from '../services/store.service';
import { sendSuccess, sendError, sendNotFound } from '../utils/response.util';
import { logger } from '../utils/logger.util';

export class StoreController {
  private storeService: StoreService;

  constructor() {
    this.storeService = new StoreService();
  }

  createStore = async (req: Request, res: Response): Promise<void> => {
    try {
      const store = await this.storeService.createStore(req.body);
      sendSuccess(res, store, 'Store created successfully');
    } catch (error) {
      logger.error('Create store controller error:', error);
      sendError(res, 'Failed to create store', error);
    }
  };

  getStoreById = async (req: Request, res: Response): Promise<void> => {
    try {
      const store = await this.storeService.getStoreById(req.params.id);
      if (!store) {
        sendNotFound(res, 'Store not found');
        return;
      }
      sendSuccess(res, store);
    } catch (error) {
      logger.error('Get store controller error:', error);
      sendError(res, 'Failed to get store', error);
    }
  };

  updateStore = async (req: Request, res: Response): Promise<void> => {
    try {
      const store = await this.storeService.updateStore(req.params.id, req.body);
      if (!store) {
        sendNotFound(res, 'Store not found');
        return;
      }
      sendSuccess(res, store, 'Store updated successfully');
    } catch (error) {
      logger.error('Update store controller error:', error);
      sendError(res, 'Failed to update store', error);
    }
  };

  deleteStore = async (req: Request, res: Response): Promise<void> => {
    try {
      await this.storeService.deleteStore(req.params.id);
      sendSuccess(res, null, 'Store deleted successfully');
    } catch (error) {
      logger.error('Delete store controller error:', error);
      sendError(res, 'Failed to delete store', error);
    }
  };

  getStores = async (req: Request, res: Response): Promise<void> => {
    try {
      const { page, limit, sort, ...query } = req.query;
      const options = { page, limit, sort };
      const result = await this.storeService.getStores(query, options);
      sendSuccess(res, result);
    } catch (error) {
      logger.error('Get stores controller error:', error);
      sendError(res, 'Failed to get stores', error);
    }
  };

  updateStoreStatus = async (req: Request, res: Response): Promise<void> => {
    try {
      const { isActive } = req.body;
      const store = await this.storeService.updateStoreStatus(req.params.id, isActive);
      if (!store) {
        sendNotFound(res, 'Store not found');
        return;
      }
      sendSuccess(res, store, 'Store status updated successfully');
    } catch (error) {
      logger.error('Update store status controller error:', error);
      sendError(res, 'Failed to update store status', error);
    }
  };

  assignCategoryToStore = async (req: Request, res: Response): Promise<void> => {
    try {
      const { categoryId } = req.body;
      const store = await this.storeService.assignCategoryToStore(req.params.id, categoryId);
      if (!store) {
        sendNotFound(res, 'Store not found');
        return;
      }
      sendSuccess(res, store, 'Category assigned to store successfully');
    } catch (error) {
      logger.error('Assign category to store controller error:', error);
      sendError(res, 'Failed to assign category to store', error);
    }
  };

  removeCategoryFromStore = async (req: Request, res: Response): Promise<void> => {
    try {
      const store = await this.storeService.removeCategoryFromStore(req.params.id);
      if (!store) {
        sendNotFound(res, 'Store not found');
        return;
      }
      sendSuccess(res, store, 'Category removed from store successfully');
    } catch (error) {
      logger.error('Remove category from store controller error:', error);
      sendError(res, 'Failed to remove category from store', error);
    }
  };

  getStoresByCategory = async (req: Request, res: Response): Promise<void> => {
    try {
      const { page, limit, sort } = req.query;
      const options = { page, limit, sort };
      const result = await this.storeService.getStoresByCategory(req.params.categoryId, options);
      sendSuccess(res, result);
    } catch (error) {
      logger.error('Get stores by category controller error:', error);
      sendError(res, 'Failed to get stores by category', error);
    }
  };

  getStoresByOwner = async (req: Request, res: Response): Promise<void> => {
    try {
      const { page, limit, sort } = req.query;
      const options = { page, limit, sort };
      const result = await this.storeService.getStoresByOwner(req.params.ownerId, options);
      sendSuccess(res, result);
    } catch (error) {
      logger.error('Get stores by owner controller error:', error);
      sendError(res, 'Failed to get stores by owner', error);
    }
  };

  getStoreProducts = async (req: Request, res: Response): Promise<void> => {
    try {
      const storeId = req.params.id;
      // This would need a product service with a getProductsByStore method
      // For now, we'll respond with a placeholder
      sendSuccess(res, { message: "This endpoint will return products for store: " + storeId });
    } catch (error) {
      logger.error('Get store products controller error:', error);
      sendError(res, 'Failed to get store products', error);
    }
  };

  getStoreCategories = async (req: Request, res: Response): Promise<void> => {
    try {
      const storeId = req.params.id;
      // This would need a category service with a getCategoriesByStore method
      // For now, we'll respond with a placeholder
      sendSuccess(res, { message: "This endpoint will return categories for store: " + storeId });
    } catch (error) {
      logger.error('Get store categories controller error:', error);
      sendError(res, 'Failed to get store categories', error);
    }
  };

  getStoreReviews = async (req: Request, res: Response): Promise<void> => {
    try {
      const storeId = req.params.id;
      // This would need a review service with a getReviewsByStore method
      // For now, we'll respond with a placeholder
      sendSuccess(res, { message: "This endpoint will return reviews for store: " + storeId });
    } catch (error) {
      logger.error('Get store reviews controller error:', error);
      sendError(res, 'Failed to get store reviews', error);
    }
  };

  updateStoreHours = async (req: Request, res: Response): Promise<void> => {
    try {
      const storeId = req.params.id;
      const hours = req.body;
      // This would need to update store business hours
      // For now, we'll respond with a placeholder
      sendSuccess(res, { message: "Updated hours for store: " + storeId, hours });
    } catch (error) {
      logger.error('Update store hours controller error:', error);
      sendError(res, 'Failed to update store hours', error);
    }
  };

  updateStoreLocation = async (req: Request, res: Response): Promise<void> => {
    try {
      const storeId = req.params.id;
      const location = req.body;
      // This would need to update store location
      // For now, we'll respond with a placeholder
      sendSuccess(res, { message: "Updated location for store: " + storeId, location });
    } catch (error) {
      logger.error('Update store location controller error:', error);
      sendError(res, 'Failed to update store location', error);
    }
  };

  getAllStores = async (req: Request, res: Response): Promise<void> => {
    try {
      // This is essentially the same as getStores but possibly without filters
      const { page, limit, sort } = req.query;
      const options = { page, limit, sort };
      const result = await this.storeService.getStores({}, options);
      sendSuccess(res, result);
    } catch (error) {
      logger.error('Get all stores controller error:', error);
      sendError(res, 'Failed to get all stores', error);
    }
  };

  verifyStore = async (req: Request, res: Response): Promise<void> => {
    try {
      const storeId = req.params.id;
      const { verified } = req.body;
      // This would update some verification status in the store model
      // For now, we'll respond with a placeholder
      sendSuccess(res, { message: `Store ${storeId} verification status updated to: ${verified}` });
    } catch (error) {
      logger.error('Verify store controller error:', error);
      sendError(res, 'Failed to verify store', error);
    }
  };

  updateBusinessHours = async (req: Request, res: Response): Promise<void> => {
    try {
      const storeId = req.params.id;
      const businessHours = req.body;
      // Update business hours for the store
      // For now, we'll respond with a placeholder
      sendSuccess(res, { message: "Updated business hours for store: " + storeId, businessHours });
    } catch (error) {
      logger.error('Update business hours controller error:', error);
      sendError(res, 'Failed to update business hours', error);
    }
  };

  updateDeliverySettings = async (req: Request, res: Response): Promise<void> => {
    try {
      const storeId = req.params.id;
      const deliverySettings = req.body;
      // Update delivery settings for the store
      // For now, we'll respond with a placeholder
      sendSuccess(res, { message: "Updated delivery settings for store: " + storeId, deliverySettings });
    } catch (error) {
      logger.error('Update delivery settings controller error:', error);
      sendError(res, 'Failed to update delivery settings', error);
    }
  };

  updatePaymentMethods = async (req: Request, res: Response): Promise<void> => {
    try {
      const storeId = req.params.id;
      const paymentMethods = req.body;
      // Update payment methods for the store
      // For now, we'll respond with a placeholder
      sendSuccess(res, { message: "Updated payment methods for store: " + storeId, paymentMethods });
    } catch (error) {
      logger.error('Update payment methods controller error:', error);
      sendError(res, 'Failed to update payment methods', error);
    }
  };
} 