import express from "express";
import http from "http";
import jwt from "jsonwebtoken";
import { Server as SocketIOServer } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import skillRoutes from "./routes/skillRoutes.js";
import connectionRoutes from "./routes/connectionRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import activityRoutes from "./routes/activityRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Middlewares
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174"], // Allow both Vite dev ports
  credentials: true
}));
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/connections", connectionRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/activities", activityRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/admin", adminRoutes);

// Base route
app.get("/", (req, res) => {
  res.send("SkillSwap Hub API is running...");
});

// Port configuration
const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

// Initialize Socket.io
const io = new SocketIOServer(server, {
  cors: { origin: "*" },
});

// Set io instance in app context
app.set("io", io);

// Socket.io authentication middleware
io.use(async (socket, next) => {
  const token = socket.handshake.auth?.token;
  if (!token) return next(new Error("Authentication error: No token"));
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await (await import("./models/User.js")).default.findById(decoded.id);
    if (!user) return next(new Error("Authentication error: User not found"));
    socket.user = user;
    next();
  } catch (err) {
    console.error("Socket auth error:", err.message);
    next(new Error("Authentication error"));
  }
});

// Basic connection handling
io.on("connection", (socket) => {
  console.log(`🔌 User ${socket.user._id} connected via Socket.io`);
  
  // Join personal room for real-time notifications
  socket.join(socket.user._id.toString());

  socket.on("joinRoom", (roomId) => socket.join(roomId));
  socket.on("sendMessage", async ({ roomId, content }) => {
    const Message = (await import("./models/Message.js")).default;
    let msg = await Message.create({
      roomId,
      senderId: socket.user._id,
      content,
    });
    msg = await msg.populate("senderId", "name avatar");
    
    // Map backend Message response to match frontend format
    const formattedMsg = {
      id: msg._id,
      roomId: msg.roomId,
      senderId: msg.senderId?._id,
      senderName: msg.senderId?.name,
      content: msg.content,
      createdAt: msg.createdAt,
      timestamp: new Date(msg.createdAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    io.to(roomId).emit("newMessage", formattedMsg);

    // Create and emit message notification to the receiver
    try {
      const Chat = (await import("./models/Chat.js")).default;
      const chat = await Chat.findById(roomId);
      if (chat) {
        const receiverId = chat.participants.find(
          (p) => p.toString() !== socket.user._id.toString()
        );
        if (receiverId) {
          const Notification = (await import("./models/Notification.js")).default;
          const notification = await Notification.create({
            userId: receiverId,
            senderId: socket.user._id,
            type: "message",
            title: "New Message",
            message: `${socket.user.name}: ${content.substring(0, 50)}${content.length > 50 ? "..." : ""}`,
            status: "accepted",
            referenceId: roomId,
            read: false,
          });

          const formattedNotification = {
            id: notification._id,
            senderId: socket.user._id,
            type: notification.type,
            title: notification.title,
            message: notification.message,
            status: notification.status,
            read: notification.read,
            timestamp: "just now",
            avatar: socket.user.avatar || "",
            referenceId: notification.referenceId,
          };

          io.to(receiverId.toString()).emit("newNotification", formattedNotification);
        }
      }
    } catch (err) {
      console.error("Failed to create message notification:", err.message);
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
