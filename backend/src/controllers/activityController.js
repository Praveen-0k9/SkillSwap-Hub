import Activity from "../models/Activity.js";

// @desc    Get all activities for a user
// @route   GET /api/activities
// @access  Public
export const getActivities = async (req, res) => {
  const { userId } = req.query;

  try {
    if (!userId) {
      return res.status(400).json({ message: "userId query parameter is required." });
    }

    const activities = await Activity.find({ userId }).sort({ createdAt: -1 });
    res.json({ activities });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a manual activity log
// @route   POST /api/activities
// @access  Private
export const createActivity = async (req, res) => {
  const { text, icon, color } = req.body;

  try {
    if (!text || !icon) {
      return res.status(400).json({ message: "Text and icon are required." });
    }

    const activity = await Activity.create({
      userId: req.user._id,
      text,
      icon,
      color: color || "text-primary bg-primary/10",
    });

    res.status(201).json({ activity });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
