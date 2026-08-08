import mongoose, { Document, Model, Schema } from "mongoose";

export interface IOrderItem {
  menuItem: mongoose.Types.ObjectId;

  name: string;
  price: number;

  quantity: number;

  subtotal: number;
}

export interface IOrderPayment {
  status:
    | "pending"
    | "processing"
    | "paid"
    | "failed"
    | "refunded";

  stripePaymentIntentId?: string;

  paidAt?: Date;
}

export interface IOrderPickup {
  date: Date;

  time: string;
}

export interface IOrder extends Document {
  orderNumber: string;

  customer: mongoose.Types.ObjectId;

  type: "regular" | "catering";

  cateringRequest?: mongoose.Types.ObjectId;

  items: IOrderItem[];

  pickup: IOrderPickup;

  subtotal: number;
  tax: number;
  total: number;

  payment: IOrderPayment;

  status:
    | "pending"
    | "confirmed"
    | "preparing"
    | "ready"
    | "completed"
    | "cancelled";

  customerNotes?: string;

  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>(
  {
    menuItem: {
      type: Schema.Types.ObjectId,
      ref: "MenuItem",
      required: true,
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

    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    _id: false,
  }
);

const OrderPaymentSchema = new Schema<IOrderPayment>(
  {
    status: {
      type: String,
      enum: [
        "pending",
        "processing",
        "paid",
        "failed",
        "refunded",
      ],
      default: "pending",
      required: true,
    },

    stripePaymentIntentId: {
      type: String,
      index: true,
    },

    paidAt: {
      type: Date,
    },
  },
  {
    _id: false,
  }
);

const OrderPickupSchema = new Schema<IOrderPickup>(
  {
    date: {
      type: Date,
      required: true,
    },

    time: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    _id: false,
  }
);

const OrderSchema = new Schema<IOrder>(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    customer: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    type: {
      type: String,
      enum: ["regular", "catering"],
      required: true,
      index: true,
    },

    cateringRequest: {
      type: Schema.Types.ObjectId,
      ref: "CateringRequest",
    },

    items: {
      type: [OrderItemSchema],
      required: true,
      validate: {
        validator: (items: IOrderItem[]) => items.length > 0,
        message: "An order must contain at least one item.",
      },
    },

    pickup: {
      type: OrderPickupSchema,
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
    },

    total: {
      type: Number,
      required: true,
      min: 0,
    },

    payment: {
      type: OrderPaymentSchema,
      required: true,
    },

    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "preparing",
        "ready",
        "completed",
        "cancelled",
      ],
      default: "pending",
      required: true,
      index: true,
    },

    customerNotes: {
      type: String,
      trim: true,
      maxlength: 2000,
    },
  },
  {
    timestamps: true,
  }
);

OrderSchema.index({
  customer: 1,
  createdAt: -1,
});

OrderSchema.index({
  status: 1,
  "pickup.date": 1,
});

const Order: Model<IOrder> =
  mongoose.models.Order ||
  mongoose.model<IOrder>("Order", OrderSchema);

export default Order;