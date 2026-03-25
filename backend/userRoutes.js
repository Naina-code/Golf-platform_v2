import express from "express";
import {
  getProfile,
  updateProfile,
  getDashboard,
  selectCharity,
  getSubscriptionStatus
} from "./userController.js";

import { authMiddleware } from "./authMiddleware.js";

const router = express.Router();

//  Get user profile
router.get("/profile", authMiddleware, getProfile);

//  Update profile
router.put("/profile", authMiddleware, updateProfile);

// Dashboard data
router.get("/dashboard", authMiddleware, getDashboard);

//  Select / update charity
router.post("/charity", authMiddleware, selectCharity);

//  Subscription status
router.get("/subscription", authMiddleware, getSubscriptionStatus);

export default router;
