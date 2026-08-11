import mongoose, {
  Document,
  Model,
  Schema,
} from "mongoose";

export interface IDayHours {
  isOpen: boolean;
  openingTime: string;
  closingTime: string;
}

export interface IBusinessSettings
  extends Document {
  businessName: string;
  
  timezone: string;

  weeklyHours: {
    sunday: IDayHours;
    monday: IDayHours;
    tuesday: IDayHours;
    wednesday: IDayHours;
    thursday: IDayHours;
    friday: IDayHours;
    saturday: IDayHours;
  };

  sameDayCutoffTime: string;

  createdAt: Date;
  updatedAt: Date;
}

const DayHoursSchema = new Schema(
  {
    isOpen: {
      type: Boolean,
      required: true,
      default: true,
    },

    openingTime: {
      type: String,
      required: true,
      default: "11:00",
    },

    closingTime: {
      type: String,
      required: true,
      default: "20:00",
    },
  },
  {
    _id: false,
  }
);

const BusinessSettingsSchema =
  new Schema(
    {
      businessName: {
        type: String,
        required: true,
        trim: true,
        default: "Khans Food",
      },

      timezone: {
        type: String,
        required: true,
        default: "America/Toronto",
      },
      
      weeklyHours: {
        sunday: {
          type: DayHoursSchema,
          required: true,
        },

        monday: {
          type: DayHoursSchema,
          required: true,
        },

        tuesday: {
          type: DayHoursSchema,
          required: true,
        },

        wednesday: {
          type: DayHoursSchema,
          required: true,
        },

        thursday: {
          type: DayHoursSchema,
          required: true,
        },

        friday: {
          type: DayHoursSchema,
          required: true,
        },

        saturday: {
          type: DayHoursSchema,
          required: true,
        },
      },

      sameDayCutoffTime: {
        type: String,
        required: true,
        default: "17:00",
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