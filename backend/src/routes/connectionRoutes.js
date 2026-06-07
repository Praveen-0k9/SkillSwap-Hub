import express from "express";
import {
  sendConnectionRequest,
  getConnections,
  updateConnectionStatus,
  disconnectUser,
} from "../controllers/connectionController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getConnections);
router.post("/request", protect, sendConnectionRequest);
router.put("/:id", protect, updateConnectionStatus);
router.delete("/:id", protect, disconnectUser);

export default router;
