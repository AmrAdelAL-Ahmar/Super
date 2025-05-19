import { IStore } from '../interfaces/models/store.interface';
import { logger } from '../utils/logger.util';
import StoreModel from '../models/store.model';
import { Types } from 'mongoose';

export class StoreService {
  async createStore(storeData: Partial<IStore>): Promise<IStore> {
    try {
      const store = await StoreModel.create(storeData);
      return store.toObject() as IStore;
    } catch (error) {
      logger.error('Create store error:', error);
      throw error;
    }
  }

  async getStoreById(id: string): Promise<IStore | null> {
    try {
      const store = await StoreModel.findById(id)
        .populate('ownerId', 'name email')
        .populate('categoryId', 'name')
        .lean();
      return store as unknown as IStore | null;
    } catch (error) {
      logger.error('Get store error:', error);
      throw error;
    }
  }

  async updateStore(id: string, updateData: Partial<IStore>): Promise<IStore | null> {
    try {
      const store = await StoreModel.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true }
      )
        .populate('ownerId', 'name email')
        .populate('categoryId', 'name')
        .lean();
      return store as unknown as IStore | null;
    } catch (error) {
      logger.error('Update store error:', error);
      throw error;
    }
  }

  async deleteStore(id: string): Promise<void> {
    try {
      await StoreModel.findByIdAndDelete(id);
    } catch (error) {
      logger.error('Delete store error:', error);
      throw error;
    }
  }

  async getStores(query: any = {}, options: any = {}): Promise<{ stores: IStore[]; total: number }> {
    try {
      const { page = 1, limit = 10, sort = '-createdAt' } = options;
      const skip = (page - 1) * limit;

      const [stores, total] = await Promise.all([
        StoreModel.find(query)
          .populate('ownerId', 'name email')
          .populate('categoryId', 'name')
          .sort(sort)
          .skip(skip)
          .limit(limit)
          .lean(),
        StoreModel.countDocuments(query),
      ]);

      return { stores: stores as unknown as IStore[], total };
    } catch (error) {
      logger.error('Get stores error:', error);
      throw error;
    }
  }

  async updateStoreStatus(id: string, isActive: boolean): Promise<IStore | null> {
    try {
      const store = await StoreModel.findByIdAndUpdate(
        id,
        { $set: { isActive } },
        { new: true }
      )
        .populate('ownerId', 'name email')
        .populate('categoryId', 'name')
        .lean();
      return store as unknown as IStore | null;
    } catch (error) {
      logger.error('Update store status error:', error);
      throw error;
    }
  }

  async assignCategoryToStore(storeId: string, categoryId: string): Promise<IStore | null> {
    try {
      const store = await StoreModel.findByIdAndUpdate(
        storeId,
        { $set: { categoryId: new Types.ObjectId(categoryId) } },
        { new: true }
      )
        .populate('ownerId', 'name email')
        .populate('categoryId', 'name')
        .lean();
      return store as unknown as IStore | null;
    } catch (error) {
      logger.error('Assign category to store error:', error);
      throw error;
    }
  }

  async removeCategoryFromStore(storeId: string): Promise<IStore | null> {
    try {
      const store = await StoreModel.findByIdAndUpdate(
        storeId,
        { $unset: { categoryId: 1 } },
        { new: true }
      )
        .populate('ownerId', 'name email')
        .populate('categoryId', 'name')
        .lean();
      return store as unknown as IStore | null;
    } catch (error) {
      logger.error('Remove category from store error:', error);
      throw error;
    }
  }

  async getStoresByCategory(categoryId: string, options: any = {}): Promise<{ stores: IStore[]; total: number }> {
    try {
      const { page = 1, limit = 10, sort = '-createdAt' } = options;
      const skip = (page - 1) * limit;

      const [stores, total] = await Promise.all([
        StoreModel.find({ categoryId })
          .populate('ownerId', 'name email')
          .populate('categoryId', 'name')
          .sort(sort)
          .skip(skip)
          .limit(limit)
          .lean(),
        StoreModel.countDocuments({ categoryId }),
      ]);

      return { stores: stores as unknown as IStore[], total };
    } catch (error) {
      logger.error('Get stores by category error:', error);
      throw error;
    }
  }

  async getStoresByOwner(ownerId: string, options: any = {}): Promise<{ stores: IStore[]; total: number }> {
    try {
      const { page = 1, limit = 10, sort = '-createdAt' } = options;
      const skip = (page - 1) * limit;

      const [stores, total] = await Promise.all([
        StoreModel.find({ ownerId })
          .populate('ownerId', 'name email')
          .populate('categoryId', 'name')
          .sort(sort)
          .skip(skip)
          .limit(limit)
          .lean(),
        StoreModel.countDocuments({ ownerId }),
      ]);

      return { stores: stores as unknown as IStore[], total };
    } catch (error) {
      logger.error('Get stores by owner error:', error);
      throw error;
    }
  }
} 