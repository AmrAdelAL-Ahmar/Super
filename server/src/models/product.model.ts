import mongoose, { Schema } from 'mongoose';
import { IProductDocument } from '../interfaces/models/product.interface';

const productSchema = new Schema<IProductDocument>(
  {
    storeId: {
      type: Schema.Types.ObjectId,
      ref: 'Store',
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    salePrice: {
      type: Number,
      min: 0,
    },
    costPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    categories: [{
      type: Schema.Types.ObjectId,
      ref: 'Category',
    }],
    images: [{
      type: String,
    }],
    mainImage: {
      type: String,
      required: true,
    },
    sku: {
      type: String,
      required: true,
      unique: true,
    },
    barcode: {
      type: String,
    },
    weight: {
      type: Number,
      min: 0,
    },
    weightUnit: {
      type: String,
    },
    stockQuantity: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    isDiscounted: {
      type: Boolean,
      default: false,
    },
    discountPercentage: {
      type: Number,
      min: 0,
      max: 100,
    },
    attributes: {
      type: Map,
      of: String,
    },
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalReviews: {
      type: Number,
      default: 0,
      min: 0,
    },
    reviews: [{
      user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
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
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    }],
  },
  {
    timestamps: true,
  }
);

// Create text index for search
productSchema.index({ name: 'text', description: 'text' });

// Virtual for discounted price
productSchema.virtual('discountedPrice').get(function(this: IProductDocument) {
  return this.price * (1 - (this.discountPercentage || 0) / 100);
});

// Method to check if product is in stock
productSchema.methods.isInStock = function(this: IProductDocument): boolean {
  return this.stockQuantity > 0 && this.isAvailable;
};

// Method to update stock
productSchema.methods.updateStock = async function(this: IProductDocument, quantity: number): Promise<boolean> {
  if (this.stockQuantity + quantity < 0) {
    return false;
  }
  this.stockQuantity += quantity;
  await this.save();
  return true;
};

// Method to add review
productSchema.methods.addReview = async function(
  this: IProductDocument,
  userId: string,
  rating: number,
  comment: string
): Promise<void> {
  const review = {
    user: userId,
    rating,
    comment,
    createdAt: new Date(),
  };

  this.reviews.push(review);
  
  // Update average rating
  const totalRating = this.reviews.reduce((sum: number, review: any) => sum + review.rating, 0);
  this.averageRating = totalRating / this.reviews.length;
  this.totalReviews = this.reviews.length;
  
  await this.save();
};

const ProductModel = mongoose.model<IProductDocument>('Product', productSchema);

export default ProductModel; 