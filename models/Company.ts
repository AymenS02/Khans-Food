import mongoose, { Schema, Document, Model } from "mongoose";

export type DayOfWeek =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export interface IBusinessHours {
  day: DayOfWeek;
  isOpen: boolean;

  openTime?: string;  // "09:00"
  closeTime?: string; // "21:00"
}

export interface ISpecialHours {
  date: Date;

  isOpen: boolean;

  openTime?: string;
  closeTime?: string;

  reason?: string;
}

export interface ICompany extends Document {
  name: string;

  description?: string;

  phone: string;
  email: string;

  address?: string;

  timezone: string;

  businessHours: IBusinessHours[];

  specialHours: ISpecialHours[];

  // Ordering settings
  menuOrdersEnabled: boolean;
  cateringOrdersEnabled: boolean;

  cateringMinimumDays: number;

  createdAt: Date;
  updatedAt: Date;
}

const BusinessHoursSchema = new Schema<IBusinessHours>(
  {
    day: {
      type: String,
      enum: [
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
        "sunday",
      ],
      required: true,
    },

    isOpen: {
      type: Boolean,
      default: true,
    },

    openTime: {
      type: String,
    },

    closeTime: {
      type: String,
    },
  },
  {
    _id: false,
  }
);

const SpecialHoursSchema = new Schema<ISpecialHours>(
  {
    date: {
      type: Date,
      required: true,
    },

    isOpen: {
      type: Boolean,
      default: true,
    },

    openTime: {
      type: String,
    },

    closeTime: {
      type: String,
    },

    reason: {
      type: String,
      trim: true,
    },
  },
  {
    _id: false,
  }
);

const CompanySchema = new Schema<ICompany>(
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

    phone: {
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

    address: {
      type: String,
      trim: true,
    },

    timezone: {
      type: String,
      required: true,
      default: "America/Toronto",
    },

    businessHours: {
      type: [BusinessHoursSchema],
      default: [
        {
          day: "monday",
          isOpen: true,
          openTime: "09:00",
          closeTime: "21:00",
        },
        {
          day: "tuesday",
          isOpen: true,
          openTime: "09:00",
          closeTime: "21:00",
        },
        {
          day: "wednesday",
          isOpen: true,
          openTime: "09:00",
          closeTime: "21:00",
        },
        {
          day: "thursday",
          isOpen: true,
          openTime: "09:00",
          closeTime: "21:00",
        },
        {
          day: "friday",
          isOpen: true,
          openTime: "09:00",
          closeTime: "21:00",
        },
        {
          day: "saturday",
          isOpen: true,
          openTime: "09:00",
          closeTime: "21:00",
        },
        {
          day: "sunday",
          isOpen: false,
        },
      ],
    },

    specialHours: {
      type: [SpecialHoursSchema],
      default: [],
    },

    menuOrdersEnabled: {
      type: Boolean,
      default: true,
    },

    cateringOrdersEnabled: {
      type: Boolean,
      default: true,
    },

    cateringMinimumDays: {
      type: Number,
      default: 3,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Company: Model<ICompany> =
  mongoose.models.Company ||
  mongoose.model<ICompany>("Company", CompanySchema);

export default Company;