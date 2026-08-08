import mongoose, { Schema, Document, Model } from "mongoose";

export interface IMenuItem extends Document {
  name: string;
  description?: string;
  category: string;

  price: number;

  image?: string;

  available: boolean;

  createdAt: Date;
  updatedAt: Date;
}

const MenuItemSchema = new Schema<IMenuItem>(
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

    category: {
      type: String,
      required: true,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
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

const MenuItem: Model<IMenuItem> =
  mongoose.models.MenuItem ||
  mongoose.model<IMenuItem>("MenuItem", MenuItemSchema);

export default MenuItem;