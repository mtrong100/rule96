import express from "express";
import { protect, adminProtect } from "../middlewares/authMiddlware.js";
import {
  createTag,
  deleteTag,
  getTags,
  updateTag,
} from "../controllers/tagController.js";

const router = express.Router();

router.get("/", getTags);

router.post("/create", protect, createTag);

router.put("/update/:id", adminProtect, updateTag);

router.delete("/delete/:id", adminProtect, deleteTag);

export default router;
