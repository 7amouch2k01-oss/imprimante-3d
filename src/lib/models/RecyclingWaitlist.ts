import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IRecyclingWaitlist extends Document {
  email: string;
  preferredLanguage: 'en' | 'fr';
  createdAt: Date;
}

const RecyclingWaitlistSchema = new Schema<IRecyclingWaitlist>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    preferredLanguage: { type: String, enum: ['en', 'fr'], default: 'en' },
  },
  { timestamps: true }
);

RecyclingWaitlistSchema.index({ email: 1 });

const RecyclingWaitlist: Model<IRecyclingWaitlist> =
  mongoose.models.RecyclingWaitlist ||
  mongoose.model<IRecyclingWaitlist>('RecyclingWaitlist', RecyclingWaitlistSchema);

export default RecyclingWaitlist;
