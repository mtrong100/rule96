import express from "express";
import { protect } from "../middlewares/authMiddlware.js";
import { createArtist, getArtists } from "../controllers/artistController.js";

const router = express.Router();

router.get("/", getArtists);

router.post("/create", protect, createArtist);

export default router;
