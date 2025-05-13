const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    deliveryPerson: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: [1, 'Quantity must be at least 1'],
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
      min: [0, 'Total amount must be positive'],
    },
    status: {
      type: String,
      enum: [
        'pending',
        'confirmed',
        'preparing',
        'out_for_delivery',
        'delivered',
        'cancelled',
      ],
      default: 'pending',
    },
    paymentMethod: {
      type: String,
      enum: ['cash', 'card', 'online'],
      default: 'cash',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid'],
      default: 'pending',
    },
    deliveryAddress: {
      address: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      coordinates: {
        lat: {
          type: Number,
          required: true,
        },
        lng: {
          type: Number,
          required: true,
        },
      },
    },
    notes: {
      type: String,
      maxlength: [500, 'Notes cannot be more than 500 characters'],
    },
    deliveryTime: {
      type: Date,
    },
    confirmedAt: {
      type: Date,
    },
    deliveredAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Add index for faster queries
OrderSchema.index({ customer: 1, createdAt: -1 });
OrderSchema.index({ owner: 1, status: 1 });
OrderSchema.index({ deliveryPerson: 1, status: 1 });

// Static method to calculate order total
OrderSchema.statics.calculateTotal = function (items) {
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
};

module.exports = mongoose.model('Order', OrderSchema); 