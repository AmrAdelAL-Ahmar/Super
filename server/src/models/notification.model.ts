import mongoose, { Document, Schema, Types } from 'mongoose';
import { INotification, NotificationType } from '../interfaces/models/notification.interface';

export interface INotificationDocument extends Omit<INotification, '_id' | "userId" | "metadata">, Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  metadata: Map<string, any>;
}

const notificationSchema = new Schema<INotificationDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: Object.values(NotificationType),
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    metadata: {
      type: Map,
      of: Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
  }
);

// Create index for faster queries
notificationSchema.index({ userId: 1, createdAt: -1 });
notificationSchema.index({ userId: 1, isRead: 1 });

// Method to mark notification as read
notificationSchema.methods.markAsRead = async function(): Promise<void> {
  this.isRead = true;
  await this.save();
};

// Method to mark notification as unread
notificationSchema.methods.markAsUnread = async function(): Promise<void> {
  this.isRead = false;
  await this.save();
};

// Static method to find notifications by user
notificationSchema.statics.findByUser = function(
  userId: string,
  options: { limit?: number; skip?: number; isRead?: boolean } = {}
) {
  const query: any = { userId };
  
  if (options.isRead !== undefined) {
    query.isRead = options.isRead;
  }

  return this.find(query)
    .sort({ createdAt: -1 })
    .skip(options.skip || 0)
    .limit(options.limit || 20);
};

// Static method to mark all notifications as read
notificationSchema.statics.markAllAsRead = async function(userId: string): Promise<void> {
  await this.updateMany(
    { userId, isRead: false },
    { $set: { isRead: true } }
  );
};

// Static method to get unread count
notificationSchema.statics.getUnreadCount = async function(userId: string): Promise<number> {
  return this.countDocuments({ userId, isRead: false });
};

const NotificationModel = mongoose.model<INotificationDocument>('Notification', notificationSchema);

export default NotificationModel; 