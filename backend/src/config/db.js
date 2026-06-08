import mongoose from "mongoose";
import Skill from "../models/Skill.js";
import User from "../models/User.js";
import Review from "../models/Review.js";
import Activity from "../models/Activity.js";
import Report from "../models/Report.js";

const seedSkills = async () => {
  try {
    const count = await Skill.countDocuments();
    if (count === 0) {
      console.log("🌱 Skill collection is empty. Seeding mock skills...");
      
      // Seed default users to associate the skills with
      let sarah = await User.findOne({ email: "sarah.chen@email.com" });
      if (!sarah) {
        sarah = await User.create({
          name: "Sarah Chen",
          email: "sarah.chen@email.com",
          password: "password123",
          bio: "Data scientist specializing in ML and AI. Love teaching and collaborating on innovative projects.",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
          verified: true,
          rating: 4.9,
          reviewCount: 31,
        });
      }
      // Alias email for easier testing (sarah@example.com)
      let sarahAlias = await User.findOne({ email: "sarah@example.com" });
      if (!sarahAlias) {
        await User.create({
          name: "Sarah Chen",
          email: "sarah@example.com",
          password: "password123",
          bio: "Data scientist specializing in ML and AI. Love teaching and collaborating on innovative projects.",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
          verified: true,
          rating: 4.9,
          reviewCount: 31,
        });
      }

      let marcus = await User.findOne({ email: "marcus.t@email.com" });
      if (!marcus) {
        marcus = await User.create({
          name: "Marcus Thompson",
          email: "marcus.t@email.com",
          password: "password123",
          bio: "Mobile app developer with expertise in React Native and Flutter. Building the future one app at a time.",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus",
          verified: true,
          rating: 4.7,
          reviewCount: 18,
        });
      }
      // Alias email for testing (marcus@example.com)
      let marcusAlias = await User.findOne({ email: "marcus@example.com" });
      if (!marcusAlias) {
        await User.create({
          name: "Marcus Thompson",
          email: "marcus@example.com",
          password: "password123",
          bio: "Mobile app developer with expertise in React Native and Flutter. Building the future one app at a time.",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus",
          verified: true,
          rating: 4.7,
          reviewCount: 18,
        });
      }

      let emily = await User.findOne({ email: "emily.r@email.com" });
      if (!emily) {
        emily = await User.create({
          name: "Emily Rodriguez",
          email: "emily.r@email.com",
          password: "password123",
          bio: "UX/UI designer with a passion for creating beautiful, user-friendly interfaces.",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
          verified: true,
          rating: 5.0,
          reviewCount: 42,
        });
      }
      // Alias email for testing (emily@example.com)
      let emilyAlias = await User.findOne({ email: "emily@example.com" });
      if (!emilyAlias) {
        await User.create({
          name: "Emily Rodriguez",
          email: "emily@example.com",
          password: "password123",
          bio: "UX/UI designer with a passion for creating beautiful, user-friendly interfaces.",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
          verified: true,
          rating: 5.0,
          reviewCount: 42,
        });
      }

      let david = await User.findOne({ email: "david.kim@email.com" });
      if (!david) {
        david = await User.create({
          name: "David Kim",
          email: "david.kim@email.com",
          password: "password123",
          bio: "Backend engineer focused on scalable systems and cloud architecture.",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
          verified: true,
          rating: 4.6,
          reviewCount: 15,
        });
      }

      const mockSkills = [
        {
          name: 'Advanced React Patterns',
          category: 'Web Development',
          description: 'Learn advanced React patterns including hooks, context, and performance optimization techniques.',
          level: 'Advanced',
          userId: sarah._id,
          userName: 'Sarah Chen',
          userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
          rating: 4.9,
          bookmarked: true,
          learners: 15
        },
        {
          name: 'Machine Learning Fundamentals',
          category: 'Data Science',
          description: 'Introduction to ML concepts, algorithms, and practical implementation using Python and scikit-learn.',
          level: 'Intermediate',
          userId: sarah._id,
          userName: 'Sarah Chen',
          userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
          rating: 5.0,
          bookmarked: false,
          learners: 8
        },
        {
          name: 'Mobile App Development with Flutter',
          category: 'Mobile Development',
          description: 'Build beautiful cross-platform mobile apps using Flutter and Dart.',
          level: 'Intermediate',
          userId: marcus._id,
          userName: 'Marcus Thompson',
          userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus',
          rating: 4.8,
          bookmarked: true,
          learners: 12
        },
        {
          name: 'UI/UX Design Principles',
          category: 'Design',
          description: 'Master the fundamentals of user interface and user experience design.',
          level: 'Beginner',
          userId: emily._id,
          userName: 'Emily Rodriguez',
          userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
          rating: 5.0,
          bookmarked: false,
          learners: 20
        },
        {
          name: 'Cloud Architecture with AWS',
          category: 'DevOps',
          description: 'Learn to design and deploy scalable cloud solutions using Amazon Web Services.',
          level: 'Advanced',
          userId: david._id,
          userName: 'David Kim',
          userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
          rating: 4.7,
          bookmarked: false,
          learners: 5
        },
        {
          name: 'Python for Data Analysis',
          category: 'Data Science',
          description: 'Use Python, Pandas, and NumPy for data manipulation and analysis.',
          level: 'Intermediate',
          userId: sarah._id,
          userName: 'Sarah Chen',
          userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
          rating: 4.9,
          bookmarked: true,
          learners: 14
        },
        {
          name: 'TypeScript Best Practices',
          category: 'Web Development',
          description: 'Write better, safer code with TypeScript types, interfaces, and advanced features.',
          level: 'Intermediate',
          userId: sarah._id, // Map TypeScript to Sarah or default User
          userName: 'Sarah Chen',
          userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
          rating: 4.6,
          bookmarked: false,
          learners: 22
        },
        {
          name: 'Docker & Containerization',
          category: 'DevOps',
          description: 'Master containerization with Docker for efficient application deployment.',
          level: 'Intermediate',
          userId: david._id,
          userName: 'David Kim',
          userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
          rating: 4.8,
          bookmarked: false,
          learners: 9
        }
      ];

      await Skill.insertMany(mockSkills);
      console.log("🌱 Mock skills seeded successfully!");
    }
  } catch (error) {
    console.error("❌ Failed to seed skills database:", error.message);
  }
};

