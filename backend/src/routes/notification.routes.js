import { Router } from 'express'
import {
  getAllNotifications,
  updateNotificationStatus,
  getUnSeenNotificationsLength
 } from '../controllers/notification.controller.js'
import { verifyJWT } from '../middlewares/auth.middleware.js'


const router = Router()

router.route('/get-user-all-notifications').get(verifyJWT,getAllNotifications)
router.route('/update-notification-status').post(verifyJWT, updateNotificationStatus)
router.route('/get-unseen-notifications-count').get(verifyJWT,getUnSeenNotificationsLength)

export default router