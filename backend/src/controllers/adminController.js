import User from "../models/User.js";
import Skill from "../models/Skill.js";
import Report from "../models/Report.js";

// @desc    Get admin dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
export const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalSkills = await Skill.countDocuments();
    const pendingReports = await Report.countDocuments({ status: "pending" });
    const blockedUsers = await User.countDocuments({ status: "banned" });

    res.json({
      totalUsers,
      totalSkills,
      pendingReports,
      blockedUsers,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all users for management
// @route   GET /api/admin/users
// @access  Private/Admin
export const getAdminUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle user verification status
// @route   PUT /api/admin/users/:id/verify
// @access  Private/Admin
export const toggleUserVerify = async (req, res) => {
  const { id } = req.params;
  const { verified } = req.body;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    user.verified = verified;
    await user.save();

    res.json({ message: `Verification status updated successfully.`, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle suspension of a user
// @route   PUT /api/admin/users/:id/ban
// @access  Private/Admin
export const toggleUserBan = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Protect safety mechanism: Cannot suspend admin accounts
    if (user.role === "admin") {
      return res.status(400).json({ message: "Admin accounts cannot be suspended." });
    }

    user.status = user.status === "banned" ? "offline" : "banned";
    await user.save();

    res.json({ message: `User status set to ${user.status}.`, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all skills for moderation
// @route   GET /api/admin/skills
// @access  Private/Admin
export const getAdminSkills = async (req, res) => {
  try {
    const skills = await Skill.find({}).sort({ createdAt: -1 });
    res.json(skills);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle deactivation status of a skill
// @route   PUT /api/admin/skills/:id/status
// @access  Private/Admin
export const toggleSkillStatus = async (req, res) => {
  const { id } = req.params;

  try {
    const skill = await Skill.findById(id);
    if (!skill) {
      return res.status(404).json({ message: "Skill not found." });
    }

    skill.deactivated = !skill.deactivated;
    await skill.save();

    res.json({ message: `Skill deactivation status updated.`, skill });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all reports
// @route   GET /api/admin/reports
// @access  Private/Admin
export const getAdminReports = async (req, res) => {
  try {
    const reports = await Report.find({}).sort({ createdAt: -1 });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Resolve a report
// @route   PUT /api/admin/reports/:id/resolve
// @access  Private/Admin
export const resolveReport = async (req, res) => {
  const { id } = req.params;

  try {
    const report = await Report.findById(id);
    if (!report) {
      return res.status(404).json({ message: "Report not found." });
    }

    report.status = "resolved";
    await report.save();

    res.json({ message: "Report resolved successfully.", report });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Dismiss a report
// @route   PUT /api/admin/reports/:id/dismiss
// @access  Private/Admin
export const dismissReport = async (req, res) => {
  const { id } = req.params;

  try {
    const report = await Report.findById(id);
    if (!report) {
      return res.status(404).json({ message: "Report not found." });
    }

    report.status = "dismissed";
    await report.save();

    res.json({ message: "Report dismissed successfully.", report });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
