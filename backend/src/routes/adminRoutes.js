import express from "express";
import {
  getAdminStats,
  getAdminUsers,
  toggleUserVerify,
  toggleUserBan,
  getAdminSkills,
  toggleSkillStatus,
  getAdminReports,
  resolveReport,
  dismissReport,
} from "../controllers/adminController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Apply core token validation and admin privilege verification middleware
router.use(protect);
router.use(admin);

router.get("/stats", getAdminStats);
router.get("/users", getAdminUsers);
router.put("/users/:id/verify", toggleUserVerify);
router.put("/users/:id/ban", toggleUserBan);
router.get("/skills", getAdminSkills);
router.put("/skills/:id/status", toggleSkillStatus);
router.get("/reports", getAdminReports);
router.put("/reports/:id/resolve", resolveReport);
router.put("/reports/:id/dismiss", dismissReport);

export default router;
