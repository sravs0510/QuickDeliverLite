import DeliveryRequest from "../models/DeliveryRequest.js";
import User from "../models/User.js";


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
    const requests = await DeliveryRequest.aggregate([
      {
        $match: { status: "pending" }
      },
      {
        $sort: { timestamp: -1 }
      },
      {
        $lookup: {
          from: "users",             // 🔁 collection name in MongoDB
          localField: "email",       // 🔗 field in DeliveryRequest
          foreignField: "email",     // 🔗 field in User
          as: "userInfo"             // 🧾 result field (array)
        }
      },
      {
        $unwind: {
          path: "$userInfo",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          pickupAddress: 1,
          dropoffAddress: 1,
          packageNote: 1,
          deliveryDate: 1,
          deliveryTime: 1,
          packageSize: 1,
          priority: 1,
          status: 1,
          email: 1,
          timestamp: 1,
          name: "$userInfo.name",         // ⬅️ added from User
          mobile: "$userInfo.mobile"      // ⬅️ added from User
        }
      }
    ]);

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


export const acceptDelivery = async (req, res) => {
  const { id } = req.params;
  const driverEmail = req.body.driverEmail;

  try {
    const driver = await User.findOne({ email: driverEmail, role: "Driver" });
    if (!driver) {
      return res.status(404).json({ message: "Driver not found or unauthorized." });
    }

    const updatedDelivery = await DeliveryRequest.findByIdAndUpdate(
      id,
      {
        status: "accepted",
        driverName: driver.name,
        driverPhone: driver.mobile,
        driverEmail: driver.email,
      },
      { new: true }
    );

    if (!updatedDelivery) {
      return res.status(404).json({ message: "Delivery not found." });
    }

    res.status(200).json({ message: "Delivery accepted successfully", delivery: updatedDelivery });
  } catch (err) {
    console.error("Accept delivery error:", err);
    res.status(500).json({ message: "Failed to accept delivery." });
  }
};
// backend/routes/driverRoutes.js (or similar)


export const accepted = async (req, res) => {
  const { email } = req.query;

  try {
    // 1. Get all accepted/in_transit/delivered deliveries for the driver
    const deliveries = await DeliveryRequest.find({
      driverEmail: email,
      status: { $in: ["accepted", "in_transit", "delivered"] }
    });

    // 2. Get unique customer emails
    const customerEmails = [...new Set(deliveries.map(d => d.email))];

    // 3. Fetch user details (mobile numbers) for those emails
    const users = await User.find({ email: { $in: customerEmails } });

    // 4. Map user emails to mobiles
    const emailToMobileMap = {};
    users.forEach(user => {
      emailToMobileMap[user.email] = user.mobile;
    });

    // 5. Attach customerMobile to each delivery
    const enrichedDeliveries = deliveries.map(delivery => ({
      ...delivery.toObject(),
      customerMobile: emailToMobileMap[delivery.email] || "N/A"
    }));

    res.json(enrichedDeliveries);
  } catch (err) {
    console.error("Error in accepted deliveries:", err);
    res.status(500).json({ message: "Server error" });
  }
};


export const updateDeliveryStatus = async (req, res) => {
  const { id } = req.params;
  const { newStatus } = req.body;

  try {
    const updated = await DeliveryRequest.findByIdAndUpdate(
      id,
      { status: newStatus },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Delivery not found" });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Error updating delivery status" });
  }
};