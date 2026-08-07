import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema(
{
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: true,
  },

  orderType: {
    type: String,
    enum: ["menu", "catering"],
    required: true,
  },

  items: [
    {
      name: String,
      quantity: Number,
      price: Number,
    }
  ],

  cateringDetails: {
    eventDate: Date,
    guestCount: Number,
    location: String,
  },

  totalPrice: Number,

  status: {
    type: String,
    enum: [
      "pending",
      "confirmed",
      "preparing",
      "ready",
      "completed",
      "cancelled"
    ],
    default: "pending",
  }

},
{
  timestamps: true
});

const Order = mongoose.models.Order || mongoose.model("Order", OrderSchema);

export default Order;