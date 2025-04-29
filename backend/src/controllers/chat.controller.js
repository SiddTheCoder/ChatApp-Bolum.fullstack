import { Chat } from '../models/chat.model.js'; 
import {asyncHandler} from '../utils/asyncHandler.js';
import {ApiError} from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ChatMessage } from '../models/chatMessage.model.js';

export const findOrCreateChatAndGetAllMessages  = asyncHandler(async (req, res) => {
  const { friendId } = req.query;  

  const currentUserId = req.user?._id

  if (!friendId) {
    throw new ApiError(400, 'Friend ID is required');
  }

  let chat;
   chat = await Chat.findOne({
      isGroupChat: false,
      members: { $all: [currentUserId, friendId], $size: 2 },
   }).populate('members', '-password') 
  
   
    

  if (!chat) {
      // If no chat exists, create a new one
      chat = await Chat.create({
        members: [currentUserId, friendId],
      });
      chat = await chat.populate('members', '-password');
  }

  // Now fetch all the messages for this chat
  const messages = await ChatMessage.find({ chat: chat._id })
    .populate('sender', 'username avatar fullname')
    .sort({ createdAt: 1 }); // Sort by creation date (oldest first)

 
  
  return res
    .status(200)
    .json(new ApiResponse(200, messages, 'Messages fetched successfully'));
});
