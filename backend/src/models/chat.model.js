import mongoose from 'mongoose'

const chatSchema = new mongoose.Schema({
  chatName: {
    type: String,
    trim : true,
  },
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required : true
    },
  ],
  isGroupChat: {
    type: Boolean,
    default: false
  },
  lastMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref : 'ChatMessage'
  },
   lastUpdated: {
      type: Date,
      default: Date.now,
    },
}, {timestamps : true})

export const Chat = mongoose.model('Chat',chatSchema)