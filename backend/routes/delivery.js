import express from "express";
import {
  createDeliveryRequest,
  getPendingDeliveries,
  getCustomerDeliveries,
  cancelDelivery
} from "../Controllers/deliveryController.js";

const router = express.Router();

router.post("/", createDeliveryRequest); // POST /api/delivery
router.get("/pending", getPendingDeliveries); // GET /api/delivery/pending
router.get("/customer/:email", getCustomerDeliveries); // GET /api/delivery/customer/:email
router.put('/cancel/:id', cancelDelivery);

export default router;
