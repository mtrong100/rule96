import express from "express";
import { protect, adminProtect } from "../middlewares/authMiddlware.js";
import {
  deleteUser,
  getUserDetails,
  getUsers,
  getUserVideos,
  loginUser,
  logoutUser,
  registerUser,
  resetPassword,
  sendOtp,
  updateUser,
  updateUserProfile,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/", adminProtect, getUsers);
router.get("/:id", getUserDetails);

router.get("/videos/:userId", getUserVideos);

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", protect, logoutUser);
router.post("/send-otp", sendOtp);

router.put("/profile", protect, updateUserProfile);
router.put("/reset-password", resetPassword);
router.put("/update/:id", protect, updateUser);

router.delete("/delete/:id", protect, deleteUser);

export default router;
