import { Chat } from '../models/chat.model.js'; 
import {asyncHandler} from '../utils/asyncHandler.js';
import {ApiError} from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ChatMessage } from '../models/chatMessage.model.js';
import { User } from '../models/user.model.js';

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

export const archiveChat = asyncHandler(async (req, res) => {
  const { chatId } = req.query

  if (!chatId) {
    throw new ApiError(400, 'ChatId is required for archieving')
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $addToSet: {
        archivedChats : chatId
      }
    },
    { new: true }
  )

  return res.status(200).json(new ApiResponse(200,user,'Chat Archieved Successfully'))
});

export const unArchiveChat = asyncHandler(async (req, res) => {
  const { chatId } = req.query

  if (!chatId) {
    throw new ApiError(400, 'ChatId is required for unArchiving')
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $pull: {
        archivedChats : chatId
      }
    },
    { new: true }
  )

  return res.status(200).json(new ApiResponse(200,user,'Chat unArchived Successfully'))
})