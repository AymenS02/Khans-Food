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
  menuItem: Types.ObjectId;
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

  pickupDate: Date;
  pickupTime: string;

  notes?: string;

  subtotal: number;
  tax: number;
  total: number;

  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;

  stripePaymentIntentId?: string;

  catering?: {
    eventDate: Date;
    guestCount: number;
    notes?: string;
  };

  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>(
  {
    menuItem: {
      type: Schema.Types.ObjectId,
      ref: "Menu",
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
      required: true,
    },

    pickupTime: {
      type: String,
      required: true,
      trim: true,
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

    stripePaymentIntentId: {
      type: String,
      sparse: true,
    },

    catering: {
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
  },
  {
    timestamps: true,
  }
);

const Order: Model<IOrder> =
  mongoose.models.Order ||
  mongoose.model<IOrder>("Order", OrderSchema);

export default Order;