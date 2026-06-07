import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  bio: {
    type: String,
    default: "Passionate about swapping skills and collaborating on cool projects!",
  },
  skills: {
    type: [String],
    default: ["React", "Node.js", "UI/UX Design"],
  },
  avatar: {
    type: String,
    default: "",
  },
  verified: {
    type: Boolean,
    default: false,
  },
  joinedDate: {
    type: Date,
    default: Date.now,
  },
  rating: {
    type: Number,
    default: 5.0,
  },
  reviewCount: {
    type: Number,
    default: 0,
  },
  resetPasswordToken: {
    type: String,
    default: null,
  },
  resetPasswordExpires: {
    type: Date,
    default: null,
  },
  twoFactorEnabled: {
    type: Boolean,
    default: false,
  },
  notifications: {
    collabRequests: { type: Boolean, default: true },
    newMessages: { type: Boolean, default: true },
    reviews: { type: Boolean, default: true },
    weeklyDigest: { type: Boolean, default: false },
    marketing: { type: Boolean, default: false },
  },
  privacy: {
    profileVisibility: { type: Boolean, default: true },
    showOnlineStatus: { type: Boolean, default: true },
    allowDMs: { type: Boolean, default: true },
    showEmail: { type: Boolean, default: false },
  },
  twoFactorCode: {
    type: String,
    default: null,
  },
  twoFactorExpires: {
    type: Date,
    default: null,
  },
});

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
