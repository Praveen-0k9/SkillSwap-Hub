import Notification from "../models/Notification.js";

// @desc    Get all notifications for logged-in user
// @route   GET /api/notifications
// @access  Private
export const getNotifications = async (req, res) => {
  try {
    const notificationsList = await Notification.find({ userId: req.user._id })
      .populate("senderId", "name avatar")
      .sort({ createdAt: -1 });

    // Format notifications to match frontend keys
    const notifications = notificationsList.map((n) => {
      // Calculate a readable relative time string
      const secondsAgo = Math.floor((Date.now() - new Date(n.createdAt)) / 1000);
      let timestamp = "just now";
      if (secondsAgo >= 60) {
        const minutesAgo = Math.floor(secondsAgo / 60);
        if (minutesAgo >= 60) {
          const hoursAgo = Math.floor(minutesAgo / 60);
          if (hoursAgo >= 24) {
            const daysAgo = Math.floor(hoursAgo / 24);
            timestamp = `${daysAgo}d ago`;
          } else {
            timestamp = `${hoursAgo}h ago`;
          }
        } else {
          timestamp = `${minutesAgo}m ago`;
        }
      }

      return {
        id: n._id,
        senderId: n.senderId ? (n.senderId._id || n.senderId) : null,
        type: n.type,
        title: n.title,
        message: n.message,
        status: n.status,
        read: n.read,
        timestamp,
        avatar: n.senderId ? n.senderId.avatar : "",
        referenceId: n.referenceId,
      };
    });

    res.json({ notifications });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Mark a single notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
export const markNotificationRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({ message: "Notification not found." });
    }

    if (notification.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized." });
    }

    notification.read = true;
    const updatedNotification = await notification.save();

    res.json({ notification: updatedNotification });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private
export const markAllNotificationsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { userId: req.user._id, read: false },
      { $set: { read: true } }
    );
    res.json({ message: "All notifications marked as read successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Mark all chat notifications from a specific sender as read
// @route   PUT /api/notifications/read-chat/:senderId
// @access  Private
export const markChatNotificationsRead = async (req, res) => {
  const { senderId } = req.params;
  const myId = req.user._id;

  try {
    await Notification.updateMany(
      { userId: myId, senderId, type: "message", read: false },
      { $set: { read: true } }
    );
    res.json({ message: "Chat notifications marked as read." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
