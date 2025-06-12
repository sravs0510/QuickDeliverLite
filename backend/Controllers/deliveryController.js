import DeliveryRequest from "../models/DeliveryRequest.js";

// Create a new delivery request (already working)
export const createDeliveryRequest = async (req, res) => {
  try {
    const newRequest = new DeliveryRequest(req.body);
    const savedRequest = await newRequest.save();
    res.status(201).json(savedRequest);
  } catch (err) {
    console.error("Delivery creation error:", err);
    res.status(500).json({ message: "Failed to create delivery request." });
  }
};

// 🚀 GET all pending deliveries (for drivers/admin)
export const getPendingDeliveries = async (req, res) => {
  try {
    const requests = await DeliveryRequest.find({ status: "Pending" }).sort({ timestamp: -1 });
    res.status(200).json(requests);
  } catch (err) {
    console.error("Fetch error:", err);
    res.status(500).json({ message: "Failed to fetch deliveries." });
  }
};

// 🧑‍💼 GET deliveries for a specific customer
export const getCustomerDeliveries = async (req, res) => {
  const { email } = req.params;

  try {
    const requests = await DeliveryRequest.find({ email }).sort({ timestamp: -1 });
    res.status(200).json(requests);
  } catch (err) {
    console.error("Customer delivery fetch error:", err);
    res.status(500).json({ message: "Failed to fetch customer's deliveries." });
  }
};
