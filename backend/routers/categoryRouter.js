import express from "express";
import { protect, adminProtect } from "../middlewares/authMiddlware.js";
import { createCategory } from "../controllers/categoryController.js";

const router = express.Router();

router.post("/create", protect, createCategory);

export default router;
