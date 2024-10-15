import express from "express";
import { protect, adminProtect } from "../middlewares/authMiddlware.js";
import { createVideo } from "../controllers/videoController.js";

const router = express.Router();

router.post("/create", protect, createVideo);

export default router;
