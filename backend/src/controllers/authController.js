import User from "../models/User.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { sendEmail } from "../config/emailService.js";

// Helper to generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// Helper to format user response
const formatUserResponse = (user) => {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    bio: user.bio,
    skills: user.skills,
    avatar: user.avatar,
    verified: user.verified,
    joinedDate: user.joinedDate,
    rating: user.rating,
    reviewCount: user.reviewCount,
    twoFactorEnabled: user.twoFactorEnabled || false,
    role: user.role || "user",
    notifications: user.notifications || {
      collabRequests: true,
      newMessages: true,
      reviews: true,
      weeklyDigest: false,
      marketing: false,
    },
    privacy: user.privacy || {
      profileVisibility: true,
      showOnlineStatus: true,
      allowDMs: true,
      showEmail: false,
    },
  };
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please include all required fields." });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Email is already registered." });
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    if (user) {
      res.status(201).json({
        token: generateToken(user._id),
        user: formatUserResponse(user),
      });
    } else {
      res.status(400).json({ message: "Invalid user data." });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: "Please enter your email and password." });
    }

    const user = await User.findOne({ email });
    if (user && (await user.comparePassword(password))) {
      if (user.status === "banned") {
        return res.status(403).json({ message: "Your account has been suspended by an administrator." });
      }
      // If 2FA is enabled, intercept login, generate OTP and request verification
      if (user.twoFactorEnabled) {
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
        user.twoFactorCode = otpCode;
        user.twoFactorExpires = Date.now() + 5 * 60 * 1000; // 5 minutes validity
        await user.save();

        // Send OTP via Email
        await sendEmail({
          to: user.email,
          subject: "SkillSwap Hub - 2FA Verification Code",
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #070c18; color: #e2e8f0;">
              <h2 style="color: #6366f1; text-align: center;">SkillSwap Hub</h2>
              <h3 style="color: #ffffff; text-align: center;">Two-Factor Authentication (2FA)</h3>
              <p style="color: #94a3b8; font-size: 14px; line-height: 1.5; text-align: center;">
                Use the following 6-digit verification code to complete your sign-in. This code is valid for 5 minutes.
              </p>
              <div style="text-align: center; margin: 30px 0;">
                <span style="font-size: 32px; font-weight: bold; color: #6366f1; letter-spacing: 6px; background-color: #1e293b; padding: 12px 24px; border-radius: 8px; border: 1px solid #334155;">
                  ${otpCode}
                </span>
              </div>
              <p style="color: #64748b; font-size: 12px; text-align: center;">
                If you did not request this code, please secure your account immediately.
              </p>
            </div>
          `,
          text: `Your SkillSwap Hub 2FA code is: ${otpCode}. It is valid for 5 minutes.`,
          fallbackUrl: `2FA OTP CODE: ${otpCode}`
        });

        return res.json({
          require2FA: true,
          tempUserId: user._id,
        });
      }

      res.json({
        token: generateToken(user._id),
        user: formatUserResponse(user),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password." });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (user) {
      res.json(formatUserResponse(user));
    } else {
      res.status(404).json({ message: "User not found." });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    if (!email) {
      return res.status(400).json({ message: "Please provide an email address." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "No account with that email exists." });
    }

    // Generate secure random reset token
    const resetToken = crypto.randomBytes(20).toString("hex");

    // Save token and expiration (1 hour)
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    // Reset password URL (support port 5173 for active Vite instance)
    const resetUrl = `http://localhost:5173/reset-password?token=${resetToken}`;

    const htmlContent = `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #070c18; color: #e2e8f0;">
        <h2 style="color: #6366f1; text-align: center;">SkillSwap Hub</h2>
        <h3 style="color: #ffffff;">Password Reset Request</h3>
        <p style="color: #94a3b8; font-size: 14px; line-height: 1.5;">
          Hello ${user.name},
        </p>
        <p style="color: #94a3b8; font-size: 14px; line-height: 1.5;">
          We received a request to reset your password for your SkillSwap Hub account. 
          Please click the button below to choose a new password. This link will expire in 1 hour.
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #6366f1; color: #ffffff; text-decoration: none; padding: 12px 24px; font-weight: bold; border-radius: 6px; display: inline-block;">
            Reset Password
          </a>
        </div>
        <p style="color: #64748b; font-size: 12px;">
          If you did not request a password reset, you can safely ignore this email.
        </p>
      </div>
    `;

    const textContent = `
      SkillSwap Hub - Password Reset Request
      Hello ${user.name},
      We received a request to reset your password. Please copy and paste the link below into your browser to reset your password:
      ${resetUrl}
      This link will expire in 1 hour.
    `;

    // Invoke mail service
    const result = await sendEmail({
      to: email,
      subject: "SkillSwap Hub - Reset Password Link",
      html: htmlContent,
      text: textContent,
      fallbackUrl: resetUrl
    });

    if (result.sent) {
      res.json({
        message: "Password reset link has been successfully sent to your email inbox.",
      });
    } else {
      res.json({
        message: "In development mode: Reset link has been printed to the server console log. Please copy it from there.",
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Reset password using token
// @route   POST /api/auth/reset-password
// @access  Public
export const resetPassword = async (req, res) => {
  const { token, password } = req.body;

  try {
    if (!token || !password) {
      return res.status(400).json({ message: "Token and password are required." });
    }

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired reset token." });
    }

    // Set new password (pre-save middleware hashes password)
    user.password = password;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    res.json({ message: "Password reset completed successfully. You can now login with your new password." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile settings
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req, res) => {
  const { name, email, bio, avatar } = req.body;

  try {
    const user = await User.findById(req.user._id);

    if (user) {
      // Check if email is being changed and is already taken
      if (email && email !== user.email) {
        const emailExists = await User.findOne({ email });
        if (emailExists) {
          return res.status(400).json({ message: "Email is already taken by another account." });
        }
        user.email = email;
      }

      if (name) user.name = name;
      if (bio !== undefined) user.bio = bio;
      if (avatar !== undefined) user.avatar = avatar;

      const updatedUser = await user.save();

      res.json({
        user: formatUserResponse(updatedUser),
      });
    } else {
      res.status(404).json({ message: "User not found." });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const verify2FA = async (req, res) => {
  const { tempUserId, code } = req.body;

  try {
    if (!tempUserId || !code) {
      return res.status(400).json({ message: "User ID and code are required." });
    }

    const user = await User.findById(tempUserId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Check if passcode is correct and not expired
    if (!user.twoFactorCode || user.twoFactorCode !== code) {
      return res.status(400).json({ message: "Invalid verification code." });
    }

    if (!user.twoFactorExpires || new Date(user.twoFactorExpires) < new Date()) {
      return res.status(400).json({ message: "Verification code has expired." });
    }

    // Clear passcode fields on success
    user.twoFactorCode = null;
    user.twoFactorExpires = null;
    await user.save();

    res.json({
      token: generateToken(user._id),
      user: formatUserResponse(user),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update security settings (password & 2FA toggle)
// @route   PUT /api/auth/settings/security
// @access  Private
export const updateSecuritySettings = async (req, res) => {
  const { currentPassword, newPassword, enable2FA } = req.body;

  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // If updating password, validate current password
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({ message: "Please provide current password to update password." });
      }
      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        return res.status(400).json({ message: "Incorrect current password." });
      }
      user.password = newPassword;
    }

    user.twoFactorEnabled = enable2FA;
    await user.save();

    res.json({
      message: "Security settings updated successfully.",
      user: formatUserResponse(user),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update notification settings
// @route   PUT /api/auth/settings/notifications
// @access  Private
export const updateNotificationsSettings = async (req, res) => {
  const { notifications } = req.body;

  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    user.notifications = notifications;
    await user.save();

    res.json({
      message: "Notification settings updated successfully.",
      user: formatUserResponse(user),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update privacy settings
// @route   PUT /api/auth/settings/privacy
// @access  Private
export const updatePrivacySettings = async (req, res) => {
  const { privacy } = req.body;

  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    user.privacy = privacy;
    await user.save();

    res.json({
      message: "Privacy settings updated successfully.",
      user: formatUserResponse(user),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete user account and all associated records
// @route   DELETE /api/auth/profile
// @access  Private
export const deleteUserAccount = async (req, res) => {
  const userId = req.user._id;

  try {
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found." });
    }

    // Delete associated resources
    const Skill = (await import("../models/Skill.js")).default;
    await Skill.deleteMany({ userId });

    const Connection = (await import("../models/Connection.js")).default;
    await Connection.deleteMany({
      $or: [{ senderId: userId }, { receiverId: userId }],
    });

    const Review = (await import("../models/Review.js")).default;
    await Review.deleteMany({
      $or: [{ userId }, { reviewerId: userId }],
    });

    const Activity = (await import("../models/Activity.js")).default;
    await Activity.deleteMany({ userId });

    const Notification = (await import("../models/Notification.js")).default;
    await Notification.deleteMany({
      $or: [{ userId }, { senderId: userId }],
    });

    res.json({ message: "Account and all associated records deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

