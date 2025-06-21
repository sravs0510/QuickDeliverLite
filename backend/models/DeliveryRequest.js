import mongoose from 'mongoose';

const timelineSchema = new mongoose.Schema({
  status: String,
  time: String,
  date: String,
  location: String,
  completed: Boolean,
  current: Boolean,
});

const driverSchema = new mongoose.Schema({
  name: String,
  phone: String,
  vehicle: String,
  email: String
});

const deliveryRequestSchema = new mongoose.Schema({
  trackingId: { type: String, required: true, unique: true },
  pickupAddress: { type: String, required: true },
  dropoffAddress: { type: String, required: true },
  packageNote: { type: String, required: true },
  deliveryDate: { type: String, required: true },
  deliveryTime: { type: String, required: true },
  packageSize: { type: String, required: true },
  priority: { type: String, required: true },
  status: { type: String, default: "pending" }, // current status
  currentLocation: { type: String, default: "" },
  estimatedDelivery: { type: String, default: "" },
  email: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },

  // Driver info (either inline or using embedded schema)
  driver: driverSchema,

  // Full status timeline
  timeline: [timelineSchema],
});

const DeliveryRequest = mongoose.model('DeliveryRequest', deliveryRequestSchema);
export default DeliveryRequest;
