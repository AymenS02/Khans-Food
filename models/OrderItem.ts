import mongoose, { Schema, Document, Model } from "mongoose";

export interface IOrderItem extends Document {
  orderId: mongoose.Types.ObjectId;

  menuItemId?: mongoose.Types.ObjectId;

  // Snapshot of item at time of order
  name: string;
  price: number;

  quantity: number;

  total: number;

  notes?: string;
}

const OrderItemSchema = new Schema<IOrderItem>(
  {
    orderId: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },

    menuItemId: {
      type: Schema.Types.ObjectId,
      ref: "MenuItem",
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    total: {
      type: Number,
      required: true,
      min: 0,
    },

    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

OrderItemSchema.index({
  orderId: 1,
});

const OrderItem: Model<IOrderItem> =
  mongoose.models.OrderItem ||
  mongoose.model<IOrderItem>("OrderItem", OrderItemSchema);

export default OrderItem;