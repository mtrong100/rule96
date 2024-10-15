import express from "express";
import { protect, adminProtect } from "../middlewares/authMiddlware.js";
import { createTag } from "../controllers/tagController.js";

const router = express.Router();

router.post("/create", protect, createTag);

export default router;
