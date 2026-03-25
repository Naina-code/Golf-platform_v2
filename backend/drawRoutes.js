import express from "express";
import { runDraw } from "./drawController.js";

const router = express.Router();

router.post("/run", runDraw);

export default router;
