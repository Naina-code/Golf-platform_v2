import express from "express";
import {
  createSubscription,
  stripeWebhook
} from "./subscriptionController.js";

import { authMiddleware } from "./authMiddleware.js";

const router = express.Router();

// Create subscription
router.post("/create", authMiddleware, createSubscription);

// Stripe webhook
router.post("/webhook", express.raw({ type: "application/json" }), stripeWebhook);

export default router;
