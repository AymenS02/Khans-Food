import mongoose, {
  Document,
  Model,
  Schema,
  Types,
} from "mongoose";

export type CateringRequestStatus =
  | "submitted"
  | "reviewing"
  | "approved"
  | "rejected"
  | "cancelled";

export type CateringSelectionType =
  | "package"
  | "custom";

export type CateringPricingType =
  | "flat"
  | "per_person";

export interface ICateringCustomItem {
  cateringItem: Types.ObjectId;

  name: string;

  price: number;

  pricingType: CateringPricingType;

  quantity: number;
}

export interface ICateringRequest
  extends Document {
  customer?: Types.ObjectId;

  firstName: string;
  lastName: string;
  email: string;
  phone: string;

  eventDate: Date;
  guestCount: number;

  selectionType: CateringSelectionType;

  package?: {
    packageId: Types.ObjectId;

    name: string;

    price: number;

    pricingType: CateringPricingType;
  };

  customItems: ICateringCustomItem[];

  notes?: string;
  adminNotes?: string;

  status: CateringRequestStatus;

  quotedSubtotal?: number;
  taxRate?: number;
  tax?: number;
  quotedTotal?: number;

  order?: Types.ObjectId;

  createdAt: Date;
  updatedAt: Date;
}

const CateringCustomItemSchema =
  new Schema(
    {
      cateringItem: {
        type: Schema.Types.ObjectId,
        ref: "CateringItem",
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

      pricingType: {
        type: String,
        enum: [
          "flat",
          "per_person",
        ],
        required: true,
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

const CateringRequestSchema =
  new Schema(
    {
      customer: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: false,
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
        trim: true,
        lowercase: true,
      },

      phone: {
        type: String,
        required: true,
        trim: true,
      },

      eventDate: {
        type: Date,
        required: true,
      },

      guestCount: {
        type: Number,
        required: true,
        min: 1,
      },

      selectionType: {
        type: String,
        enum: [
          "package",
          "custom",
        ],
        required: true,
      },

      package: {
        packageId: {
          type: Schema.Types.ObjectId,
          ref: "CateringPackage",
        },

        name: {
          type: String,
          trim: true,
        },

        price: {
          type: Number,
          min: 0,
        },

        pricingType: {
          type: String,
          enum: [
            "flat",
            "per_person",
          ],
        },
      },

      customItems: {
        type: [
          CateringCustomItemSchema,
        ],

        default: [],
      },

      notes: {
        type: String,
        trim: true,
        maxlength: 1000,
      },

      adminNotes: {
        type: String,
        trim: true,
        maxlength: 2000,
      },

      status: {
        type: String,

        enum: [
          "submitted",
          "reviewing",
          "approved",
          "rejected",
          "cancelled",
        ],

        default: "submitted",

        index: true,
      },

      quotedSubtotal: {
        type: Number,
        min: 0,
      },

      taxRate: {
        type: Number,
        min: 0,
      },

      tax: {
        type: Number,
        min: 0,
      },

      quotedTotal: {
        type: Number,
        min: 0,
      },

      order: {
        type: Schema.Types.ObjectId,
        ref: "Order",
      },
    },
    {
      timestamps: true,
    }
  );

CateringRequestSchema.index({
  customer: 1,
  createdAt: -1,
});

CateringRequestSchema.index({
  eventDate: 1,
});

CateringRequestSchema.index({
  status: 1,
  createdAt: -1,
});

const CateringRequest: Model<ICateringRequest> =
  mongoose.models.CateringRequest ||
  mongoose.model<ICateringRequest>(
    "CateringRequest",
    CateringRequestSchema
  );

export default CateringRequest;