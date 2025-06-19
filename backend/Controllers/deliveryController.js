import DeliveryRequest from "../models/DeliveryRequest.js";

// ✅ Create a new delivery request
export const createDeliveryRequest = async (req, res) => {
  try {
    const {
      pickupAddress,
      dropoffAddress,
      packageNote,
      deliveryDate,
      deliveryTime,
      packageSize,
      priority,
      email,
    } = req.body;

    // Validate required fields (for safety, though schema also enforces it)
    if (
      !pickupAddress ||
      !dropoffAddress ||
      !packageNote ||
      !deliveryDate ||
      !deliveryTime ||
      !packageSize ||
      !priority ||
      !email
    ) {
      return res.status(400).json({ message: "All required fields must be filled." });
    }

    const newRequest = new DeliveryRequest({
      pickupAddress,
      dropoffAddress,
      packageNote,
      deliveryDate,
      deliveryTime,
      packageSize,
      priority,
      email,
    });

    const savedRequest = await newRequest.save();
    res.status(201).json(savedRequest);
  } catch (err) {
    console.error("Delivery creation error:", err);
    res.status(500).json({ message: "Failed to create delivery request." });
  }
};

// ✅ GET all pending deliveries (for drivers/admin)
export const getPendingDeliveries = async (req, res) => {
  try {
    const requests = await DeliveryRequest.find({ status: "Pending" }).sort({ timestamp: -1 });
    res.status(200).json(requests);
  } catch (err) {
    console.error("Fetch error:", err);
    res.status(500).json({ message: "Failed to fetch deliveries." });
  }
};

// ✅ GET deliveries for a specific customer
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

export const cancelDelivery = async (req, res) => {
  const { id } = req.params;

  try {
    const updatedDelivery = await DeliveryRequest.findByIdAndUpdate(
      id,
      { status: 'cancelled' },
      { new: true }
    );

    if (!updatedDelivery) {
      return res.status(404).json({ message: 'Delivery not found' });
    }

    res.status(200).json({ message: 'Delivery cancelled', delivery: updatedDelivery });
  } catch (error) {
    console.error('Cancel error:', error);
    res.status(500).json({ message: 'Failed to cancel delivery' });
  }
};
