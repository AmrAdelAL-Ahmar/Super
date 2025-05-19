import { Request, Response } from 'express';
import { CategoryService } from '../services/category.service';
import { ProductService } from '../services/product.service';
import { sendSuccess, sendError, sendNotFound } from '../utils/response.util';
import { logger } from '../utils/logger.util';

export class CategoryController {
  private categoryService: CategoryService;
  private productService: ProductService;

  constructor() {
    this.categoryService = new CategoryService();
    this.productService = new ProductService();
  }

  createCategory = async (req: Request, res: Response): Promise<void> => {
    try {
      const category = await this.categoryService.createCategory(req.body);
      sendSuccess(res, category, 'Category created successfully');
    } catch (error) {
      logger.error('Create category controller error:', error);
      sendError(res, 'Failed to create category', error);
    }
  };

  getCategoryById = async (req: Request, res: Response): Promise<void> => {
    try {
      const category = await this.categoryService.getCategoryById(req.params.id);
      if (!category) {
        sendNotFound(res, 'Category not found');
        return;
      }
      sendSuccess(res, category);
    } catch (error) {
      logger.error('Get category controller error:', error);
      sendError(res, 'Failed to get category', error);
    }
  };

  updateCategory = async (req: Request, res: Response): Promise<void> => {
    try {
      const category = await this.categoryService.updateCategory(req.params.id, req.body);
      if (!category) {
        sendNotFound(res, 'Category not found');
        return;
      }
      sendSuccess(res, category, 'Category updated successfully');
    } catch (error) {
      logger.error('Update category controller error:', error);
      sendError(res, 'Failed to update category', error);
    }
  };

  deleteCategory = async (req: Request, res: Response): Promise<void> => {
    try {
      await this.categoryService.deleteCategory(req.params.id);
      sendSuccess(res, null, 'Category deleted successfully');
    } catch (error) {
      logger.error('Delete category controller error:', error);
      sendError(res, 'Failed to delete category', error);
    }
  };

  getCategories = async (req: Request, res: Response): Promise<void> => {
    try {
      const { page, limit, sort, ...query } = req.query;
      const options = { page, limit, sort };
      const result = await this.categoryService.getCategories(query, options);
      sendSuccess(res, result);
    } catch (error) {
      logger.error('Get categories controller error:', error);
      sendError(res, 'Failed to get categories', error);
    }
  };

  updateCategoryStatus = async (req: Request, res: Response): Promise<void> => {
    try {
      const { isActive } = req.body;
      const category = await this.categoryService.updateCategoryStatus(req.params.id, isActive);
      if (!category) {
        sendNotFound(res, 'Category not found');
        return;
      }
      sendSuccess(res, category, 'Category status updated successfully');
    } catch (error) {
      logger.error('Update category status controller error:', error);
      sendError(res, 'Failed to update category status', error);
    }
  };

  getCategoryByName = async (req: Request, res: Response): Promise<void> => {
    try {
      const category = await this.categoryService.getCategoryByName(req.params.name);
      if (!category) {
        sendNotFound(res, 'Category not found');
        return;
      }
      sendSuccess(res, category);
    } catch (error) {
      logger.error('Get category by name controller error:', error);
      sendError(res, 'Failed to get category by name', error);
    }
  };

  getCategoriesByParent = async (req: Request, res: Response): Promise<void> => {
    try {
      const { page, limit, sort } = req.query;
      const options = { page, limit, sort };
      const result = await this.categoryService.getCategoriesByParent(req.params.parentId, options);
      sendSuccess(res, result);
    } catch (error) {
      logger.error('Get categories by parent controller error:', error);
      sendError(res, 'Failed to get categories by parent', error);
    }
  };

  getRootCategories = async (req: Request, res: Response): Promise<void> => {
    try {
      const { page, limit, sort } = req.query;
      const options = { page, limit, sort };
      const result = await this.categoryService.getRootCategories(options);
      sendSuccess(res, result);
    } catch (error) {
      logger.error('Get root categories controller error:', error);
      sendError(res, 'Failed to get root categories', error);
    }
  };

  getCategoryProducts = async (req: Request, res: Response): Promise<void> => {
    try {
      const { page, limit, sort } = req.query;
      const options = { page, limit, sort };
      const result = await this.productService.getProductsByCategory(req.params.id, options);
      sendSuccess(res, result);
    } catch (error) {
      logger.error('Get category products controller error:', error);
      sendError(res, 'Failed to get category products', error);
    }
  };

  reorderCategories = async (req: Request, res: Response): Promise<void> => {
    try {
      const { newOrder } = req.body;
      const result = await this.categoryService.reorderCategories(newOrder);
      sendSuccess(res, result, 'Categories reordered successfully');
    } catch (error) {
      logger.error('Reorder categories controller error:', error);
      sendError(res, 'Failed to reorder categories', error);
    }
  };

  updateVisibility = async (req: Request, res: Response): Promise<void> => {
    try {
      const { isActive } = req.body;
      const category = await this.categoryService.updateCategoryStatus(req.params.id, isActive);
      if (!category) {
        sendNotFound(res, 'Category not found');
        return;
      }
      sendSuccess(res, category, 'Category visibility updated successfully');
    } catch (error) {
      logger.error('Update visibility controller error:', error);
      sendError(res, 'Failed to update category visibility', error);
    }
  };
} 