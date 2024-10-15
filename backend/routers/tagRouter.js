import express from "express";
import { protect, adminProtect } from "../middlewares/authMiddlware.js";
import { createTag, getTags } from "../controllers/tagController.js";

const router = express.Router();

router.get("/", getTags);

router.post("/create", protect, createTag);

export default router;
