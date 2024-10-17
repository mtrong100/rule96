import express from "express";
import { protect } from "../middlewares/authMiddlware.js";
import {
  createComment,
  deleteComment,
  getCommentsFromVideo,
} from "../controllers/commentController.js";

const router = express.Router();

router.get("/:videoId", protect, getCommentsFromVideo);

router.post("/create", protect, createComment);

router.delete("/delete/:id", protect, deleteComment);

export default router;
