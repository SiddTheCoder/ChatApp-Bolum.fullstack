import { Router } from 'express'
import {
  getAllNotifications,
  updateNotificationStatus
 } from '../controllers/notification.controller.js'
import { verifyJWT } from '../middlewares/auth.middleware.js'


const router = Router()

router.route('/get-user-all-notifications').get(verifyJWT,getAllNotifications)
router.route('/update-notification-status').post(verifyJWT,updateNotificationStatus)

export default router