import { Router } from 'express'
import {
  findOrCreateChatAndGetAllMessages,
  archiveChat,
  unArchiveChat
} from '../controllers/chat.controller.js'
 
import { verifyJWT } from '../middlewares/auth.middleware.js'



const router = Router()

router.route('/find-or-create-chat-getAllMessages').get(verifyJWT, findOrCreateChatAndGetAllMessages)

router.route('/archive-chat').post(verifyJWT,archiveChat)
router.route('/un-archive-chat').post(verifyJWT,unArchiveChat)


export default router