import { IProduct } from '../interfaces/models/product.interface';
import { logger } from '../utils/logger.util';
import ProductModel from '../models/product.model';
import { Types } from 'mongoose';

export class ProductService {
  async createProduct(productData: Partial<IProduct>): Promise<IProduct> {
    try {
      const product = await ProductModel.create(productData);
      return product.toObject() as IProduct;
    } catch (error) {
      logger.error('Create product error:', error);
      throw error;
    }
  }

  async getProductById(id: string): Promise<IProduct | null> {
    try {
      const product = await ProductModel.findById(id)
        .populate('storeId', 'name')
        .populate('categoryId', 'name')
        .lean();
      return product as unknown as IProduct | null;
    } catch (error) {
      logger.error('Get product error:', error);
      throw error;
    }
  }

  async updateProduct(id: string, updateData: Partial<IProduct>): Promise<IProduct | null> {
    try {
      const product = await ProductModel.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true }
      )
        .populate('storeId', 'name')
        .populate('categoryId', 'name')
        .lean();
      return product as unknown as IProduct | null;
    } catch (error) {
      logger.error('Update product error:', error);
      throw error;
    }
  }

  async deleteProduct(id: string): Promise<void> {
    try {
      await ProductModel.findByIdAndDelete(id);
    } catch (error) {
      logger.error('Delete product error:', error);
      throw error;
    }
  }

  async getProducts(query: any = {}, options: any = {}): Promise<{ products: IProduct[]; total: number }> {
    try {
      const { page = 1, limit = 10, sort = '-createdAt' } = options;
      const skip = (page - 1) * limit;

      const [products, total] = await Promise.all([
        ProductModel.find(query)
          .populate('storeId', 'name')
          .populate('categoryId', 'name')
          .sort(sort)
          .skip(skip)
          .limit(limit)
          .lean(),
        ProductModel.countDocuments(query),
      ]);

      return { products: products as unknown as IProduct[], total };
    } catch (error) {
      logger.error('Get products error:', error);
      throw error;
    }
  }

  async updateProductStatus(id: string, isActive: boolean): Promise<IProduct | null> {
    try {
      const product = await ProductModel.findByIdAndUpdate(
        id,
        { $set: { isActive } },
        { new: true }
      )
        .populate('storeId', 'name')
        .populate('categoryId', 'name')
        .lean();
      return product as unknown as IProduct | null;
    } catch (error) {
      logger.error('Update product status error:', error);
      throw error;
    }
  }

  async updateProductStock(id: string, quantity: number): Promise<IProduct | null> {
    try {
      const product = await ProductModel.findByIdAndUpdate(
        id,
        { $inc: { stockQuantity: quantity } },
        { new: true }
      )
        .populate('storeId', 'name')
        .populate('categoryId', 'name')
        .lean();
      return product as unknown as IProduct | null;
    } catch (error) {
      logger.error('Update product stock error:', error);
      throw error;
    }
  }

  async getProductsByStore(storeId: string, options: any = {}): Promise<{ products: IProduct[]; total: number }> {
    try {
      const { page = 1, limit = 10, sort = '-createdAt' } = options;
      const skip = (page - 1) * limit;

      const [products, total] = await Promise.all([
        ProductModel.find({ storeId })
          .populate('storeId', 'name')
          .populate('categoryId', 'name')
          .sort(sort)
          .skip(skip)
          .limit(limit)
          .lean(),
        ProductModel.countDocuments({ storeId }),
      ]);

      return { products: products as unknown as IProduct[], total };
    } catch (error) {
      logger.error('Get products by store error:', error);
      throw error;
    }
  }

  async getProductsByCategory(categoryId: string, options: any = {}): Promise<{ products: IProduct[]; total: number }> {
    try {
      const { page = 1, limit = 10, sort = '-createdAt' } = options;
      const skip = (page - 1) * limit;

      const [products, total] = await Promise.all([
        ProductModel.find({ categoryId })
          .populate('storeId', 'name')
          .populate('categoryId', 'name')
          .sort(sort)
          .skip(skip)
          .limit(limit)
          .lean(),
        ProductModel.countDocuments({ categoryId }),
      ]);

      return { products: products as unknown as IProduct[], total };
    } catch (error) {
      logger.error('Get products by category error:', error);
      throw error;
    }
  }

  async searchProducts(searchTerm: string, options: any = {}): Promise<{ products: IProduct[]; total: number }> {
    try {
      const { page = 1, limit = 10, sort = '-createdAt' } = options;
      const skip = (page - 1) * limit;

      const searchQuery = {
        $or: [
          { name: { $regex: searchTerm, $options: 'i' } },
          { description: { $regex: searchTerm, $options: 'i' } },
        ],
      };

      const [products, total] = await Promise.all([
        ProductModel.find(searchQuery)
          .populate('storeId', 'name')
          .populate('categoryId', 'name')
          .sort(sort)
          .skip(skip)
          .limit(limit)
          .lean(),
        ProductModel.countDocuments(searchQuery),
      ]);

      return { products: products as unknown as IProduct[], total };
    } catch (error) {
      logger.error('Search products error:', error);
      throw error;
    }
  }
} 