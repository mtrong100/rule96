import express from "express";
import { protect } from "../middlewares/authMiddlware.js";
import {
  getFavoriteDetails,
  getFavorites,
  getUserFavorites,
  toggleFavorite,
} from "../controllers/favoriteController.js";

const router = express.Router();

router.get("/", protect, getFavorites);

router.get("/user/:userId", protect, getUserFavorites);

router.get("/:videoId", protect, getFavoriteDetails);

router.put("/toggle/:videoId", protect, toggleFavorite);

export default router;
