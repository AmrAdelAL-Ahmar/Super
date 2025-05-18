import { Request, Response } from 'express';
import { ProductService } from '../services/product.service';
import { ReviewService } from '../services/review.service';
import { sendSuccess, sendError, sendNotFound } from '../utils/response.util';
import { logger } from '../utils/logger.util';
import { IProduct } from '../interfaces/models/product.interface';

export class ProductController {
  private productService: ProductService;
  private reviewService: ReviewService;

  constructor() {
    this.productService = new ProductService();
    this.reviewService = new ReviewService();
  }

  createProduct = async (req: Request, res: Response): Promise<void> => {
    try {
      const product = await this.productService.createProduct(req.body);
      sendSuccess(res, product, 'Product created successfully');
    } catch (error) {
      logger.error('Create product controller error:', error);
      sendError(res, 'Failed to create product', error);
    }
  };

  getProductById = async (req: Request, res: Response): Promise<void> => {
    try {
      const product = await this.productService.getProductById(req.params.id);
      if (!product) {
        sendNotFound(res, 'Product not found');
        return;
      }
      sendSuccess(res, product);
    } catch (error) {
      logger.error('Get product controller error:', error);
      sendError(res, 'Failed to get product', error);
    }
  };

  updateProduct = async (req: Request, res: Response): Promise<void> => {
    try {
      const product = await this.productService.updateProduct(req.params.id, req.body);
      if (!product) {
        sendNotFound(res, 'Product not found');
        return;
      }
      sendSuccess(res, product, 'Product updated successfully');
    } catch (error) {
      logger.error('Update product controller error:', error);
      sendError(res, 'Failed to update product', error);
    }
  };

  deleteProduct = async (req: Request, res: Response): Promise<void> => {
    try {
      await this.productService.deleteProduct(req.params.id);
      sendSuccess(res, null, 'Product deleted successfully');
    } catch (error) {
      logger.error('Delete product controller error:', error);
      sendError(res, 'Failed to delete product', error);
    }
  };

  getProducts = async (req: Request, res: Response): Promise<void> => {
    try {
      const { page, limit, sort, ...query } = req.query;
      const options = { page, limit, sort };
      const result = await this.productService.getProducts(query, options);
      sendSuccess(res, result);
    } catch (error) {
      logger.error('Get products controller error:', error);
      sendError(res, 'Failed to get products', error);
    }
  };

  updateProductStatus = async (req: Request, res: Response): Promise<void> => {
    try {
      const { isActive } = req.body;
      const product = await this.productService.updateProductStatus(req.params.id, isActive);
      if (!product) {
        sendNotFound(res, 'Product not found');
        return;
      }
      sendSuccess(res, product, 'Product status updated successfully');
    } catch (error) {
      logger.error('Update product status controller error:', error);
      sendError(res, 'Failed to update product status', error);
    }
  };

  updateProductStock = async (req: Request, res: Response): Promise<void> => {
    try {
      const { quantity } = req.body;
      const product = await this.productService.updateProductStock(req.params.id, quantity);
      if (!product) {
        sendNotFound(res, 'Product not found');
        return;
      }
      sendSuccess(res, product, 'Product stock updated successfully');
    } catch (error) {
      logger.error('Update product stock controller error:', error);
      sendError(res, 'Failed to update product stock', error);
    }
  };

  getProductsByStore = async (req: Request, res: Response): Promise<void> => {
    try {
      const { page, limit, sort } = req.query;
      const options = { page, limit, sort };
      const result = await this.productService.getProductsByStore(req.params.storeId, options);
      sendSuccess(res, result);
    } catch (error) {
      logger.error('Get products by store controller error:', error);
      sendError(res, 'Failed to get products by store', error);
    }
  };

  getProductsByCategory = async (req: Request, res: Response): Promise<void> => {
    try {
      const { page, limit, sort } = req.query;
      const options = { page, limit, sort };
      const result = await this.productService.getProductsByCategory(req.params.categoryId, options);
      sendSuccess(res, result);
    } catch (error) {
      logger.error('Get products by category controller error:', error);
      sendError(res, 'Failed to get products by category', error);
    }
  };

  searchProducts = async (req: Request, res: Response): Promise<void> => {
    try {
      const { page, limit, sort } = req.query;
      const options = { page, limit, sort };
      const result = await this.productService.searchProducts(req.params.searchTerm, options);
      sendSuccess(res, result);
    } catch (error) {
      logger.error('Search products controller error:', error);
      sendError(res, 'Failed to search products', error);
    }
  };

  getProductReviews = async (req: Request, res: Response): Promise<void> => {
    try {
      const { page, limit, sort } = req.query;
      const options = { page, limit, sort };
      const result = await this.reviewService.getReviewsByProduct(req.params.id, options);
      sendSuccess(res, result);
    } catch (error) {
      logger.error('Get product reviews controller error:', error);
      sendError(res, 'Failed to get product reviews', error);
    }
  };

  updatePrice = async (req: Request, res: Response): Promise<void> => {
    try {
      const { price, compareAtPrice } = req.body;
      const productId = req.params.id;
      
      // Validate price is positive
      if (price <= 0) {
        sendError(res, 'Price must be greater than zero');
        return;
      }
      
      // Update the product with the new price
      const updateData: any = { price };
      if (compareAtPrice !== undefined) {
        updateData.compareAtPrice = compareAtPrice;
      }
      
      const updatedProduct = await this.productService.updateProduct(productId, updateData);
      if (!updatedProduct) {
        sendNotFound(res, 'Product not found');
        return;
      }
      
      sendSuccess(res, updatedProduct, 'Product price updated successfully');
    } catch (error) {
      logger.error('Update price controller error:', error);
      sendError(res, 'Failed to update product price', error);
    }
  };

  updateDiscount = async (req: Request, res: Response): Promise<void> => {
    try {
      const { discount, discountType, discountStart, discountEnd } = req.body;
      const productId = req.params.id;
      
      // Validate discount is within range
      if (discount < 0 || (discountType === 'percentage' && discount > 100)) {
        sendError(res, 'Invalid discount value');
        return;
      }
      
      const updateData: Partial<IProduct> = {
        isDiscounted: discount > 0,
        discountPercentage: discount
      };
      
      // Optional: update price calculations based on discount
      if (discount > 0) {
        const product = await this.productService.getProductById(productId);
        if (product) {
          updateData.salePrice = product.price * (1 - (discount / 100));
        }
      }
      
      const updatedProduct = await this.productService.updateProduct(productId, updateData);
      if (!updatedProduct) {
        sendNotFound(res, 'Product not found');
        return;
      }
      
      sendSuccess(res, updatedProduct, 'Product discount updated successfully');
    } catch (error) {
      logger.error('Update discount controller error:', error);
      sendError(res, 'Failed to update product discount', error);
    }
  };
} 