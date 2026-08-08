import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICateringPackageItem extends Document {
  packageId: mongoose.Types.ObjectId;
  menuItemId: mongoose.Types.ObjectId;

  quantity: number;
}

const CateringPackageItemSchema =
  new Schema<ICateringPackageItem>(
    {
      packageId: {
        type: Schema.Types.ObjectId,
        ref: "CateringPackage",
        required: true,
      },

      menuItemId: {
        type: Schema.Types.ObjectId,
        ref: "MenuItem",
        required: true,
      },

      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
    },
    {
      timestamps: true,
    }
  );

CateringPackageItemSchema.index({
  packageId: 1,
  menuItemId: 1,
});

const CateringPackageItem: Model<ICateringPackageItem> =
  mongoose.models.CateringPackageItem ||
  mongoose.model<ICateringPackageItem>(
    "CateringPackageItem",
    CateringPackageItemSchema
  );

export default CateringPackageItem;