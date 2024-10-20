import express from "express";
import { protect, adminProtect } from "../middlewares/authMiddlware.js";
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from "../controllers/categoryController.js";

const router = express.Router();

router.get("/", getCategories);

router.post("/create", protect, createCategory);

router.put("/update/:id", adminProtect, updateCategory);

router.delete("/delete/:id", adminProtect, deleteCategory);

export default router;
