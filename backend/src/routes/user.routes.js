import { Router } from "express";
import { upload } from "../middlewares/multer.moddleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  loginUser,
  registerUser,
  getCurrentUser,
  logoutUser,
  getAllUsers,
} from '../controllers/user.controller.js'



const router = Router()

//unsecured routes
router.route('/register-user').post(upload.single('avatar'),registerUser)
router.route('/login-user').post(loginUser)
router.route('/get-all-users').get(getAllUsers)


//secured routes
router.route('/logout-user').get(verifyJWT,logoutUser)
router.route('/get-current-user').get(verifyJWT,getCurrentUser)


//for private route check
router.route('/verify-user').get(verifyJWT, (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'User is authenticated',
    isAuthenticated: true
  })
})

export default router