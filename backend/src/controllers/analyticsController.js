import Skill from "../models/Skill.js";
import Connection from "../models/Connection.js";
import Review from "../models/Review.js";
import Activity from "../models/Activity.js";
import Message from "../models/Message.js";
import User from "../models/User.js";

// @desc    Get real-time analytics overview for the logged-in user
// @route   GET /api/analytics/overview
// @access  Private
export const getAnalyticsOverview = async (req, res) => {
  const userId = req.user._id;

  try {
    // 1. Fetch user's skills
    const userSkills = await Skill.find({ userId });

    // 2. Fetch user's active connections
    const activeConnections = await Connection.find({
      $or: [{ senderId: userId }, { receiverId: userId }],
      status: "accepted"
    });

    // 3. Fetch user's reviews
    const userReviews = await Review.find({ userId });

    // 4. Fetch user's activities
    const userActivities = await Activity.find({ userId });

    // 5. Count actual messages sent by the logged-in user
    const messagesSentCount = await Message.countDocuments({ senderId: userId });

    // 6. Calculate total views (learners-based base views + reviews bonus)
    const totalViews = userSkills.reduce((sum, s) => sum + (s.learners || 0) * 12 + 25, 0) + (req.user.reviewCount || 0) * 15;

    // 7. Calculate weekly views (trailing 7 days dynamically based on actual activity date peaks)
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const weeklyViews = [];
    
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toDateString();

      // Count operations on this specific date
      const activitiesOnDay = userActivities.filter(
        a => new Date(a.createdAt).toDateString() === dateStr
      ).length;

      const connectionsOnDay = activeConnections.filter(
        c => new Date(c.createdAt).toDateString() === dateStr
      ).length;

      const reviewsOnDay = userReviews.filter(
        r => new Date(r.createdAt).toDateString() === dateStr
      ).length;

      // Base views for a day is 20, plus multiplier for real actions
      const dayViews = 25 + (activitiesOnDay * 5) + (connectionsOnDay * 15) + (reviewsOnDay * 20);

      weeklyViews.push({
        day: daysOfWeek[d.getDay()],
        views: dayViews
      });
    }

    // 8. Calculate Skill Demand Score dynamically from database skills grouped by category
    const globalDemand = await Skill.aggregate([
      {
        $group: {
          _id: "$category",
          totalLearners: { $sum: "$learners" },
          skillCount: { $sum: 1 }
        }
      },
      { $sort: { totalLearners: -1, skillCount: -1 } },
      { $limit: 5 }
    ]);

    const skillDemand = globalDemand.map(cat => ({
      name: cat._id,
      pct: Math.min(100, Math.max(30, Math.round(cat.totalLearners * 4 + cat.skillCount * 8)))
    }));

    // Fill with default categories if there are fewer than 5 unique categories in database
    const defaultCategories = [
      { name: "Web Development", pct: 85 },
      { name: "Data Science", pct: 78 },
      { name: "Mobile Development", pct: 68 },
      { name: "Design", pct: 60 },
      { name: "DevOps", pct: 55 }
    ];

    while (skillDemand.length < 5 && defaultCategories.length > 0) {
      const def = defaultCategories.shift();
      if (!skillDemand.some(d => d.name === def.name)) {
        skillDemand.push(def);
      }
    }

    // 9. Calculate Skills Performance list
    const skillsPerformance = userSkills.map(s => {
      const views = (s.learners || 0) * 12 + 25;
      const engagement = Math.min(100, Math.round((s.rating || 5.0) * 16 + (s.learners || 0) * 2.5));
      return {
        skill: s.name,
        views,
        rating: s.rating || 5.0,
        engagement
      };
    });

    res.json({
      totalViews,
      newConnectionsCount: activeConnections.length,
      avgRating: req.user.rating || 5.0,
      messagesSentCount,
      weeklyViews,
      skillDemand,
      skillsPerformance
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
