import express from 'express';
import {
  createFeedback,
  getAllFeedback,
  getDeliveredDeliveries,
  getDriverFeedback
} from '../Controllers/feedbackController.js';

const router = express.Router();

router.post('/', createFeedback);
router.get('/all', getAllFeedback);
router.get('/deliveries', getDeliveredDeliveries);
router.get('/driver/:name', getDriverFeedback); // example: /driver/Vasudha

export default router;
