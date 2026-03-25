import express from "express";
import { addScore, getScores } from "./scoreController.js";
import { authMiddleware } from "./authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, addScore);
router.get("/", authMiddleware, getScores);

export default router;
