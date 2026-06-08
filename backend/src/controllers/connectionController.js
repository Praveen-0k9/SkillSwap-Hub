import Connection from "../models/Connection.js";
import Notification from "../models/Notification.js";
import User from "../models/User.js";

// @desc    Send a collaboration connection request
// @route   POST /api/connections/request
// @access  Private
export const sendConnectionRequest = async (req, res) => {
  const { receiverId, skillName, message } = req.body;

  try {
    if (!receiverId) {
      return res.status(400).json({ message: "Receiver ID is required." });
    }

    // Prevent connecting with oneself
    if (receiverId === req.user._id.toString()) {
      return res.status(400).json({ message: "You cannot connect with yourself." });
    }

    // Check if receiver exists
    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({ message: "User not found." });
    }

    // Check if request or connection already exists
    const existingConnection = await Connection.findOne({
      $or: [
        { senderId: req.user._id, receiverId },
        { senderId: receiverId, receiverId: req.user._id },
      ],
    });

    if (existingConnection) {
      return res.status(400).json({ message: "A connection request or active connection already exists with this user." });
    }

    // Create pending connection
    const connection = await Connection.create({
      senderId: req.user._id,
      receiverId,
      status: "pending",
      skillName: skillName || "",
      message: message || "",
    });

    // Create notification for receiver
    await Notification.create({
      userId: receiverId,
      senderId: req.user._id,
      type: "request",
      title: "New Collaboration Request",
      message: `${req.user.name} wants to collaborate on ${skillName || "a skill"}`,
      status: "pending",
      referenceId: connection._id,
    });

    res.status(201).json({ connection });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get active connections and connection suggestions
// @route   GET /api/connections
// @access  Private
export const getConnections = async (req, res) => {
  try {
    // Lazily seed default mock connections for this user if they don't have any connection records yet
    const connectionCount = await Connection.countDocuments({
      $or: [{ senderId: req.user._id }, { receiverId: req.user._id }],
    });

    if (connectionCount === 0) {
      console.log(`🌱 Lazily seeding mock connections for user: ${req.user.name}`);
      
      const sarah = await User.findOne({ email: "sarah.chen@email.com" });
      const marcus = await User.findOne({ email: "marcus.t@email.com" });
      const emily = await User.findOne({ email: "emily.r@email.com" });

      if (marcus && emily && sarah) {
        // Create 2 accepted connections
        await Connection.create([
          { senderId: req.user._id, receiverId: marcus._id, status: "accepted", skillName: "Mobile App Development with Flutter" },
          { senderId: emily._id, receiverId: req.user._id, status: "accepted", skillName: "UI/UX Design Principles" },
          // Create 1 pending request from Sarah
          { senderId: sarah._id, receiverId: req.user._id, status: "pending", skillName: "Advanced React Patterns", message: "Hi! I saw you are learning React. Let's collaborate!" }
        ]);

        const pendingConn = await Connection.findOne({ senderId: sarah._id, receiverId: req.user._id, status: "pending" });
        if (pendingConn) {
          await Notification.create({
            userId: req.user._id,
            senderId: sarah._id,
            type: "request",
            title: "New Collaboration Request",
            message: "Sarah Chen wants to collaborate on Advanced React Patterns",
            status: "pending",
            referenceId: pendingConn._id,
          });
        }

        // Also create a couple of other default notifications
        await Notification.create([
          {
            userId: req.user._id,
            senderId: emily._id,
            type: "review",
            title: "New Review",
            message: "Emily Rodriguez left a 5-star review for your skill",
            status: "accepted",
            read: false,
          },
          {
            userId: req.user._id,
            type: "system",
            title: "Profile Verified",
            message: "Your profile has been successfully verified by our support team!",
            status: "accepted",
            read: true,
          }
        ]);
      }
    }

    // Find accepted connections
    const activeConnections = await Connection.find({
      $or: [{ senderId: req.user._id }, { receiverId: req.user._id }],
      status: "accepted",
    });

    // Extract other user IDs in the connections
    const connectedUserIds = activeConnections.map((conn) =>
      conn.senderId.toString() === req.user._id.toString()
        ? conn.receiverId
        : conn.senderId
    );

    // Populate active connection users
    const connectionsList = await User.find({
      _id: { $in: connectedUserIds },
    }).select("-password");

    // Format connections matching frontend model and deduplicate by name
    const connections = [];
    const seenNames = new Set();
    
    for (const u of connectionsList) {
      if (seenNames.has(u.name)) {
        continue;
      }
      seenNames.add(u.name);
      
      const conn = activeConnections.find(
        (c) => c.senderId.toString() === u._id.toString() || c.receiverId.toString() === u._id.toString()
      );
      
      connections.push({
        id: u._id,
        connectionId: conn ? conn._id : null,
        name: u.name,
        email: u.email,
        bio: u.bio,
        avatar: u.avatar || "",
        skills: u.skills || [],
        rating: u.rating || 5.0,
        online: true, // Mock online state
        verified: u.verified || false,
        connectedAt: conn ? conn.createdAt : null,
      });
    }

    // Find all users connected to current user (pending or accepted) to exclude from suggestions
    const allConnections = await Connection.find({
      $or: [{ senderId: req.user._id }, { receiverId: req.user._id }],
    });
    const excludedUserIds = allConnections.map((conn) =>
      conn.senderId.toString() === req.user._id.toString()
        ? conn.receiverId
        : conn.senderId
    );
    excludedUserIds.push(req.user._id); // Exclude self

    // Generate suggestions (query all possible, filter by name/connection state, then limit to 6)
    const suggestionsList = await User.find({
      _id: { $nin: excludedUserIds },
    }).select("-password");

    const suggestions = [];
    const seenSuggestionNames = new Set();
    
    // Do not suggest someone who is already a connection
    for (const name of seenNames) {
      seenSuggestionNames.add(name);
    }

    for (const u of suggestionsList) {
      if (seenSuggestionNames.has(u.name)) {
        continue;
      }
      seenSuggestionNames.add(u.name);
      
      suggestions.push({
        id: u._id,
        name: u.name,
        initials: u.name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase(),
        bio: u.bio,
        skills: u.skills || [],
        mutual: Math.floor(Math.random() * 8) + 1, // Mock mutual count
      });
      
      if (suggestions.length >= 6) {
        break;
      }
    }

    res.json({ connections, suggestions });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Accept or decline a connection request
// @route   PUT /api/connections/:id
// @access  Private
export const updateConnectionStatus = async (req, res) => {
  const { status } = req.body; // 'accepted' or 'declined'
  const connectionId = req.params.id;

  try {
    if (!["accepted", "declined"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value. Must be accepted or declined." });
    }

    const connection = await Connection.findById(connectionId);
    if (!connection) {
      return res.status(404).json({ message: "Connection request not found." });
    }

    // Verify receiver is the logged-in user
    if (connection.receiverId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized to modify this request." });
    }

    connection.status = status;
    const updatedConnection = await connection.save();

    // Update matching notification
    const notification = await Notification.findOne({
      referenceId: connectionId,
      userId: req.user._id,
    });

    if (notification) {
      notification.status = status;
      notification.read = true;
      await notification.save();
    }

    // Create system notification for sender on acceptance
    if (status === "accepted") {
      await Notification.create({
        userId: connection.senderId,
        senderId: req.user._id,
        type: "system",
        title: "Request Accepted",
        message: `${req.user.name} accepted your collaboration request for ${connection.skillName || "skills"}`,
        status: "accepted",
      });
    }

    res.json({ connection: updatedConnection });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Disconnect/Remove connection
// @route   DELETE /api/connections/:id
// @access  Private
export const disconnectUser = async (req, res) => {
  const connectionId = req.params.id;

  try {
    const connection = await Connection.findOneAndDelete({
      _id: connectionId,
      $or: [{ senderId: req.user._id }, { receiverId: req.user._id }],
    });

    if (!connection) {
      return res.status(404).json({ message: "Connection not found or unauthorized." });
    }

    res.json({ message: "Connection successfully removed." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
