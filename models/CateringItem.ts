import mongoose, {
  Document,
  Model,
  Schema,
} from "mongoose";

export type CateringPricingType =
  | "flat"
  | "per_person";

export interface ICateringItem
  extends Document {
  name: string;
  slug: string;

  description?: string;
  image?: string;

  price: number;

  pricingType: CateringPricingType;

  category?: string;

  available: boolean;
  displayOrder: number;

  minimumQuantity?: number;

  createdAt: Date;
  updatedAt: Date;
}

const CateringItemSchema =
  new Schema(
    {
      name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 150,
      },

      slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true,
      },

      description: {
        type: String,
        trim: true,
        maxlength: 1000,
      },

      image: {
        type: String,
        trim: true,
      },

      price: {
        type: Number,
        required: true,
        min: 0,
      },

      pricingType: {
        type: String,

        enum: [
          "flat",
          "per_person",
        ],

        required: true,
      },

      category: {
        type: String,
        trim: true,
        maxlength: 100,
      },

      available: {
        type: Boolean,
        default: true,
        index: true,
      },

      displayOrder: {
        type: Number,
        default: 0,
        min: 0,
      },

      minimumQuantity: {
        type: Number,
        min: 1,
      },
    },
    {
      timestamps: true,
    }
  );

CateringItemSchema.index({
  available: 1,
  displayOrder: 1,
});

const CateringItem: Model<ICateringItem> =
  mongoose.models.CateringItem ||
  mongoose.model<ICateringItem>(
    "CateringItem",
    CateringItemSchema
  );

export default CateringItem;