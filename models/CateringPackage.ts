import mongoose, { Document, Model, Schema } from "mongoose";

export interface ICateringSelection {
  menuItem: mongoose.Types.ObjectId;

  name: string;
  price: number;

  quantity: number;
}

export interface ICateringRequest extends Document {
  customer: mongoose.Types.ObjectId;

  selectionType: "package" | "custom";

  cateringPackage?: mongoose.Types.ObjectId;

  selections: ICateringSelection[];

  eventDate: Date;
  guestCount: number;

  notes?: string;

  status:
    | "pending"
    | "approved"
    | "rejected"
    | "cancelled";

  adminNotes?: string;

  approvedAt?: Date;
  rejectedAt?: Date;

  createdAt: Date;
  updatedAt: Date;
}

const CateringSelectionSchema =
  new Schema<ICateringSelection>(
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
    },
    {
      _id: false,
    }
  );

const CateringRequestSchema =
  new Schema<ICateringRequest>(
    {
      customer: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
      },

      selectionType: {
        type: String,
        enum: ["package", "custom"],
        required: true,
      },

      cateringPackage: {
        type: Schema.Types.ObjectId,
        ref: "CateringPackage",
      },

      selections: {
        type: [CateringSelectionSchema],
        default: [],
      },

      eventDate: {
        type: Date,
        required: true,
        index: true,
      },

      guestCount: {
        type: Number,
        required: true,
        min: 1,
      },

      notes: {
        type: String,
        trim: true,
        maxlength: 2000,
      },

      status: {
        type: String,
        enum: [
          "pending",
          "approved",
          "rejected",
          "cancelled",
        ],
        default: "pending",
        required: true,
        index: true,
      },

      adminNotes: {
        type: String,
        trim: true,
        maxlength: 2000,
      },

      approvedAt: {
        type: Date,
      },

      rejectedAt: {
        type: Date,
      },
    },
    {
      timestamps: true,
    }
  );

CateringRequestSchema.index({
  status: 1,
  eventDate: 1,
});

const CateringRequest: Model<ICateringRequest> =
  mongoose.models.CateringRequest ||
  mongoose.model<ICateringRequest>(
    "CateringRequest",
    CateringRequestSchema
  );

export default CateringRequest;