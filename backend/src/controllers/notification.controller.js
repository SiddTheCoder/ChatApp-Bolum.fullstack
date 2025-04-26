import { ApiResponse } from '../utils/ApiResponse.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { Notification } from '../models/notification.model.js'
import { ApiError } from '../utils/ApiError.js';

export const getAllNotifications = asyncHandler(async (req, res) => {
  const user = req.user?._id;
  const { onlyUnseen } = req.query;

  const filter = onlyUnseen
    ? { receiver: user, seen: false }
    : { receiver: user };

  const notifications = await Notification.find(filter)
    .populate('sender')
    .sort({ createdAt: -1 })
    .select('-rereshToken')

  return res
    .status(200)
    .json(new ApiResponse(200, notifications, 'Notifications fetched successfully'));
  
});

export const updateNotificationStatus = asyncHandler(async (req, res) => {
  const { notificationId } = req.query
  if (!notificationId) {
    throw new ApiError(400,'Notification ID is required')
  }
  const notification = await Notification.findByIdAndUpdate(
    notificationId,
    { $set: { status: 'accepted' } },
    {new : true}
  )

  if (!notification) {
    throw new ApiError(500,'Notification failed to update its status')
  }

  return res.status(200).json(new ApiResponse(200,notification,'Notification status updated'))
})

export const getUnSeenNotifications = asyncHandler(async (req, res) => {
  const newUnSeenNotifications = await Notification.find({
    receiver: req.user?._id,
    seen : false
  })
})