import { ApiResponse } from '../utils/ApiResponse.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { Notification } from '../models/notification.model.js'

export const getAllNotifications = asyncHandler(async (req, res) => {
  const user = req.user?._id;
  const { onlyUnseen } = req.query;

  const filter = onlyUnseen
    ? { receiver: user, seen: false }
    : { receiver: user };

  const notifications = await Notification.find(filter)
    .populate('sender')
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, notifications, 'Notifications fetched successfully'));
  
});
