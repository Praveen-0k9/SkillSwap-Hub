import express from "express";
import {
  registerUser,
  loginUser,
  getMe,
  forgotPassword,
  resetPassword,
  updateProfile,
  verify2FA,
  updateSecuritySettings,
  updateNotificationsSettings,
  updatePrivacySettings,
  deleteUserAccount,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/verify-2fa", verify2FA);
router.get("/me", protect, getMe);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.put("/profile", protect, updateProfile);
router.put("/settings/security", protect, updateSecuritySettings);
router.put("/settings/notifications", protect, updateNotificationsSettings);
router.put("/settings/privacy", protect, updatePrivacySettings);
router.delete("/profile", protect, deleteUserAccount);

export default router;
