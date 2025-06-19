import express from "express";
import {
  createDeliveryRequest,
  getPendingDeliveries,
  getCustomerDeliveries,
  cancelDelivery,
  acceptDelivery,
  accepted,
  updateDeliveryStatus
} from "../Controllers/deliveryController.js";

const router = express.Router();

router.post("/", createDeliveryRequest); // POST /api/delivery
router.get("/pending", getPendingDeliveries); // GET /api/delivery/pending
router.get("/customer/:email", getCustomerDeliveries); // GET /api/delivery/customer/:email
router.put('/cancel/:id', cancelDelivery);
router.put("/accept/:id", acceptDelivery); 
router.get("/accepted",accepted),
router.put("/status/:id", updateDeliveryStatus);

export default router;
