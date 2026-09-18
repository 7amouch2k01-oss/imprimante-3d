import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IReview extends Document {
  rating: number;
  comment?: string;
  userId: mongoose.Types.ObjectId;
  productId: mongoose.Types.ObjectId;
  createdAt: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  },
  { timestamps: true }
);

ReviewSchema.index({ productId: 1 });
ReviewSchema.index({ userId: 1 });

const Review: Model<IReview> =
  mongoose.models.Review || mongoose.model<IReview>('Review', ReviewSchema);

export default Review;
