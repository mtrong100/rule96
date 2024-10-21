import express from "express";
import { protect, adminProtect } from "../middlewares/authMiddlware.js";
import {
  createVideo,
  deleteVideo,
  dislikeVideo,
  getVideoDetails,
  getVideos,
  increaseViewCount,
  likeVideo,
  updateVideo,
} from "../controllers/videoController.js";

const router = express.Router();

router.get("/", getVideos);

router.get("/:id", getVideoDetails);

router.post("/create", protect, createVideo);

router.put("/view/:id", increaseViewCount);
router.put("/like/:id", protect, likeVideo);
router.put("/dislike/:id", protect, dislikeVideo);
router.put("/update/:id", adminProtect, updateVideo);

router.delete("/delete/:id", adminProtect, deleteVideo);

export default router;
