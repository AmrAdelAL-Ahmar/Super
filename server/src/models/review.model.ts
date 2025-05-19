import mongoose, { Document, Schema, Types } from 'mongoose';
import { IReview } from '../interfaces/models/review.interface';



export interface IReviewDocument extends Omit<IReview, '_id' |"orderId"| 'userId' | 'productId' | 'storeId'>, Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  productId: Types.ObjectId;
  storeId: Types.ObjectId;
  orderId: Types.ObjectId;
}
const reviewSchema = new Schema<IReviewDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    storeId: {
      type: Schema.Types.ObjectId,
      ref: 'Store',
      required: true,
    },
    orderId: {
      type: Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
      trim: true,
    },
    images: [{
      type: String,
    }],
    isVerified: {
      type: Boolean,
      default: false,
    },
    helpfulVotes: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes for faster queries
reviewSchema.index({ storeId: 1, createdAt: -1 });
reviewSchema.index({ userId: 1 });
reviewSchema.index({ orderId: 1 }, { unique: true });

// Method to mark review as verified
reviewSchema.methods.verify = async function(): Promise<void> {
  this.isVerified = true;
  await this.save();
};

// Method to add helpful vote
reviewSchema.methods.addHelpfulVote = async function(): Promise<void> {
  this.helpfulVotes += 1;
  await this.save();
};

// Method to remove helpful vote
reviewSchema.methods.removeHelpfulVote = async function(): Promise<void> {
  if (this.helpfulVotes > 0) {
    this.helpfulVotes -= 1;
    await this.save();
  }
};

// Static method to find reviews by store
reviewSchema.statics.findByStore = function(
  storeId: string,
  options: { limit?: number; skip?: number; sort?: string } = {}
) {
  return this.find({ storeId })
    .populate('userId', 'firstName lastName')
    .sort(options.sort || { createdAt: -1 })
    .skip(options.skip || 0)
    .limit(options.limit || 20);
};

// Static method to find reviews by user
reviewSchema.statics.findByUser = function(
  userId: string,
  options: { limit?: number; skip?: number } = {}
) {
  return this.find({ userId })
    .populate('storeId', 'name logo')
    .sort({ createdAt: -1 })
    .skip(options.skip || 0)
    .limit(options.limit || 20);
};

// Static method to get store rating statistics
reviewSchema.statics.getStoreRatingStats = async function(storeId: string) {
  const stats = await this.aggregate([
    { $match: { storeId: new mongoose.Types.ObjectId(storeId) } },
    {
      $group: {
        _id: null,
        averageRating: { $avg: '$rating' },
        totalReviews: { $sum: 1 },
        ratingDistribution: {
          $push: {
            rating: '$rating',
            count: 1,
          },
        },
      },
    },
  ]);

  if (stats.length === 0) {
    return {
      averageRating: 0,
      totalReviews: 0,
      ratingDistribution: {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
      },
    };
  }

  const distribution = stats[0].ratingDistribution.reduce((acc: any, curr: any) => {
    acc[curr.rating] = (acc[curr.rating] || 0) + curr.count;
    return acc;
  }, {});

  return {
    averageRating: stats[0].averageRating,
    totalReviews: stats[0].totalReviews,
    ratingDistribution: distribution,
  };
};

const ReviewModel = mongoose.model<IReviewDocument>('Review', reviewSchema);

export default ReviewModel; 