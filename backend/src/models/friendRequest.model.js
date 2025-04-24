import mongoose from "mongoose";

const friendRequestSchema = new mongoose.Schema({

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
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending",
  },
  message: {
    type: String,
    default: "Hey! Let's connect.",
  },

},{timestamps: true})

export const FriendRequest = mongoose.model("FriendRequest", friendRequestSchema);