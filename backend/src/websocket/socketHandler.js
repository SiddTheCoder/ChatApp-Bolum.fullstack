import { FriendRequest } from '../models/friendRequest.model.js';
import { Notification } from '../models/notification.model.js';
import { User } from '../models/user.model.js';
import { ApiError } from '../utils/ApiError.js';
import { Chat } from '../models/chat.model.js';
import { ChatMessage } from '../models/chatMessage.model.js';

const connectedUsers = new Map(); // userId => socket.id

export function setupSocket(io) {
  
  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Store the socket ID for the user
    socket.on('register-user',async (userId) => {
      connectedUsers.set(userId, socket.id)
      console.log(`User ${userId} registered with socket ID: ${socket.id}`);

    })

    // send friendRequest
    socket.on('send-friend-request', async ({ senderId, receiverId }) => {
       
      try {
        //initiation the notification model for DB
        const notification = await Notification.create({
          type : 'friend-request',
          sender : senderId,
          receiver: receiverId,
          seen: false,
          message : 'You have new Friend Request',
          
        })

        if (!notification) {
          throw new ApiError(500,'Error occured while creating the notifications')
        }

        //updating the user Notification DB
        await User.findByIdAndUpdate(
          receiverId,
          { $push: { notifications: notification._id } },
          {new : true}
        )

      } catch (error) {
        console.log('Error occured while handling DataBase inside the send-friend-request socket event', error)
        return;
      }
      
      const receiverSocketId = connectedUsers.get(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('friend-request-received', {
          from: senderId,
        });
        console.log(`Sent Friend request from ${senderId} to ${receiverId}`);
      } else {
        console.log(`User ${receiverId} is not connected`);
      }

    })

    // cancel friend request
   socket.on('cancel-friend-request', async ({ senderId, receiverId }) => {
      try {
        // find nitification
        const notification = await Notification.findOneAndDelete({
          sender: senderId,
          receiver: receiverId,
          type: 'friend-request',
        });


        // Remove the notification from User.notifications array
        if (notification) {
          await User.findByIdAndUpdate(receiverId, {
            $pull: { notifications: notification._id },
          });
        }

        // Step 4: Notify the receiver
        const receiverSocketId = connectedUsers.get(receiverId);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit('cancelled-friend-request');
          console.log(`✅ Cancelled friend request from ${senderId} to ${receiverId}`);
        }

        // Logging for debugging
        console.log('🗑️ FriendRequest deleted count:',);
        if (notification) {
          console.log('🗑️ Notification deleted with ID:',);
        } else {
          console.log('⚠️ No notification found to delete');
        }

      } catch (err) {
        console.error('❌ Error while cancelling friend request:', err);
      }
    });

    //accept friend request
    socket.on('accept-friend-request', async ({ senderId, receiverId, notificationId }) => {
      console.log('Receiver Id ---------------,', receiverId)
      try {
        const notification = await Notification.create({
          type : 'message',
          sender : senderId,
          receiver: receiverId,
          seen: false,
          message : 'accepted your friend proposal'
        })
        
        if (!notification) {
          throw new ApiError(500,'Error occured while creating the notification')
        }

        await User.findByIdAndUpdate(
          receiverId,
          { $push: { notifications: notification._id } },
          {new : true}
        )

        await Notification.findByIdAndUpdate(
          notificationId,
          { $set: { friendStatus: 'accepted' } },
          { new: true }
        )

      } catch (err) {
        console.log('Error occured while acceptong friend request', err)
      }

      const receiverSocketId = connectedUsers.get(receiverId)
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('friend-request-accepted', {
          from: senderId,
          to : receiverId
        })
      }
    })

    //reject friend request
    socket.on('reject-friend-request', async ({ senderId, receiverId, notificationId }) => {
      try {
        const notification = await Notification.create({
          type : 'message',
          sender : senderId,
          receiver: receiverId,
          seen: false,
          message : 'rejected your friend proposal'
        })

         await User.findByIdAndUpdate(
          receiverId,
          { $push: { notifications: notification._id } },
          {new : true}
        )

        await User.findByIdAndUpdate(
          senderId,
          { $pull: { alreadyRequestSent: receiverId } },
          { new: true }
        )
        
        await Notification.findByIdAndUpdate(
          notificationId,
          { $set: { friendStatus: 'rejected' } },
          { new: true }
        )

      } catch (err) {
        console.log('Error occured while rejecting the frnd request', err)
      }

      const receiverSocketId = connectedUsers.get(receiverId)
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('rejected-friend-request', {
          from : senderId
        })
      }
    })
    
    // send message
    socket.on('send-message', async ({senderId,receiverId,content}) => {
      try {
        
        // Step 1: Find existing chat between these two users
        let chat = await Chat.findOne({
          isGroupChat: false,
          members: {
            $all: [senderId, receiverId],
            $size: 2
          },
        });

        // Step 2: If chat doesn't exist, create a new one
        if (!chat) {
          chat = await Chat.create({
            members: [senderId, receiverId],
          });
        }

        // Step 3: Create the message linked to the chat
        const message = await ChatMessage.create({
          sender: senderId,
          content,
          chat: chat._id,
        });
        console.log('Message Created =============== ',message)
        // Step 4: Update lastMessage in Chat
        chat.lastMessage = message._id;
        chat.lastUpdated = Date.now();
        await chat.save();

  

        const receiverSocketId = connectedUsers.get(receiverId)
        socket.emit('message-sent', message); // Notify sender the message was sent
        socket.to(receiverSocketId).emit('new-message', message); // Notify receiver

      } catch (err) {
        console.log('Error while sending message', err)
      }
    })

    // disconnect event
    socket.on('disconnect', () => {
      for (const [userId, sId] of connectedUsers.entries()) {
        if (sId === socket.id) connectedUsers.delete(userId);
      }
    });

  })

}


// // Join room
//     socket.on('join-room', (roomId) => {
//       socket.join(roomId);
//       console.log(`👥 ${socket.id} joined room ${roomId}`);
//       socket.to(roomId).emit('user-joined', socket.id);
//     });

//     // send message
//     socket.on('send-message', ({ roomId, message  }) => {
//       const msgData = {
//         sender: socket.id,
//         message: message,
//         time: new Date().toISOString(),
//       }
//       console.log('Message received at backend:', msgData);
//       io.to(roomId).emit('recieve-message', msgData); 
//     });

//     // leave room
//     socket.on('leave-room', (roomId) => {
//       socket.leave(roomId);
//       console.log(`👤 ${socket.id} left room ${roomId}`);
//       socket.to(roomId).emit('user-left', socket.id);
//     });