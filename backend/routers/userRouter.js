import express from "express";
import { protect } from "../middlewares/authMiddlware.js";
import {
  deleteUser,
  loginUser,
  logoutUser,
  registerUser,
  resetPassword,
  sendOtp,
  updateUser,
  updateUserProfile,
} from "../controllers/userController.js";

const router = express.Router();

// router.get("/", protect, getUsers);
// router.get("/:id", protect, getUserDetails);

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", protect, logoutUser);
router.post("/send-otp", sendOtp);

router.put("/profile", protect, updateUserProfile);
router.put("/reset-password", resetPassword);
router.put("/update/:id", protect, updateUser);

router.delete("/delete/:id", protect, deleteUser);

export default router;
