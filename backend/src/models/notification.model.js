import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  type: {
    enum : ["friend-request", "message", "like", "comment"],
    type: String,
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  message: {
    type: String,
    default: "You have a new notification.",
  },
  seen: {
    type: Boolean,
    default : false
  },
  status: {
    type: String,
    enum: ["accepted", "rejected"],
    default : 'rejected'
  }
}, {timestamps:true})

export const Notification = mongoose.model("Notification", notificationSchema);