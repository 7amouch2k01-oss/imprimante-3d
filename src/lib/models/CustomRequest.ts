import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICustomRequest extends Document {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  category: string;
  customText?: string;
  colorPreference?: string;
  dimensions?: string;
  notes?: string;
  status: 'PENDING' | 'IN_REVIEW' | 'ACCEPTED' | 'IN_PRODUCTION' | 'COMPLETED';
  createdAt: Date;
  updatedAt: Date;
}

const CustomRequestSchema = new Schema<ICustomRequest>(
  {
    customerName: { type: String, required: true, trim: true },
    customerPhone: { type: String, required: true, trim: true },
    customerEmail: { type: String, trim: true, lowercase: true },
    category: {
      type: String,
      required: true,
      enum: [
        'KEYCHAINS',
        'PHONE_STANDS',
        'GAMING_ACCESSORIES',
        'DECORATION',
        'GIFTS',
        'PIGGY_BANKS',
        'UTILITY',
        'OTHER',
      ],
      default: 'KEYCHAINS',
    },
    customText: { type: String, trim: true }, // Name, date, car brand, logo description
    colorPreference: { type: String, trim: true }, // e.g. Black, White, Gold, Silk Green
    dimensions: { type: String, trim: true }, // e.g. 10x5cm
    notes: { type: String, trim: true },
    status: {
      type: String,
      enum: ['PENDING', 'IN_REVIEW', 'ACCEPTED', 'IN_PRODUCTION', 'COMPLETED'],
      default: 'PENDING',
    },
  },
  { timestamps: true }
);

const CustomRequest: Model<ICustomRequest> =
  mongoose.models.CustomRequest ||
  mongoose.model<ICustomRequest>('CustomRequest', CustomRequestSchema);

export default CustomRequest;
