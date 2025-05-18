import { IReview } from '../interfaces/models/review.interface';
import { logger } from '../utils/logger.util';
import ReviewModel from '../models/review.model';
import { Types } from 'mongoose';

export class ReviewService {
  async createReview(reviewData: Partial<IReview>): Promise<IReview> {
    try {
      const review = await ReviewModel.create(reviewData);
      return review.toObject() as IReview;
    } catch (error) {
      logger.error('Create review error:', error);
      throw error;
    }
  }

  async getReviewById(id: string): Promise<IReview | null> {
    try {
      return await ReviewModel.findById(id)
        .populate('userId', 'firstName lastName')
        .populate('productId', 'name images');
    } catch (error) {
      logger.error('Get review error:', error);
      throw error;
    }
  }

  async updateReview(id: string, updateData: Partial<IReview>): Promise<IReview | null> {
    try {
      return await ReviewModel.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true }
      );
    } catch (error) {
      logger.error('Update review error:', error);
      throw error;
    }
  }

  async deleteReview(id: string): Promise<void> {
    try {
      await ReviewModel.findByIdAndDelete(id);
    } catch (error) {
      logger.error('Delete review error:', error);
      throw error;
    }
  }

  async getReviewsByProduct(productId: string, options: any = {}): Promise<{ reviews: IReview[]; total: number }> {
    try {
      const { page = 1, limit = 10, sort = '-createdAt' } = options;
      const skip = (page - 1) * limit;

      const [reviews, total] = await Promise.all([
        ReviewModel.find({ productId })
          .populate('userId', 'firstName lastName')
          .sort(sort)
          .skip(skip)
          .limit(limit),
        ReviewModel.countDocuments({ productId })
      ]);

      return { reviews: reviews.map(review => review.toObject() as IReview), total };
    } catch (error) {
      logger.error('Get product reviews error:', error);
      throw error;
    }
  }

  async getReviewsByUser(userId: string, options: any = {}): Promise<{ reviews: IReview[]; total: number }> {
    try {
      const { page = 1, limit = 10, sort = '-createdAt' } = options;
      const skip = (page - 1) * limit;

      const [reviews, total] = await Promise.all([
        ReviewModel.find({ userId })
          .populate('productId', 'name images')
          .sort(sort)
          .skip(skip)
          .limit(limit),
        ReviewModel.countDocuments({ userId })
      ]);

      return { reviews: reviews.map(review => review.toObject() as IReview), total };
    } catch (error) {
      logger.error('Get user reviews error:', error);
      throw error;
    }
  }

  async getProductAverageRating(productId: string): Promise<number> {
    try {
      const result = await ReviewModel.aggregate([
        { $match: { productId: new Types.ObjectId(productId) } },
        { $group: { _id: null, averageRating: { $avg: '$rating' } } }
      ]);

      return result[0]?.averageRating || 0;
    } catch (error) {
      logger.error('Get product average rating error:', error);
      throw error;
    }
  }

  async checkUserReviewExists(userId: string, productId: string): Promise<boolean> {
    try {
      const review = await ReviewModel.findOne({ userId, productId });
      return !!review;
    } catch (error) {
      logger.error('Check user review exists error:', error);
      throw error;
    }
  }

  async getProductRating(productId: string): Promise<{
    averageRating: number;
    totalReviews: number;
    ratingDistribution: {
      [key: number]: number;
    };
  }> {
    try {
      const reviews = await ReviewModel.find({ productId });
      const totalReviews = reviews.length;

      if (totalReviews === 0) {
        return {
          averageRating: 0,
          totalReviews: 0,
          ratingDistribution: {
            1: 0,
            2: 0,
            3: 0,
            4: 0,
            5: 0
          }
        };
      }

      const ratingDistribution = {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0
      };

      let totalRating = 0;
      reviews.forEach((review) => {
        const reviewObj = review.toObject();
        const rating = reviewObj.rating as keyof typeof ratingDistribution;
        ratingDistribution[rating]++;
        totalRating += reviewObj.rating;
      });

      return {
        averageRating: Number((totalRating / totalReviews).toFixed(1)),
        totalReviews,
        ratingDistribution
      };
    } catch (error) {
      logger.error('Error getting product rating:', error);
      throw error;
    }
  }

  async getReviews(options: any = {}): Promise<{ reviews: IReview[]; total: number }> {
    try {
      const { page = 1, limit = 10, sort = '-createdAt', ...filters } = options;
      const skip = (page - 1) * limit;

      const [reviews, total] = await Promise.all([
        ReviewModel.find(filters)
          .populate('userId', 'firstName lastName')
          .populate('productId', 'name images')
          .sort(sort)
          .skip(skip)
          .limit(limit),
        ReviewModel.countDocuments(filters)
      ]);

      return { 
        reviews: reviews.map(review => review.toObject() as IReview ), 
        total 
      };
    } catch (error) {
      logger.error('Get all reviews error:', error);
      throw error;
    }
  }
} 