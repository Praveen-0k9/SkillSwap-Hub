import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    trim: true,
  },
  reporter: {
    type: String,
    required: true,
    trim: true,
  },
  reported: {
    type: String,
    required: true,
    trim: true,
  },
  reason: {
    type: String,
    required: true,
    trim: true,
  },
  status: {
    type: String,
    enum: ["pending", "resolved", "dismissed"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Report = mongoose.model("Report", reportSchema);
export default Report;
