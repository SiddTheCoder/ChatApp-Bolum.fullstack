import { ApiResponse } from '../utils/ApiResponse.js'
import { ApiError } from '../utils/ApiError.js'
import { uploadOnCloudinary } from '../utils/Cloudinary.js'
import { User } from '../models/user.model.js'
import { asyncHandler } from '../utils/asyncHandler.js'



const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId)
    const accessToken = user.generateAccessToken()
    const refreshToken = user.generateRefreshToken()
  
    user.refreshToken = refreshToken
  
    await user.save({ validateBeforeSave: false })
    return { accessToken, refreshToken }
  
  } catch (err) {
    throw new ApiError(err.status || 500, err.message)
  }
}


const registerUser = asyncHandler(async (req, res) => {
  const { username, fullname, email, password } = req.body
  
  if ([username, fullname, email, password].some((field) => field?.trim() === '')) {
    throw new ApiError(400,'All Credenetials are required')
  }

  const existedUser = await User.find({
    $or: [{ username }, { email}]
  })

  if (existedUser?.length > 0) {
    throw new ApiError(400, 'username or email already taken')
  }

  const avatarLocalPath = req.file?.path
  let avatar;
  if (avatarLocalPath) { 
    const response = await uploadOnCloudinary(avatarLocalPath, 'avatars')
    if (!response) {
      throw new ApiError(500, 'Error occured while uploading the image')
    }
    avatar = response?.url
  }
  
  const user = await User.create({
    username: username?.toLowerCase(),
    fullname: fullname,
    email: email?.toLowerCase(),
    password,
    avatar : avatar || null
  })

  const createdUser = await User.findById(user?._id).select('-password -refrehToken')

  if (!createdUser) {
    throw new ApiError(500, 'Error occured while registering the user')
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id)

  const loggedInUser = await User.findById(createdUser?._id).select('-password -refreshToken')

  // cookie settings
    const options = {
      httpOnly : true,
      secure: true,
      sameSite: "Strict"
  }

  return res
    .status(200)
    .cookie('refreshToken', refreshToken, options)
    .cookie('accessToken', accessToken, options)
    .json(new ApiResponse(
      200,
      loggedInUser,
      'User Registered Successfully'
  ))

})

const loginUser = asyncHandler(async (req, res) => {

  const { username, password, email } = req.body

  if (!(username || email)) throw new ApiError(400,'Email or Username is required')
  if(!password) throw new ApiError(400,'Password is required')

  const user = await User.findOne({
    $or : [{username},{email}]
  })

  if (!user) {
    throw new ApiError(404,'User does not exist')
  }

  const isPasswordValid = await user.isPasswordCorrect(password)

  if (!isPasswordValid) {
    throw new ApiError(401,'Password didnt Matched')
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id)

  const loggedInUser = await User.findById(user._id).select('-password -refreshToken')

 // cookie settings
    const options = {
        httpOnly : true,
      secure: true,
      sameSite: "Strict"
  }
  


  return res
    .status(200)
    .cookie('refreshToken', refreshToken, options)
    .cookie('accessToken', accessToken, options)
    .json(new ApiResponse(
      200,
      {
        user: loggedInUser,
        accessToken: accessToken,
        refreshToken : refreshToken
      },
      'User Logged in Successfully'
  ))
  
})

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set : { refreshToken : undefined }
    },
    { new : true}
  )
  
  const options = {
    httpOnly: true,
    secure : true
  }

  return res
    .status(200)
    .clearCookie('accessToken',options)
    .clearCookie('refreshToken', options)
    .json(new ApiResponse(
      200,
      {},
      'User Logout Successfully'
  ))
})

const getCurrentUser = asyncHandler(async (req, res) => {
  const user = req.user
  return res
    .status(200)
    .json(new ApiResponse(
      200,
      user,
      'User Fetched Successfully'
    ))
})

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select('-password -refreshToken')
  return res
    .status(200)
    .json(new ApiResponse(
      200,
      users,
      'All Users Fetched Successfully'
    ))
})

const updateFriendRequestState = asyncHandler(async (req, res) => {

  const { requestGetterId, status } = req.query
  
  if (!status) {
    throw new ApiError(400,'Status in Boolean is required for updating the requestsent button state')
  }

})

export {
  generateAccessAndRefreshToken,
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  getAllUsers
}