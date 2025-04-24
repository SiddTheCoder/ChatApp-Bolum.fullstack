import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import jwt from 'jsonwebtoken'
import { User } from "../models/user.model.js";

const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    const token = req.cookies?.accessToken || req.header('Authorization')?.replace('Bearer ', '')
    if (!token) {
      throw new ApiError(400,'Unauthorized Request')
    }
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    
    const user = await User.findById(decodedToken?._id).select('-password -refreshToken')
  
    if (!user) {
      throw new ApiError(403,'Invalid Access Token')
    }
  
    req.user = user
    next()
  } catch (err) {
    throw new ApiError(401,'Unauthorized Access Token ...')
  }
})

export { verifyJWT }
