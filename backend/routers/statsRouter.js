import express from "express";
import { adminProtect } from "../middlewares/authMiddlware.js";
import {
  getCountStats,
  getVideoStats,
} from "../controllers/statsController.js";

const router = express.Router();

router.get("/count-stats", adminProtect, getCountStats);
router.get("/video-stats", adminProtect, getVideoStats);

export default router;
