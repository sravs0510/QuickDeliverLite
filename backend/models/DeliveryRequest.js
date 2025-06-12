import mongoose from "mongoose";

const deliveryRequestSchema = new mongoose.Schema({
  pickupAddress: { type: String, required: true },
  dropoffAddress: { type: String, required: true },
  note: { type: String },
  deliveryDate: { type: String, required: true },
  deliveryTime: { type: String, required: true },
  weight: { type: String },
  packageType: { type: String },
  mobileNumber: { type: String, required: true },
  status: { type: String, default: "Pending" },
  email: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model("DeliveryRequest", deliveryRequestSchema);
