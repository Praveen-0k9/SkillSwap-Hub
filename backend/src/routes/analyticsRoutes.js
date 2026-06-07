import express from "express";
import { getAnalyticsOverview } from "../controllers/analyticsController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/overview", protect, getAnalyticsOverview);

export default router;
