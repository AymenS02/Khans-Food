import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICateringPackage extends Document {
  name: string;
  description?: string;

  price: number;

  servesMin?: number;
  servesMax?: number;

  image?: string;

  available: boolean;

  createdAt: Date;
  updatedAt: Date;
}

const CateringPackageSchema = new Schema<ICateringPackage>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    servesMin: {
      type: Number,
      min: 1,
    },

    servesMax: {
      type: Number,
      min: 1,
    },

    image: {
      type: String,
    },

    available: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const CateringPackage: Model<ICateringPackage> =
  mongoose.models.CateringPackage ||
  mongoose.model<ICateringPackage>(
    "CateringPackage",
    CateringPackageSchema
  );

export default CateringPackage;