import mongoose, {
  Document,
  Model,
  Schema,
  Types,
} from "mongoose";

export type CateringPackagePricingType =
  | "flat"
  | "per_person";

export interface ICateringPackageItem {
  cateringItem: Types.ObjectId;

  name: string;

  quantity: number;
}

export interface ICateringPackage
  extends Document {
  name: string;
  slug: string;

  description?: string;
  image?: string;
  imagePublicId?: string;

  price: number;

  pricingType:
    CateringPackagePricingType;

  minimumGuests?: number;
  maximumGuests?: number;

  items: ICateringPackageItem[];

  available: boolean;
  displayOrder: number;

  createdAt: Date;
  updatedAt: Date;
}

const CateringPackageItemSchema =
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

const CateringPackageSchema =
  new Schema(
    {
      name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 150,
      },

      slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true,
      },

      description: {
        type: String,
        trim: true,
        maxlength: 1500,
      },

      image: {
        type: String,
        trim: true,
      },

      imagePublicId: {
        type: String,
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

      minimumGuests: {
        type: Number,
        min: 1,
      },

      maximumGuests: {
        type: Number,
        min: 1,
      },

      items: {
        type: [
          CateringPackageItemSchema,
        ],

        default: [],
      },

      available: {
        type: Boolean,
        default: true,
        index: true,
      },

      displayOrder: {
        type: Number,
        default: 0,
        min: 0,
      },
    },
    {
      timestamps: true,
    }
  );

CateringPackageSchema.index({
  available: 1,
  displayOrder: 1,
});

const CateringPackage: Model<ICateringPackage> =
  mongoose.models.CateringPackage ||
  mongoose.model<ICateringPackage>(
    "CateringPackage",
    CateringPackageSchema
  );

export default CateringPackage;