import express from "express";
import { protect, adminProtect } from "../middlewares/authMiddlware.js";
import {
  createCategory,
  getCategories,
} from "../controllers/categoryController.js";

const router = express.Router();

router.get("/", getCategories);

router.post("/create", protect, createCategory);

export default router;
