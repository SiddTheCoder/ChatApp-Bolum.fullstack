import { Router } from 'express'
import { getAllNotifications } from '../controllers/notification.controller.js'
import { verifyJWT } from '../middlewares/auth.middleware.js'


const router = Router()

router.route('/get-user-all-notifications').get(verifyJWT,getAllNotifications)

export default router