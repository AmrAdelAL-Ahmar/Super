import { Response } from 'express';
import { ReviewService } from '../services/review.service';
import { logger } from '../utils/logger.util';
import { AuthRequest } from '../interfaces/auth.interface';
import { reviewValidation } from '../validations/review.validation';
import { validateSchema } from '../middleware/validation.middleware';

export class ReviewController {
  private reviewService: ReviewService;

  constructor() {
    this.reviewService = new ReviewService();
  }

  createReview = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.user?._id) {
        res.status(401).json({
          success: false,
          message: 'Unauthorized'
        });
        return;
      }

      const validatedData = await validateSchema(reviewValidation.createReview, req.body);
      const review = await this.reviewService.createReview({
        ...validatedData,
        userId: req.user._id
      });
      res.status(201).json({
        success: true,
        data: review
      });
    } catch (error) {
      logger.error('Create review error:', error);
      res.status(500).json({
        success: false,
        message: 'Error creating review'
      });
    }
  };

  getReviewById = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const review = await this.reviewService.getReviewById(req.params.id);
      if (!review) {
        res.status(404).json({
          success: false,
          message: 'Review not found'
        });
        return;
      }
      res.status(200).json({
        success: true,
        data: review
      });
    } catch (error) {
      logger.error('Get review error:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting review'
      });
    }
  };

  updateReview = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.user?._id) {
        res.status(401).json({
          success: false,
          message: 'Unauthorized'
        });
        return;
      }

      const validatedData = await validateSchema(reviewValidation.updateReview, req.body);
      const review = await this.reviewService.updateReview(req.params.id, validatedData);
      if (!review) {
        res.status(404).json({
          success: false,
          message: 'Review not found'
        });
        return;
      }
      res.status(200).json({
        success: true,
        data: review
      });
    } catch (error) {
      logger.error('Update review error:', error);
      res.status(500).json({
        success: false,
        message: 'Error updating review'
      });
    }
  };

  deleteReview = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.user?._id) {
        res.status(401).json({
          success: false,
          message: 'Unauthorized'
        });
        return;
      }

      await this.reviewService.deleteReview(req.params.id);
      res.status(200).json({
        success: true,
        message: 'Review deleted successfully'
      });
    } catch (error) {
      logger.error('Delete review error:', error);
      res.status(500).json({
        success: false,
        message: 'Error deleting review'
      });
    }
  };

  getReviewsByProduct = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const validatedData = await validateSchema(reviewValidation.getReviewsByProduct, req.query);
      const result = await this.reviewService.getReviewsByProduct(req.params.productId, {
        page: Number(validatedData.page),
        limit: Number(validatedData.limit),
        sort: validatedData.sort
      });
      res.status(200).json({
        success: true,
        data: result.reviews,
        total: result.total
      });
    } catch (error) {
      logger.error('Get reviews by product error:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting reviews'
      });
    }
  };

  getReviewsByUser = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.user?._id) {
        res.status(401).json({
          success: false,
          message: 'Unauthorized'
        });
        return;
      }

      const validatedData = await validateSchema(reviewValidation.getReviewsByUser, req.query);
      const result = await this.reviewService.getReviewsByUser(req.user._id, {
        page: Number(validatedData.page),
        limit: Number(validatedData.limit),
        sort: validatedData.sort
      });
      res.status(200).json({
        success: true,
        data: result.reviews,
        total: result.total
      });
    } catch (error) {
      logger.error('Get reviews by user error:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting reviews'
      });
    }
  };

  getProductRating = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const rating = await this.reviewService.getProductRating(req.params.productId);
      res.status(200).json({
        success: true,
        data: rating
      });
    } catch (error) {
      logger.error('Get product rating error:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting product rating'
      });
    }
  };

  getReviews = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.user?._id) {
        res.status(401).json({
          success: false,
          message: 'Unauthorized'
        });
        return;
      }

      const { page, limit, sort, ...filters } = req.query;
      
      const result = await this.reviewService.getReviews({
        page: Number(page) || 1,
        limit: Number(limit) || 10,
        sort: sort as string || '-createdAt',
        ...filters
      });
      
      res.status(200).json({
        success: true,
        data: result.reviews,
        total: result.total
      });
    } catch (error) {
      logger.error('Get all reviews error:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting all reviews'
      });
    }
  };
} 