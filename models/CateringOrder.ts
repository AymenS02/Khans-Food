import mongoose, { Schema, Document, Model } from "mongoose";

export type CateringOrderMethod =
  | "package"
  | "custom";

export interface ICateringOrder extends Document {
  orderId: mongoose.Types.ObjectId;

  method: CateringOrderMethod;

  packageId?: mongoose.Types.ObjectId;

  guestCount?: number;

  eventType?: string;

  eventName?: string;

  specialInstructions?: string;

  createdAt: Date;
  updatedAt: Date;
}

const CateringOrderSchema = new Schema<ICateringOrder>(
  {
    orderId: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: true,
      unique: true,
    },

    method: {
      type: String,
      enum: ["package", "custom"],
      required: true,
    },

    packageId: {
      type: Schema.Types.ObjectId,
      ref: "CateringPackage",
    },

    guestCount: {
      type: Number,
      min: 1,
    },

    eventType: {
      type: String,
      trim: true,
    },

    eventName: {
      type: String,
      trim: true,
    },

    specialInstructions: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

CateringOrderSchema.index({
  packageId: 1,
});

const CateringOrder: Model<ICateringOrder> =
  mongoose.models.CateringOrder ||
  mongoose.model<ICateringOrder>(
    "CateringOrder",
    CateringOrderSchema
  );

export default CateringOrder;