const seedReviewsAndActivities = async () => {
  try {
    let sarah = await User.findOne({ email: "sarah.chen@email.com" });
    if (!sarah) return;

    // Seed reviews for Sarah Chen if empty
    const reviewCount = await Review.countDocuments({ userId: sarah._id });
    if (reviewCount === 0) {
      console.log("🌱 Review collection is empty for Sarah Chen. Seeding reviews...");
      await Review.create([
        {
          userId: sarah._id,
          reviewerId: new mongoose.Types.ObjectId(),
          reviewerName: "Emily Rodriguez",
          reviewerAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
          rating: 5,
          comment: "Excellent teacher — very patient and knowledgeable about React.",
          skillName: "Advanced React Patterns",
        },
        {
          userId: sarah._id,
          reviewerId: new mongoose.Types.ObjectId(),
          reviewerName: "Marcus Thompson",
          reviewerAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus",
          rating: 5,
          comment: "Great collaboration. Learned a lot about TypeScript in just one session.",
          skillName: "TypeScript Best Practices",
        },
        {
          userId: sarah._id,
          reviewerId: new mongoose.Types.ObjectId(),
          reviewerName: "David Kim",
          reviewerAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
          rating: 4,
          comment: "Very helpful and responsive. Would definitely collaborate again.",
          skillName: "Python for Data Analysis",
        }
      ]);
    }

    // Seed activities for Sarah Chen if empty
    const activityCount = await Activity.countDocuments({ userId: sarah._id });
    if (activityCount === 0) {
      console.log("🌱 Activity collection is empty for Sarah Chen. Seeding activities...");
      await Activity.create([
        {
          userId: sarah._id,
          text: "Started teaching Advanced React Patterns",
          icon: "BookOpen",
          color: "text-primary bg-primary/10",
        },
        {
          userId: sarah._id,
          text: "Connected with Sarah Chen",
          icon: "Users",
          color: "text-green-400 bg-green-400/10",
        },
        {
          userId: sarah._id,
          text: "Received 5-star review for TypeScript skill",
          icon: "Award",
          color: "text-yellow-400 bg-yellow-400/10",
        },
        {
          userId: sarah._id,
          text: "Completed collaboration with Marcus Thompson",
          icon: "MessageSquare",
          color: "text-blue-400 bg-blue-400/10",
        }
      ]);
    }
  } catch (error) {
    console.error("❌ Failed to seed reviews/activities:", error.message);
  }
};

const seedReports = async () => {
  try {
    const count = await Report.countDocuments();
    if (count === 0) {
      console.log("🌱 Report collection is empty. Seeding mock reports...");
      const mockReports = [
        { type: "Inappropriate Content", reporter: "Sarah Chen", reported: "John Doe", reason: "Spam messages in chat", status: "pending" },
        { type: "Fake Skill", reporter: "Marcus Thompson", reported: "Jane Smith", reason: "Skill description does not match content", status: "pending" },
        { type: "Harassment", reporter: "Emily Rodriguez", reported: "Bob Wilson", reason: "Rude behavior during collaboration", status: "pending" },
      ];
      await Report.insertMany(mockReports);
      console.log("🌱 Mock reports seeded successfully!");
    }
  } catch (error) {
    console.error("❌ Failed to seed reports database:", error.message);
  }
};

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // Auto-update user's account to admin
    await User.updateOne(
      { email: "praveenkumar37025@gmail.com" },
      { $set: { role: "admin" } }
    );
    console.log("👮 Ensured user praveenkumar37025@gmail.com is designated as Admin");

    await seedSkills();
    await seedReviewsAndActivities();
    await seedReports();
  } catch (error) {
    console.error(`Database Connection Error: ${error.message}`);
    process.exit(1);
  }
};
