import mongoose, {
  Document,
  Model,
  Schema,
} from "mongoose";

export interface IRateLimit
  extends Document {
  key: string;
  count: number;
  resetAt: Date;
}

const rateLimitSchema =
  new Schema<IRateLimit>(
    {
      key: {
        type: String,
        required: true,
        unique: true,
        index: true,
      },

      count: {
        type: Number,
        required: true,
        min: 0,
        default: 0,
      },

      resetAt: {
        type: Date,
        required: true,
        index: {
          expires: 0,
        },
      },
    },
    {
      timestamps: false,
    }
  );

const RateLimit:
  Model<IRateLimit> =
    mongoose.models.RateLimit ||
    mongoose.model<IRateLimit>(
      "RateLimit",
      rateLimitSchema
    );

export default RateLimit;