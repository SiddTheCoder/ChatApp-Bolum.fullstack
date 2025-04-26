import { ApiResponse } from '../utils/ApiResponse.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { Notification } from '../models/notification.model.js'
import { ApiError } from '../utils/ApiError.js';

export const getAllNotifications = asyncHandler(async (req, res) => {
  // Step 1: Fetch all notifications
  const notifications = await Notification.find({ receiver: req.user._id }).sort({ createdAt: -1 }).populate('sender', '-password -refreshToken')

  // Step 2: Find IDs of unseen notifications
  const unseenNotificationIds = notifications
    .filter(notification => notification.seen === false)
    .map(notification => notification._id);

  // Step 3: Update them to seen
  await Notification.updateMany(
    { _id: { $in: unseenNotificationIds } },
    { $set: { seen: true } }
  );

  // Step 4: Send the ORIGINAL notifications (not updated)
  return res.status(200).json(new ApiResponse(200, notifications, 'Notifications fetched'));
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

export const getUnSeenNotificationsLength = asyncHandler(async (req, res) => {
  const newUnSeenNotifications = await Notification.find({
    receiver: req.user?._id,
    seen : false
  })
  
  if (newUnSeenNotifications.length <= 0) {
    return res.status(200).json(new ApiResponse(200,[],'No Unseen Notification Present'))
  } else {
    return res.status(200).json(new ApiResponse(200,newUnSeenNotifications.length,'Unseen Notification Fetched'))
  }
})