import { Router } from 'express'
import {
  getAllMessagesFromAChat
 } from '../controllers/chatMessage.controller.js'
import { verifyJWT } from '../middlewares/auth.middleware.js'



const router = Router()

router.route('/chat/:chatId/messages').get(verifyJWT,getAllMessagesFromAChat)


export default router