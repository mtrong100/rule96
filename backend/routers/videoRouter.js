import express from "express";
import { protect, adminProtect } from "../middlewares/authMiddlware.js";
import {
  createVideo,
  dislikeVideo,
  getVideoDetails,
  getVideos,
  increaseViewCount,
  likeVideo,
} from "../controllers/videoController.js";

const router = express.Router();

router.get("/", getVideos);

router.get("/:id", getVideoDetails);

router.post("/create", protect, createVideo);

router.put("/view/:id", increaseViewCount);
router.put("/like/:id", protect, likeVideo);
router.put("/dislike/:id", protect, dislikeVideo);

export default router;
