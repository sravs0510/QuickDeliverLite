import DeliveryRequest from '../models/DeliveryRequest.js';

// POST /api/feedback
export const createFeedback = async (req, res) => {
  try {
    const { deliveryId, rating, comment, category } = req.body;

    const delivery = await DeliveryRequest.findOne({ trackingId: deliveryId });

    if (!delivery) {
      return res.status(404).json({ error: 'Delivery not found.' });
    }

    if (delivery.status.toLowerCase() !== 'delivered') {
      return res.status(400).json({ error: 'Feedback allowed only after delivery is completed.' });
    }

    if (delivery.feedbackGiven) {
      return res.status(400).json({ error: 'Feedback already submitted for this delivery.' });
    }

    // ✅ Set feedback directly inside the delivery
    delivery.feedback = {
      rating,
      comment,
      category,
      date: new Date()
    };

    delivery.feedbackGiven = true;

    await delivery.save();

    res.status(201).json({ message: 'Feedback submitted successfully', feedback: delivery.feedback });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to submit feedback' });
  }
};

// GET /api/feedback/all
export const getAllFeedback = async (req, res) => {
  try {
    const feedbacks = await DeliveryRequest.find(
      { feedbackGiven: true },
      { trackingId: 1, deliveryDate: 1, feedback: 1 }
    );
    res.json(feedbacks);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching feedbacks' });
  }
};

// GET /api/feedback/deliveries?email=chinmayeebyreddy@gmail.com
export const getDeliveredDeliveries = async (req, res) => {
  try {
    const { email } = req.query;

    const deliveries = await DeliveryRequest.find({
      email,
      status: 'delivered'
    });

    res.json(deliveries);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching deliveries' });
  }
};

// GET /api/feedback/driver/:name
export const getDriverFeedback = async (req, res) => {
  try {
    const { name } = req.params;

    const feedbacks = await DeliveryRequest.find(
      {
        'driver.name': name,
        feedbackGiven: true
      },
      {
        trackingId: 1,
        deliveryDate: 1,
        feedback: 1
      }
    );

    res.json(feedbacks);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching driver feedback' });
  }
};
