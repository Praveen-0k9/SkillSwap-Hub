import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getOrCreateChat,
  getChatRooms,
  getMessages,
} from "../controllers/chatController.js";

const router = express.Router();

router.post("/room", protect, getOrCreateChat);
router.get("/rooms", protect, getChatRooms);
router.get("/room/:chatId/messages", protect, getMessages);

export default router;
