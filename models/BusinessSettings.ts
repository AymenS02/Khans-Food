import mongoose, { Document, Model, Schema } from "mongoose";

export interface IBusinessHour {
  dayOfWeek: number;

  isOpen: boolean;

  openTime?: string;
  closeTime?: string;
}

export interface IBusinessSettings extends Document {
  businessName: string;

  businessHours: IBusinessHour[];

  regularOrderCutoffMinutes: number;

  cateringNoticeDays: number;

  currency: string;

  taxRate: number;

  createdAt: Date;
  updatedAt: Date;
}

const BusinessHourSchema = new Schema<IBusinessHour>(
  {
    dayOfWeek: {
      type: Number,
      required: true,
      min: 0,
      max: 6,
    },

    isOpen: {
      type: Boolean,
      default: true,
    },

    openTime: {
      type: String,
      trim: true,
    },

    closeTime: {
      type: String,
      trim: true,
    },
  },
  {
    _id: false,
  }
);

const BusinessSettingsSchema =
  new Schema<IBusinessSettings>(
    {
      businessName: {
        type: String,
        required: true,
        trim: true,
        default: "Khans Food",
      },

      businessHours: {
        type: [BusinessHourSchema],
        required: true,
        default: [],
      },

      regularOrderCutoffMinutes: {
        type: Number,
        required: true,
        min: 0,
        default: 60,
      },

      cateringNoticeDays: {
        type: Number,
        required: true,
        min: 3,
        default: 3,
      },

      currency: {
        type: String,
        required: true,
        uppercase: true,
        trim: true,
        default: "CAD",
      },

      taxRate: {
        type: Number,
        required: true,
        min: 0,
        max: 1,
        default: 0,
      },
    },
    {
      timestamps: true,
    }
  );

const BusinessSettings: Model<IBusinessSettings> =
  mongoose.models.BusinessSettings ||
  mongoose.model<IBusinessSettings>(
    "BusinessSettings",
    BusinessSettingsSchema
  );

export default BusinessSettings;