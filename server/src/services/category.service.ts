import { ICategory } from '../interfaces/models/category.interface';
import { logger } from '../utils/logger.util';
import CategoryModel from '../models/category.model';

export class CategoryService {
  async createCategory(categoryData: Partial<ICategory>): Promise<ICategory> {
    try {
      const category = await CategoryModel.create(categoryData);
      return category.toObject() as ICategory;
    } catch (error) {
      logger.error('Create category error:', error);
      throw error;
    }
  }

  async getCategoryById(id: string): Promise<ICategory | null> {
    try {
      const category = await CategoryModel.findById(id).lean();
      return category as unknown as ICategory | null;
    } catch (error) {
      logger.error('Get category error:', error);
      throw error;
    }
  }

  async updateCategory(id: string, updateData: Partial<ICategory>): Promise<ICategory | null> {
    try {
      const category = await CategoryModel.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true }
      ).lean();
      return category as unknown as ICategory | null;
    } catch (error) {
      logger.error('Update category error:', error);
      throw error;
    }
  }

  async deleteCategory(id: string): Promise<void> {
    try {
      await CategoryModel.findByIdAndDelete(id);
    } catch (error) {
      logger.error('Delete category error:', error);
      throw error;
    }
  }

  async getCategories(query: any = {}, options: any = {}): Promise<{ categories: ICategory[]; total: number }> {
    try {
      const { page = 1, limit = 10, sort = '-createdAt' } = options;
      const skip = (page - 1) * limit;

      const [categories, total] = await Promise.all([
        CategoryModel.find(query)
          .sort(sort)
          .skip(skip)
          .limit(limit)
          .lean(),
        CategoryModel.countDocuments(query),
      ]);

      return { categories: categories as unknown as ICategory[], total };
    } catch (error) {
      logger.error('Get categories error:', error);
      throw error;
    }
  }

  async updateCategoryStatus(id: string, isActive: boolean): Promise<ICategory | null> {
    try {
      const category = await CategoryModel.findByIdAndUpdate(
        id,
        { $set: { isActive } },
        { new: true }
      ).lean();
      return category as unknown as ICategory | null;
    } catch (error) {
      logger.error('Update category status error:', error);
      throw error;
    }
  }

  async getCategoryByName(name: string): Promise<ICategory | null> {
    try {
      const category = await CategoryModel.findOne({ name }).lean();
      return category as unknown as ICategory | null;
    } catch (error) {
      logger.error('Get category by name error:', error);
      throw error;
    }
  }

  async getCategoriesByParent(parentId: string, options: any = {}): Promise<{ categories: ICategory[]; total: number }> {
    try {
      const { page = 1, limit = 10, sort = '-createdAt' } = options;
      const skip = (page - 1) * limit;

      const [categories, total] = await Promise.all([
        CategoryModel.find({ parentId })
          .sort(sort)
          .skip(skip)
          .limit(limit)
          .lean(),
        CategoryModel.countDocuments({ parentId }),
      ]);

      return { categories: categories as unknown as ICategory[], total };
    } catch (error) {
      logger.error('Get categories by parent error:', error);
      throw error;
    }
  }

  async getRootCategories(options: any = {}): Promise<{ categories: ICategory[]; total: number }> {
    try {
      const { page = 1, limit = 10, sort = '-createdAt' } = options;
      const skip = (page - 1) * limit;

      const [categories, total] = await Promise.all([
        CategoryModel.find({ parentId: null })
          .sort(sort)
          .skip(skip)
          .limit(limit)
          .lean(),
        CategoryModel.countDocuments({ parentId: null }),
      ]);

      return { categories: categories as unknown as ICategory[], total };
    } catch (error) {
      logger.error('Get root categories error:', error);
      throw error;
    }
  }

  async reorderCategories(newOrder: { id: string; displayOrder: number }[]): Promise<boolean> {
    try {
      const bulkOps = newOrder.map((item) => ({
        updateOne: {
          filter: { _id: item.id },
          update: { $set: { displayOrder: item.displayOrder } }
        }
      }));

      await CategoryModel.bulkWrite(bulkOps);
      return true;
    } catch (error) {
      logger.error('Reorder categories error:', error);
      throw error;
    }
  }
} 