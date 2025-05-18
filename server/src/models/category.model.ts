import mongoose, { Document, Schema, Types } from 'mongoose';
import { ICategory } from '../interfaces/models/product.interface';

export interface ICategoryDocument extends Omit<ICategory, '_id' | "parentId">, Document {
  _id: Types.ObjectId;
  parentId: Types.ObjectId;
}

const categorySchema = new Schema<ICategoryDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
    },
    parentId: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create index for faster queries
categorySchema.index({ name: 'text' });
categorySchema.index({ parentId: 1 });

// Virtual for full path
categorySchema.virtual('path').get(function() {
  return this.parentId ? `${this.parentId}/${this._id}` : this._id.toString();
});

// Method to get all subcategories
categorySchema.methods.getSubcategories = async function(): Promise<ICategoryDocument[]> {
  return mongoose.model('Category').find({ parentId: this._id });
};

// Method to get all parent categories
categorySchema.methods.getParentCategories = async function(): Promise<ICategoryDocument[]> {
  const parents: ICategoryDocument[] = [];
  let currentCategory: ICategoryDocument | null = this as ICategoryDocument;

  while (currentCategory?.parentId) {
    currentCategory = await mongoose.model('Category').findById(currentCategory.parentId);
    if (currentCategory) {
      parents.unshift(currentCategory);
    }
  }

  return parents;
};

// Static method to get category tree
categorySchema.statics.getCategoryTree = async function(): Promise<ICategoryDocument[]> {
  const categories = await this.find().sort({ name: 1 });
  const categoryMap = new Map();
  const tree: ICategoryDocument[] = [];

  // First pass: create a map of all categories
  categories.forEach((category: ICategoryDocument) => {
    categoryMap.set(category._id.toString(), {
      ...category.toObject(),
      children: [],
    });
  });

  // Second pass: build the tree
  categories.forEach((category: ICategoryDocument) => {
    const categoryObj = categoryMap.get(category._id.toString());
    if (category.parentId) {
      const parent = categoryMap.get(category.parentId.toString());
      if (parent) {
        parent.children.push(categoryObj);
      }
    } else {
      tree.push(categoryObj);
    }
  });

  return tree;
};

const CategoryModel = mongoose.model<ICategoryDocument>('Category', categorySchema);

export default CategoryModel; 