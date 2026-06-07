import Skill from "../models/Skill.js";

// @desc    Get all skills or filtered by userId
// @route   GET /api/skills
// @access  Public
export const getSkills = async (req, res) => {
  try {
    const { userId, search, category, level } = req.query;
    let query = {};

    if (userId) {
      query.userId = userId;
    }

    if (category && category !== "all") {
      query.category = category;
    }

    if (level && level !== "all") {
      query.level = level;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const skills = await Skill.find(query).sort({ createdAt: -1 });
    res.json({ skills });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new skill
// @route   POST /api/skills
// @access  Private
export const createSkill = async (req, res) => {
  const { name, category, description, level } = req.body;

  try {
    if (!name || !category) {
      return res.status(400).json({ message: "Skill name and category are required." });
    }

    const skill = await Skill.create({
      name,
      category,
      description: description || `Learn ${name} with me!`,
      level: level || "Intermediate",
      userId: req.user._id,
      userName: req.user.name,
      userAvatar: req.user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(req.user.name)}`,
      rating: 5.0,
      bookmarked: false,
      learners: 0
    });

    // Create an Activity record
    const Activity = (await import("../models/Activity.js")).default;
    await Activity.create({
      userId: req.user._id,
      text: `Started teaching ${name} (${level || "Intermediate"})`,
      icon: "BookOpen",
      color: "text-primary bg-primary/10",
    });

    res.status(201).json({ skill });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle bookmark status of a skill
// @route   PUT /api/skills/:id/bookmark
// @access  Private
export const toggleSkillBookmark = async (req, res) => {
  const { id } = req.params;

  try {
    const skill = await Skill.findById(id);
    if (!skill) {
      return res.status(404).json({ message: "Skill not found." });
    }

    skill.bookmarked = !skill.bookmarked;
    await skill.save();

    res.json({ skill });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a skill
// @route   PUT /api/skills/:id
// @access  Private
export const updateSkill = async (req, res) => {
  const { id } = req.params;
  const { name, category, description, level } = req.body;

  try {
    const skill = await Skill.findById(id);
    if (!skill) {
      return res.status(404).json({ message: "Skill not found." });
    }

    // Verify ownership
    if (skill.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "You are not authorized to update this skill." });
    }

    if (name) skill.name = name;
    if (category) skill.category = category;
    if (description !== undefined) skill.description = description;
    if (level) skill.level = level;

    const updatedSkill = await skill.save();

    // Create an Activity record
    const Activity = (await import("../models/Activity.js")).default;
    await Activity.create({
      userId: req.user._id,
      text: `Updated skill: ${updatedSkill.name}`,
      icon: "BookOpen",
      color: "text-primary bg-primary/10",
    });

    res.json({ skill: updatedSkill });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a skill
// @route   DELETE /api/skills/:id
// @access  Private
export const deleteSkill = async (req, res) => {
  const { id } = req.params;

  try {
    const skill = await Skill.findById(id);
    if (!skill) {
      return res.status(404).json({ message: "Skill not found." });
    }

    // Verify ownership
    if (skill.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "You are not authorized to delete this skill." });
    }

    await Skill.findByIdAndDelete(id);

    // Create an Activity record
    const Activity = (await import("../models/Activity.js")).default;
    await Activity.create({
      userId: req.user._id,
      text: `Removed skill: ${skill.name}`,
      icon: "X",
      color: "text-red-400 bg-red-400/10",
    });

    res.json({ message: "Skill deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
