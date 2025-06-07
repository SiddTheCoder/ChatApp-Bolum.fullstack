import { ApiResponse } from '../utils/ApiResponse.js'
import { ApiError } from '../utils/ApiError.js'
import { uploadOnCloudinary } from '../utils/Cloudinary.js'
import { User } from '../models/user.model.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { Chat } from '../models/chat.model.js'
import { ChatMessage } from '../models/chatMessage.model.js'


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
      sameSite: "None",
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
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
  console.log(isPasswordValid)
  if (!isPasswordValid) {
    throw new ApiError(401,'Password didnt Matched')
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id)

  const loggedInUser = await User.findById(user._id).select('-password -refreshToken')

 // cookie settings
    const options = {
      httpOnly : true,
      secure: true,
      sameSite: "None",
      maxAge: 7 * 24 * 60 * 60 * 10000 // 7 days in milliseconds
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

const deleteUser = asyncHandler(async (req, res) => {
  await User.deleteOne({ _id: req.user?._id });
  return res.status(200).json(new ApiResponse(200,{},'Account Deleted Successfully'))
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

const addFriendRequest = asyncHandler(async (req, res) => {

  const { requestGetterId } = req.query
  const user = req.user?._id
  
  if (!requestGetterId) {
    throw new ApiError(400,'Request Getter ID is required for updating the button state')
  }

  const requestGetterUser = await User.findByIdAndUpdate(
    requestGetterId,
    { $push: { alreadyRequestSent: user } },
    { new: true }
  )

  return res.status(200).json(new ApiResponse(200,requestGetterUser,'Friend-request state added succesfully'))

})

const cancelFriendRequest = asyncHandler(async (req, res) => {

  const { requestGetterId } = req.query
  const user = req.user?._id
  
  if (!requestGetterId) {
    throw new ApiError(400,'Request Getter ID is required for updating the button state')
  }

  const requestGetterUser = await User.findByIdAndUpdate(
    requestGetterId,
    { $pull: { alreadyRequestSent: user } },
    { new: true }
  )

  return res.status(200).json(new ApiResponse(200,requestGetterUser,'Friend-request state added succesfully'))

})

const acceptFriendRequest = asyncHandler(async (req, res) => {
  const { anotheruserId } = req.query

  if (!anotheruserId) {
    throw new ApiError(400, 'Another user ID is required')
  }

  await User.findByIdAndUpdate(
    req.user?._id,
    {
       $addToSet : {friends : anotheruserId} 
    },
    { new: true }
  )

  await User.findByIdAndUpdate(
    anotheruserId,
    {
      $addToSet: { friends: req.user?._id },
      $pull: { alreadyRequestSent: req.user?._id }
    },
    {new : true}
  )
  
  return res
    .status(200)
    .json(new ApiResponse(200, 'Friend added succesfully in both users'))
})

const rejectFriendRequest = asyncHandler(async (req, res) => {
  const { anotheruserId } = req.query

  if (!anotheruserId) {
    throw new ApiError(400,'Another user ID is required')
  }

  await User.findByIdAndUpdate(
    anotheruserId,
    { $pull: { alreadyRequestSent: req.user?._id } },
    { new: true }
  )

  return res.status(200).json(new ApiResponse(200,'Friend Request Rejected Succesfully'))
})

const getUserAllFriends = asyncHandler(async (req, res) => {
  const friends = await User.findById(req.user?._id).select('-password -refreshToken').populate('friends','-password -refreshToken').sort({ createdAt: -1 })
  
  if (friends.length <= 0) {
    return res.status(200).json(new ApiResponse(200, [], 'Friends Fetched Successfully'))

  } else {
    return res.status(200).json(new ApiResponse(200, friends, 'Friends Fteched Succesfully'))
  }
})

const getUserById = asyncHandler(async (req, res) => {
 
  const user = await User.findById(req.user?._id).select('-refreshToken -password')

  return res.status(200).json(new ApiResponse(200,user,'user Fteched Succesfully'))
})

const getUserByUserName = asyncHandler(async (req, res) => {
  const { username } = req.query
  if (!username) {
    throw new ApiError(400,'UserName is required')
  }

  const user = await User.findOne({ username: username }).select('-password -refreshToken')
  
  if (!user) {
   return res.status(500).json(new ApiResponse(500,{},'No userFound with such username'))
  }

  return res.status(200).json(new ApiResponse(200,user,'User Fetched successfully'))
})

const getUserFriendsWithLatestMessage = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user?._id)
    .populate('friends', '-password')
    .lean();

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Fetch all 1-to-1 chats where current user is a member
  const chats = await Chat.find({
    isGroupChat: false,
    members: req.user?._id,
  })
    .populate({
      path: 'lastMessage',
      populate: { path: 'sender', select: 'name profilePic' },
    })
    .lean();

  // Create a map { friendId: lastMessage }
  const friendLatestMessageMap = {};

  chats.forEach(chat => {
    const friendId = chat.members.find(id => id.toString() !== req.user._id.toString());
    if (friendId) {
      friendLatestMessageMap[friendId.toString()] = chat.lastMessage;
    }
  });

  // Attach lastMessage to each friend
  const friendsWithLatestMessage = user.friends.map(friend => {
    return {
      ...friend,
      lastMessage: friendLatestMessageMap[friend._id.toString()] || null,
    };
  });

  res.status(200).json(friendsWithLatestMessage);
});

const updateUserCredentials = asyncHandler(async (req, res) => {
  const { username, email, oldPassword, newPassowrd, fullname, bio, socialHandles } = req.body;

  // Validate required fields
  if ([username, email, fullname].some(field => !field || field.trim() === '')) {
    throw new ApiError(400, 'Fields cannot be empty');
  }

  // Handle file upload
  const avatarLocalPath = req.file?.path;
 
  let avatarUrl;
  if (avatarLocalPath) {
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    if (!avatar) {
      throw new ApiError(500, 'Error occurred while uploading profile image');
    }
    avatarUrl = avatar.url;
  }

  // password validation
  if( oldPassword && newPassowrd) {
    if (newPassowrd.length < 2) {
      throw new ApiError(400, 'Password must be at least 6 characters long');
    }

    const user = await User.findById(req.user?._id);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    const isPasswordValid = await user.isPasswordCorrect(oldPassword);
    if (!isPasswordValid) {
      throw new ApiError(401, 'Old password is incorrect');
    }

    // Update password
    user.password = newPassowrd;
    await user.save();
  }

  // Build update object
  const updateFields = {
    username,
    email,
    fullname,
    bio,
  };

  if (avatarUrl) {
    updateFields.avatar = avatarUrl;
  }

  // Update user
  const user = await User.findByIdAndUpdate(
    req.user?._id,
    { $set: updateFields },
    { new: true }
  ).select('-password -refreshToken')

  // Handle social handles
  if (socialHandles.length > 0) {
    user.socialHandles.push(...socialHandles);
    await user.save();
  }

  return res.status(200).json(
    new ApiResponse(200, user, 'User credentials updated successfully')
  );
});


export {
  generateAccessAndRefreshToken,
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  getAllUsers,
  addFriendRequest,
  cancelFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  getUserAllFriends,
  getUserById,
  getUserFriendsWithLatestMessage,
  getUserByUserName,
  deleteUser,
  updateUserCredentials
}