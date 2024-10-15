import express from "express";
import { protect, adminProtect } from "../middlewares/authMiddlware.js";
import { createVideo, getVideos } from "../controllers/videoController.js";

const router = express.Router();

router.get("/", getVideos);

router.post("/create", protect, createVideo);

export default router;
