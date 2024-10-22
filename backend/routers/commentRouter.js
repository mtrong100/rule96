import express from "express";
import { adminProtect, protect } from "../middlewares/authMiddlware.js";
import {
  createComment,
  deleteComment,
  getComments,
  getCommentsFromVideo,
} from "../controllers/commentController.js";

const router = express.Router();

router.get("/", adminProtect, getComments);

router.get("/:videoId", protect, getCommentsFromVideo);

router.post("/create", protect, createComment);

router.delete("/delete/:id", protect, deleteComment);

export default router;
