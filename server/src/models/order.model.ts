import mongoose, { Document, Schema, Types } from 'mongoose';
import { IOrder, OrderStatus } from '../interfaces/models/order.interface';
import { PaymentMethod, PaymentStatus } from '../interfaces/models/payment.interface';

export interface IOrderDocument extends Omit<IOrder, '_id' | "customerId" | "storeId" | "paymentId" | "deliveryAddressId" | "deliveryEmployeeId">, Document {
  _id: Types.ObjectId;
  customerId: Types.ObjectId;
  storeId: Types.ObjectId;
  paymentId: Types.ObjectId;
  deliveryAddressId: Types.ObjectId;
  deliveryEmployeeId: Types.ObjectId;
}

const orderSchema = new Schema<IOrderDocument>(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
    },
    customerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    storeId: {
      type: Schema.Types.ObjectId,
      ref: 'Store',
      required: true,
    },
    items: [{
      productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
      price: {
        type: Number,
        required: true,
        min: 0,
      },
      totalPrice: {
        type: Number,
        required: true,
        min: 0,
      },
      image: String,
    }],
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
    tax: {
      type: Number,
      required: true,
      min: 0,
    },
    deliveryFee: {
      type: Number,
      required: true,
      min: 0,
    },
    discount: {
      type: Number,
      default: 0,
      min: 0,
    },
    total: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: Object.values(OrderStatus),
      default: OrderStatus.PENDING,
    },
    paymentId: {
      type: Schema.Types.ObjectId,
      ref: 'Payment',
    },
    paymentMethod: {
      type: String,
      enum: Object.values(PaymentMethod),
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: Object.values(PaymentStatus),
      default: PaymentStatus.PENDING,
    },
    deliveryAddressId: {
      type: Schema.Types.ObjectId,
      ref: 'Address',
      required: true,
    },
    deliveryEmployeeId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    deliveryNotes: String,
    estimatedDeliveryTime: Date,
    actualDeliveryTime: Date,
    cancelReason: String,
  },
  {
    timestamps: true,
  }
);

// Generate order number before saving
orderSchema.pre('save', async function(next) {
  if (this.isNew) {
    const count = await mongoose.model('Order').countDocuments();
    this.orderNumber = `ORD${Date.now()}${count + 1}`;
  }
  next();
});

// Method to update order status
orderSchema.methods.updateStatus = async function(
  status: OrderStatus,
  metadata?: { deliveryEmployeeId?: string; cancelReason?: string }
): Promise<void> {
  this.status = status;
  
  if (metadata) {
    if (metadata.deliveryEmployeeId) {
      this.deliveryEmployeeId = metadata.deliveryEmployeeId;
    }
    if (metadata.cancelReason) {
      this.cancelReason = metadata.cancelReason;
    }
  }

  if (status === OrderStatus.DELIVERED) {
    this.actualDeliveryTime = new Date();
  }

  await this.save();
};

// Method to update payment status
orderSchema.methods.updatePaymentStatus = async function(
  status: PaymentStatus,
  paymentId: string
): Promise<void> {
  this.paymentStatus = status;
  this.paymentId = paymentId;
  await this.save();
};

// Method to calculate delivery time
orderSchema.methods.calculateDeliveryTime = function(): Date {
  const now = new Date();
  // Add 30 minutes to current time as estimated delivery time
  return new Date(now.getTime() + 30 * 60000);
};

const OrderModel = mongoose.model<IOrderDocument>('Order', orderSchema);

export default OrderModel; 