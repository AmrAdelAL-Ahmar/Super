import mongoose, { Document, Schema } from 'mongoose';
import { IPayment, PaymentMethod, PaymentStatus } from 'src/interfaces/models/payment.interface';

export interface IPaymentDocument extends Omit<IPayment ,"_id"|"orderId"| "customerId">, Document {
  orderId: Schema.Types.ObjectId;
  customerId: Schema.Types.ObjectId;
}

const paymentSchema = new Schema<IPaymentDocument>(
  {
    orderId: {
      type: Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
    },
    customerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    method: {
      type: String,
      enum: Object.values(PaymentMethod),
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(PaymentStatus),
      default: PaymentStatus.PENDING,
    },
    transactionId: {
      type: String,
      unique: true,
      sparse: true,
    },
    transactionDetails: {
      type: Map,
      of: Schema.Types.Mixed,
    },
    refundId: {
      type: String,
      unique: true,
      sparse: true,
    },
    refundAmount: {
      type: Number,
      min: 0,
    },
    refundDetails: {
      reason: String,
      refundedAt: Date
    },
    refundReason: String,
  },
  {
    timestamps: true,
  }
);

// Method to update payment status
paymentSchema.methods.updateStatus = async function(
  status: PaymentStatus,
  transactionId?: string,
  transactionDetails?: Record<string, any>
): Promise<void> {
  this.status = status;
  
  if (transactionId) {
    this.transactionId = transactionId;
  }
  
  if (transactionDetails) {
    this.transactionDetails = transactionDetails;
  }

  await this.save();
};

// Method to process refund
paymentSchema.methods.processRefund = async function(
  refundAmount: number,
  reason: string,
  refundId: string
): Promise<void> {
  if (refundAmount > this.amount) {
    throw new Error('Refund amount cannot exceed payment amount');
  }

  this.status = PaymentStatus.REFUNDED;
  this.refundAmount = refundAmount;
  this.refundReason = reason;
  this.refundId = refundId;

  await this.save();
};

// Static method to find payments by customer
paymentSchema.statics.findByCustomer = function(customerId: string) {
  return this.find({ customerId })
    .populate('orderId')
    .sort({ createdAt: -1 });
};

// Static method to find payments by order
paymentSchema.statics.findByOrder = function(orderId: string) {
  return this.find({ orderId })
    .populate('customerId')
    .sort({ createdAt: -1 });
};

const PaymentModel = mongoose.model<IPaymentDocument>('Payment', paymentSchema);

export default PaymentModel; 
export const Payment = mongoose.model<IPaymentDocument>('Payment', paymentSchema); 