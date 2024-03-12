import mongoose, { Document, Schema } from "mongoose";

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  quantity: number;
  category?: string;
  brand?: string;
  images?: string[];
  version: number;
}

const productSchema: Schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
  },
  brand: String,
  images: [String],
  version: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

export default mongoose.model<IProduct>("Product", productSchema);
