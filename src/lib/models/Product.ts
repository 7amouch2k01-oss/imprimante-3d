import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ITranslation {
  languageCode: string;
  name: string;
  description: string;
  specs: Record<string, string>;
}

export interface IProduct extends Document {
  slug: string;
  price: number;
  comparePrice?: number;
  stock: number;
  images: string[];
  category: 'PRINTER' | 'RECYCLING_EQUIPMENT';
  featured: boolean;
  translations: ITranslation[];
  createdAt: Date;
  updatedAt: Date;
}

const TranslationSchema = new Schema<ITranslation>(
  {
    languageCode: { type: String, required: true, enum: ['en', 'fr'] },
    name: { type: String, required: true },
    description: { type: String, required: true },
    specs: { type: Map, of: String, default: {} },
  },
  { _id: false }
);

const ProductSchema = new Schema<IProduct>(
  {
    slug: { type: String, required: true, unique: true, index: true },
    price: { type: Number, required: true },
    comparePrice: { type: Number },
    stock: { type: Number, required: true, default: 0 },
    images: [{ type: String }],
    category: {
      type: String,
      enum: ['PRINTER', 'RECYCLING_EQUIPMENT'],
      default: 'PRINTER',
    },
    featured: { type: Boolean, default: false },
    translations: [TranslationSchema],
  },
  { timestamps: true }
);

const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);

export default Product;
