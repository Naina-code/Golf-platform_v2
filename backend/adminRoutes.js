import express from "express";

import {
  // DASHBOARD
  getAdminDashboard,

  // USER MANAGEMENT
  getAllUsers,
  updateUser,
  deleteUser,

  // DRAW MANAGEMENT
  createDraw,
  getAllDraws,
  runDrawAdmin,
  publishDraw,
  generateDrawWithML, // ✅ ADD THIS

  // CHARITY MANAGEMENT
  getAllCharities,
  addCharity,
  updateCharity,
  deleteCharity,

  // WINNER MANAGEMENT
  getAllWinners,
  getWinners,
  verifyWinner,
  markAsPaid,
  updateWinnerPayment,

  // ANALYTICS
  getAnalytics
} from "./adminController.js";

import { authMiddleware, isAdmin } from "./authMiddleware.js";

const router = express.Router();

/* ===============================
   📊 DASHBOARD
================================ */
router.get("/dashboard", authMiddleware, isAdmin, getAdminDashboard);

/* ===============================
   👤 USER MANAGEMENT
================================ */
router.get("/users", authMiddleware, isAdmin, getAllUsers);
router.put("/users/:id", authMiddleware, isAdmin, updateUser);
router.delete("/users/:id", authMiddleware, isAdmin, deleteUser);

/* ===============================
   🎲 DRAW MANAGEMENT
================================ */
router.post("/draw/create", authMiddleware, isAdmin, createDraw);
router.get("/draws", authMiddleware, isAdmin, getAllDraws);

// optional ML/random draw runner
router.post("/draw/run", authMiddleware, isAdmin, runDrawAdmin);

// ✅ NEW ML DRAW ROUTE
router.post("/draw/generate-ml", authMiddleware, isAdmin, generateDrawWithML);

// publish draw + calculate winners
router.post("/draw/publish", authMiddleware, isAdmin, publishDraw);

/* ===============================
   ❤️ CHARITY MANAGEMENT
================================ */
router.get("/charities", authMiddleware, isAdmin, getAllCharities);
router.post("/charities", authMiddleware, isAdmin, addCharity);
router.put("/charities/:id", authMiddleware, isAdmin, updateCharity);
router.delete("/charities/:id", authMiddleware, isAdmin, deleteCharity);

/* ===============================
   🏆 WINNER MANAGEMENT
================================ */
router.get("/winners", authMiddleware, isAdmin, getAllWinners);

router.get("/winners/all", authMiddleware, isAdmin, getWinners);

router.post("/winners/verify/:id", authMiddleware, isAdmin, verifyWinner);
router.post("/winners/pay/:id", authMiddleware, isAdmin, markAsPaid);

router.put("/winner-payment", authMiddleware, isAdmin, updateWinnerPayment);

/* ===============================
   📈 ANALYTICS
================================ */
router.get("/analytics", authMiddleware, isAdmin, getAnalytics);

export default router;
