import { FriendRequest } from '../models/friendRequest.model.js';
import { Notification } from '../models/notification.model.js';
import { User } from '../models/user.model.js';
import { ApiError } from '../utils/ApiError.js';

const connectedUsers = new Map(); // userId => socket.id

export function setupSocket(io) {
  
  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Store the socket ID for the user
    socket.on('register-user',async (userId) => {
      connectedUsers.set(userId, socket.id)
      console.log(`User ${userId} registered with socket ID: ${socket.id}`);

      const unseenNotifications = await Notification.find({ receiverId: userId, seen: false })
      
      if (unseenNotifications.length > 0) {
        socket.emit('unseen-notifications')
      }
    })

    // send friendRequest
    socket.on('send-friend-request', async ({ senderId, receiverId }) => {
    console.log(`Friend request from ${senderId} to ${receiverId}`);
      
      try {
        // create friend-request
        const newFriendRequest = await FriendRequest.create({
          sender : senderId,
          receiver: receiverId,
        })

        //initiation the notification model for DB
        const notification = await Notification.create({
          type : 'friend-request',
          sender : senderId,
          receiver: receiverId,
          seen: false,
          message : 'You have new Friend Request'
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

        // //  Mark "alreadyRequestSent" for the sender
        // await User.findByIdAndUpdate(senderId, {
        //   $set: { alreadyRequestSent: true },
        // });


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

   socket.on('cancel-friend-request', async ({ senderId, receiverId }) => {
      try {
        // Step 1: Delete the friend request
        const frResult = await FriendRequest.deleteMany({ sender: senderId, receiver: receiverId });

        // Step 2: Find the notification
        const notification = await Notification.findOneAndDelete({
          sender: senderId,
          receiver: receiverId,
          type: 'friend-request',
        });

        // Step 3: Remove the notification from User.notifications array
        if (notification) {
          await User.findByIdAndUpdate(receiverId, {
            $pull: { notifications: notification._id },
          });
        }

        // //  Mark "alreadyRequestSent" for the sender
        // await User.findByIdAndUpdate(senderId, {
        //   $set: { alreadyRequestSent: false },
        // });

        // Step 4: Notify the receiver
        const receiverSocketId = connectedUsers.get(receiverId);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit('cancelled-friend-request');
          console.log(`✅ Cancelled friend request from ${senderId} to ${receiverId}`);
        }

        // Logging for debugging
        console.log('🗑️ FriendRequest deleted count:', frResult.deletedCount);
        if (notification) {
          console.log('🗑️ Notification deleted with ID:', notification._id);
        } else {
          console.log('⚠️ No notification found to delete');
        }

      } catch (err) {
        console.error('❌ Error while cancelling friend request:', err);
      }
    });

    

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