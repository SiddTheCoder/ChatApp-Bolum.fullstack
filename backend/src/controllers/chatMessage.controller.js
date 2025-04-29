import { ChatMessage } from '../models/chatMessage.model.js'; 
import {asyncHandler} from '../utils/asyncHandler.js';
import {ApiError} from '../utils/ApiError.js';
import {ApiResponse} from '../utils/ApiResponse.js';



export const getAllMessagesFromAChat = asyncHandler(async (req, res) => {
  const { chatId } = req.params;
  const currentUserId = req.user?._id
  if (!chatId) {
    throw new ApiError(400, 'Chat ID is required');
  }

  await ChatMessage.updateMany(
    { 
      chat: chatId,
      sender: { $ne: currentUserId }, // sender is not current user
      seen: false
    },
    { $set: { seen: true } }
  );


  // Then, fetch all messages
  const messages = await ChatMessage.find({ chat: chatId })
    .populate('sender', 'username avatar fullname')
    .sort({ createdAt: 1 });

  return res
    .status(200)
    .json(new ApiResponse(200, messages, 'Messages fetched successfully'));
});
