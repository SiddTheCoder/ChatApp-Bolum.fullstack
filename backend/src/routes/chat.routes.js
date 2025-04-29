import { Router } from 'express'
import {
  findOrCreateChatAndGetAllMessages
 } from '../controllers/chat.controller.js'
import { verifyJWT } from '../middlewares/auth.middleware.js'



const router = Router()

router.route('/find-or-create-chat-getAllMessages').get(verifyJWT,findOrCreateChatAndGetAllMessages)


export default router