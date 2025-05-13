const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a product name'],
      trim: true,
      maxlength: [100, 'Name cannot be more than 100 characters'],
    },
    nameAr: {
      type: String,
      required: [true, 'Please add an Arabic product name'],
      trim: true,
      maxlength: [100, 'Name cannot be more than 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
      maxlength: [500, 'Description cannot be more than 500 characters'],
    },
    descriptionAr: {
      type: String,
      required: [true, 'Please add an Arabic description'],
      maxlength: [500, 'Description cannot be more than 500 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Please add a price'],
      min: [0, 'Price must be positive'],
    },
    image: {
      type: String,
      default: 'no-image.jpg',
    },
    category: {
      type: String,
      required: [true, 'Please add a category'],
      enum: [
        'fruits',
        'vegetables',
        'dairy',
        'bakery',
        'meat',
        'seafood',
        'beverages',
        'snacks',
        'household',
        'personal',
        'other',
      ],
    },
    stock: {
      type: Number,
      required: [true, 'Please add stock quantity'],
      min: [0, 'Stock cannot be negative'],
      default: 0,
    },
    unit: {
      type: String,
      required: [true, 'Please add a unit'],
      enum: ['kg', 'g', 'l', 'ml', 'piece', 'pack'],
      default: 'piece',
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    discount: {
      type: Number,
      min: [0, 'Discount cannot be negative'],
      max: [100, 'Discount cannot exceed 100%'],
      default: 0,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Add virtual for discounted price
ProductSchema.virtual('discountedPrice').get(function () {
  return this.price - (this.price * this.discount) / 100;
});

module.exports = mongoose.model('Product', ProductSchema); 