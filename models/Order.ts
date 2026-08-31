import mongoose, {
  Document,
  Model,
  Schema,
  Types,
} from "mongoose";

export type OrderType = "regular" | "catering";

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "ready"
  | "completed"
  | "cancelled";

export type PaymentStatus =
  | "pending"
  | "paid"
  | "failed"
  | "refunded";

export interface IOrderItem {
  menuItem?: Types.ObjectId;
  name: string;
  price: number;
  quantity: number;
}

export interface IOrder extends Document {
  customer?: Types.ObjectId;

  orderType: OrderType;

  items: IOrderItem[];

  firstName: string;
  lastName: string;
  email: string;
  phone: string;

  pickupDate?: Date;
  pickupTime?: string;

  notes?: string;

  subtotal: number;
  taxRate: number;
  tax: number;
  total: number;

  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;

  checkoutAttemptId?: string;
  stripePaymentIntentId?: string;

  catering?: {
    requestId?: Types.ObjectId;

    eventDate: Date;
    guestCount: number;

    notes?: string;
  };

  orderConfirmationEmailSentAt?: Date;

  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>(
  {
    menuItem: {
      type: Schema.Types.ObjectId,
      ref: "MenuItem",
      required: false,
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
  },
  {
    _id: false,
  }
);

const OrderSchema = new Schema<IOrder>(
  {
    customer: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },

    orderType: {
      type: String,
      enum: ["regular", "catering"],
      required: true,
    },

    items: {
      type: [OrderItemSchema],
      required: true,
      validate: {
        validator: (items: IOrderItem[]) => items.length > 0,
        message: "Order must contain at least one item",
      },
    },

    firstName: {
      type: String,
      required: true,
      trim: true,
    },

    lastName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    pickupDate: {
      type: Date,
      required: function () {
        return this.orderType === "regular";
      },
    },

    pickupTime: {
      type: String,
      required: function () {
        return this.orderType === "regular";
      },
    },

    notes: {
      type: String,
      trim: true,
      maxlength: 500,
    },

    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },

    taxRate: {
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

    orderStatus: {
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
    },

    paymentStatus: {
      type: String,
      enum: [
        "pending",
        "paid",
        "failed",
        "refunded",
      ],
      default: "pending",
    },

    checkoutAttemptId: {
      type: String,
      trim: true,
    },

    stripePaymentIntentId: {
      type: String,
      sparse: true,
    },

    catering: {
      requestId: {
        type: Schema.Types.ObjectId,
        ref: "CateringRequest",
      },

      eventDate: {
        type: Date,
      },

      guestCount: {
        type: Number,
        min: 1,
      },

      notes: {
        type: String,
        trim: true,
        maxlength: 1000,
      },
    },

    orderConfirmationEmailSentAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Common query patterns
OrderSchema.index({ customer: 1, createdAt: -1 });
OrderSchema.index({ orderStatus: 1 });
OrderSchema.index({ paymentStatus: 1 });
OrderSchema.index({ pickupDate: 1 });
OrderSchema.index(
  { checkoutAttemptId: 1 },
  {
    unique: true,
    sparse: true,
  }
);
OrderSchema.index(
  {
    "catering.requestId": 1,
  },
  {
    unique: true,
    sparse: true,
  }
);

const Order: Model<IOrder> =
  mongoose.models.Order ||
  mongoose.model<IOrder>("Order", OrderSchema);

export default Order;