import mongoose from "mongoose";

const deliveryRequestSchema = new mongoose.Schema({
  pickupAddress: { type: String, required: true },
  dropoffAddress: { type: String, required: true },
  packageNote: { type: String, required: true },
  deliveryDate: { type: String, required: true },
  deliveryTime: { type: String, required: true },
  packageSize: { type: String, required: true },
  priority: { type: String, required: true },
  status: { type: String, default: "pending" },
  email: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model("DeliveryRequest", deliveryRequestSchema);
