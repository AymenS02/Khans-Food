import mongoose, { Schema, Document, Model } from "mongoose";

export type OrderType = "menu" | "catering";

export type OrderStatus =
  | "pending_approval"
  | "approved"
  | "payment_pending"
  | "preparing"
  | "ready_for_pickup"
  | "completed"
  | "cancelled";

export type PaymentStatus =
  | "unpaid"
  | "paid"
  | "refunded"
  | "failed";

export type PaymentMethod =
  | "online"
  | "cash"
  | "card";

export type OrderSource =
  | "website"
  | "phone"
  | "in_person"
  | "admin";

export interface IOrder extends Document {
  userId?: mongoose.Types.ObjectId;

  orderNumber: string;

  type: OrderType;

  status: OrderStatus;

  paymentStatus: PaymentStatus;
  paymentMethod?: PaymentMethod;

  source: OrderSource;

  // Customer snapshot
  customerName: string;
  customerEmail: string;
  customerPhone: string;

  // Pickup
  pickupDate: Date;
  pickupTime: string;

  // Pricing
  subtotal: number;
  tax: number;
  discount: number;
  total: number;

  specialInstructions?: string;

  // Approval
  approvedBy?: mongoose.Types.ObjectId;
  approvedAt?: Date;

  // Cancellation
  cancelledBy?: mongoose.Types.ObjectId;
  cancelledAt?: Date;
  cancellationReason?: string;

  // Completion
  completedAt?: Date;

  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    orderNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    type: {
      type: String,
      enum: ["menu", "catering"],
      required: true,
    },

    status: {
      type: String,
      enum: [
        "pending_approval",
        "approved",
        "payment_pending",
        "preparing",
        "ready_for_pickup",
        "completed",
        "cancelled",
      ],
      required: true,
      default: "payment_pending",
    },

    paymentStatus: {
      type: String,
      enum: [
        "unpaid",
        "paid",
        "refunded",
        "failed",
      ],
      default: "unpaid",
    },

    paymentMethod: {
      type: String,
      enum: ["online", "cash", "card"],
    },

    source: {
      type: String,
      enum: [
        "website",
        "phone",
        "in_person",
        "admin",
      ],
      default: "website",
    },

    customerName: {
      type: String,
      required: true,
      trim: true,
    },

    customerEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    customerPhone: {
      type: String,
      required: true,
      trim: true,
    },

    pickupDate: {
      type: Date,
      required: true,
    },

    pickupTime: {
      type: String,
      required: true,
    },

    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },

    tax: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    discount: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    total: {
      type: Number,
      required: true,
      min: 0,
    },

    specialInstructions: {
      type: String,
      trim: true,
    },

    approvedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    approvedAt: {
      type: Date,
    },

    cancelledBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    cancelledAt: {
      type: Date,
    },

    cancellationReason: {
      type: String,
      trim: true,
    },

    completedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

OrderSchema.index({
  userId: 1,
  createdAt: -1,
});

OrderSchema.index({
  pickupDate: 1,
  status: 1,
});

const Order: Model<IOrder> =
  mongoose.models.Order ||
  mongoose.model<IOrder>("Order", OrderSchema);

export default Order;