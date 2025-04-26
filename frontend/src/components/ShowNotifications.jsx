import React,{useEffect, useState} from 'react'
import axios from 'axios'
import { useSocket } from '../context/SocketContext'
import { useAuth } from '../hooks/useAuth'

function ShowNotifications({ closeModel, isOpen }) {
  
  const {socket} = useSocket()
  const currentUser = useAuth()

  const [notifications, setNotications] = useState([])

  
  const getAllNotifications = async () => {
   try {
     const response = await axios.get('/api/v1/notification/get-user-all-notifications', { withCredentials: true })
     setNotications(response.data.data)
   } catch (error) {
    console.log('Error occured', error)
   }
  }

  useEffect(() => {
     getAllNotifications()
  }, [])

  const handleFriendRequestAccept = async (notification) => {
    if (socket) {
      socket.emit('accept-friend-request', {
        senderId: currentUser?._id ,
        receiverId: notification?.sender?._id
      })
    }
    
    //database handling
    try {
     const response =  await axios.post(`/api/v1/user/accept-friend-request?anotheruserId=${notification?.sender?._id}`, {
        withCredentials : true
      })
      console.log('Friend Request accepted and Added friend in databse', response.data.data)

    } catch (error) {
      console.log('Error occured while handling the database',error)
    }

    await updateNotificationStatus(notification)
  }

  const handleFriendRequestReject = async (notification) => {
    if (socket) {
      socket.emit('reject-friend-request', {
        senderId: currentUser?._id ,
        receiverId: notification?.sender?._id
      })
    }
    await updateNotificationStatus(notification)
  }

  const updateNotificationStatus = async (notification) => {
    console.log("Trying to update the notification status", notification)
    const response = await axios.post(`/api/v1/notification/update-notification-status?notificationId=${notification?._id}`, {
      withCredentials : true
    })
    console.log('Notification status updated', response.data.data)
  }

  return (
    <div className={ isOpen ? `overflow-y-scroll h-[500px] w-[350px] bg-white  outline-1 outline-gray-300 shadow-sm rounded-md flex flex-col gap-1 absolute top-7 right-5 p-2` : 'hidden'}>
     
      {[...notifications]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // newest first
        .map((notification) => {
          if (notification.type === 'friend-request') {
            return (
              <div
                key={notification._id}
                className='w-full h-18 py-1 bg-slate-200 rounded-md flex justify-between gap-2'
              >
                <div className='h-full w-[30%] flex justify-center items-center'>
                  <div className='h-12 w-12 rounded-full bg-purple-950/90'></div>
                </div>

                <div className='flex flex-col w-full h-full items-center justify-around'>
                  <div className='text-sm'>
                    {notification.sender?.fullname} has sent you a friend request.
                  </div>
                  <div className='w-full flex gap-0 justify-around ml-20 mr-20'>
                    <button
                      disabled={notification?.status == 'accepted'? true : false}
                      onClick={() => handleFriendRequestReject(notification)}
                      className='text-sm hover:bg-purple-950/60 bg-purple-950/80 text-white px-2 py-[4px] cursor-pointer rounded-sm'
                    >
                      Reject
                    </button>
                    <button
                      disabled={notification?.status == 'accepted'? true : false}
                      onClick={() => handleFriendRequestAccept(notification)}
                      className='text-sm hover:bg-purple-950/60 bg-purple-950/80 text-white px-2 py-[2px] cursor-pointer rounded-sm'
                    >
                      Accept
                    </button>
                  </div>
                </div>
              </div>
            );
          } else if (notification.type === 'message') {
            return (
              <div
                key={notification._id}
                className='w-full h-18 flex justify-between items-center py-1 bg-slate-300 rounded-md  gap-2'
              >
                <div className='w-[30%] h-full flex justify-center items-center'>
                  <div className='h-12 w-12 rounded-full bg-purple-950'></div>
                </div>
                <span className='w-full' aria-disabled>
                  {notification?.message} from {notification.sender?.fullname}
                </span>
              </div>
            );
          }

          return null; // if some other type, don't render
      })}

    </div>
  )
}

export default ShowNotifications

 