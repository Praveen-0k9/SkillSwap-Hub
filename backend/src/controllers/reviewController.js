import Review from "../models/Review.js";
import User from "../models/User.js";
import Activity from "../models/Activity.js";

// @desc    Get all reviews for a user
// @route   GET /api/reviews
// @access  Public
export const getReviews = async (req, res) => {
  const { userId } = req.query;

  try {
    if (!userId) {
      return res.status(400).json({ message: "userId query parameter is required." });
    }

    const reviews = await Review.find({ userId }).sort({ createdAt: -1 });
    res.json({ reviews });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a review for a user
// @route   POST /api/reviews
// @access  Private
export const createReview = async (req, res) => {
  const { userId, rating, comment, skillName } = req.body;

  try {
    if (!userId || !rating || !comment || !skillName) {
      return res.status(400).json({ message: "Please include all required fields." });
    }

    // Prevent reviewing self
    if (userId.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: "You cannot review your own profile." });
    }

    // Create the review
    const review = await Review.create({
      userId,
      reviewerId: req.user._id,
      reviewerName: req.user.name,
      reviewerAvatar: req.user.avatar || "",
      rating,
      comment,
      skillName,
    });

    // Update target user's reviewCount and rating average
    const targetUser = await User.findById(userId);
    if (targetUser) {
      // Find all reviews for the target user to calculate new average rating
      const reviews = await Review.find({ userId });
      const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
      const newAverageRating = Math.round((totalRating / reviews.length) * 10) / 10;

      targetUser.reviewCount = reviews.length;
      targetUser.rating = newAverageRating;
      await targetUser.save();
    }

    // Create an Activity record for the target user (the one who got the review)
    await Activity.create({
      userId,
      text: `Received a ${rating}-star review from ${req.user.name} for "${skillName}"`,
      icon: "Award",
      color: "text-yellow-400 bg-yellow-400/10",
    });

    // Create an Activity record for the reviewer
    await Activity.create({
      userId: req.user._id,
      text: `Left a ${rating}-star review for ${targetUser ? targetUser.name : "another user"}`,
      icon: "Star",
      color: "text-primary bg-primary/10",
    });

    // Emit Socket.io notification in real time
    const io = req.app.get("io");
    if (io) {
      const Notification = (await import("../models/Notification.js")).default;
      const notification = await Notification.create({
        userId,
        senderId: req.user._id,
        type: "review",
        title: "New Review",
        message: `${req.user.name} left a ${rating}-star review for your skill "${skillName}"`,
        status: "accepted",
        read: false,
      });

      const formattedNotification = {
        id: notification._id,
        senderId: req.user._id,
        type: notification.type,
        title: notification.title,
        message: notification.message,
        status: notification.status,
        read: notification.read,
        timestamp: "just now",
        avatar: req.user.avatar || "",
      };

      io.to(userId.toString()).emit("newNotification", formattedNotification);
    }

    res.status(201).json({ review });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
