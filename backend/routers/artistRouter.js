import express from "express";
import { protect, adminProtect } from "../middlewares/authMiddlware.js";
import {
  createArtist,
  deleteArtist,
  getArtists,
  updateArtist,
} from "../controllers/artistController.js";

const router = express.Router();

router.get("/", getArtists);

router.post("/create", protect, createArtist);

router.put("/update/:id", adminProtect, updateArtist);

router.delete("/delete/:id", adminProtect, deleteArtist);

export default router;
