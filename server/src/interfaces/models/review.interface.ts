export interface IReview {
    _id: string;
    userId: string;
    storeId: string;
    orderId: string;
    rating: number;
    comment: string;
    images?: string[];
    isVerified: boolean;
    helpfulVotes: number;
    createdAt: Date;
    updatedAt: Date;
  }