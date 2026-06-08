import Chat from "../models/Chat.js";
import Message from "../models/Message.js";
import User from "../models/User.js";

// @desc    Get or create a private chat room between two users
// @route   POST /api/chat/room
// @access  Private
export const getOrCreateChat = async (req, res) => {
  const { otherUserId } = req.body;
  const myId = req.user._id;

  try {
    if (!otherUserId) {
      return res.status(400).json({ message: "Other user ID is required." });
    }

    // Check if other user exists
    const otherUser = await User.findById(otherUserId);
    if (!otherUser) {
      return res.status(404).json({ message: "User not found." });
    }

    // Find existing chat room containing both participants
    let chat = await Chat.findOne({
      participants: { $all: [myId, otherUserId] },
    });

    if (!chat) {
      chat = await Chat.create({
        participants: [myId, otherUserId],
      });
    }

    res.status(200).json({ chatId: chat._id, otherUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all active chat rooms for the logged-in user
// @route   GET /api/chat/rooms
// @access  Private
export const getChatRooms = async (req, res) => {
  const myId = req.user._id;

  try {
    // Find all chats where user is a participant
    const chats = await Chat.find({ participants: myId })
      .populate("participants", "name avatar email bio online rating")
      .sort({ createdAt: -1 });

    const rooms = await Promise.all(
      chats.map(async (chat) => {
        // Find the last message in this room
        const lastMsg = await Message.findOne({ roomId: chat._id })
          .sort({ createdAt: -1 })
          .populate("senderId", "name avatar");

        // Find the other participant's user info
        const otherUser = chat.participants.find(
          (p) => p._id.toString() !== myId.toString()
        );

        return {
          chatId: chat._id,
          otherUser: otherUser || null,
          lastMessage: lastMsg ? {
            id: lastMsg._id,
            content: lastMsg.content,
            senderId: lastMsg.senderId?._id,
            senderName: lastMsg.senderId?.name,
            createdAt: lastMsg.createdAt,
            // Readable time for UI compatibility
            timestamp: new Date(lastMsg.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          } : null,
        };
      })
    );

    // Sort rooms so that the one with the newest last message is first
    rooms.sort((a, b) => {
      const dateA = a.lastMessage ? new Date(a.lastMessage.createdAt) : new Date(0);
      const dateB = b.lastMessage ? new Date(b.lastMessage.createdAt) : new Date(0);
      return dateB - dateA;
    });

    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all messages for a specific chat room
// @route   GET /api/chat/room/:chatId/messages
// @access  Private
export const getMessages = async (req, res) => {
  const { chatId } = req.params;
  const myId = req.user._id;

  try {
    // Ensure user is part of this chat room
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: "Chat room not found." });
    }

    if (!chat.participants.includes(myId)) {
      return res.status(401).json({ message: "Not authorized to access this chat." });
    }

    const messagesList = await Message.find({ roomId: chatId })
      .sort({ createdAt: 1 })
      .populate("senderId", "name avatar");

    const messages = messagesList.map((m) => ({
      id: m._id,
      senderId: m.senderId?._id,
      senderName: m.senderId?.name,
      content: m.content,
      createdAt: m.createdAt,
      timestamp: new Date(m.createdAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    }));

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
