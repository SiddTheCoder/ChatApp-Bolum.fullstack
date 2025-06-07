import React,{useEffect, useState} from 'react'
import axios from 'axios';
import { useSocket } from '../context/SocketContext'
import { useAuth } from '../hooks/useAuth'

function ShowNotifications({ closeModel, isOpen }) {
  
  const {socket} = useSocket()
  const {currentUser} = useAuth()
  const [notifications, setNotications] = useState([])

  
  const getAllNotifications = async () => {
   try {
     const response = await axios.get('https://chatapp-bolum-backend.onrender.com/api/v1/notification/get-user-all-notifications', { withCredentials: true })
     setNotications(response.data.data)
    //  console.log('All Notification',response.data.data)
    
   } catch (error) {
    console.log('Error occured', error)
   }
  }

  useEffect(() => {
     getAllNotifications()
  }, [])

  const handleFriendRequestAccept = async (notification) => {
    if (socket) {
      console.log('Accepting friend request', notification)
      console.log('Current User', currentUser)
      socket.emit('accept-friend-request', {
        senderId: currentUser?._id ,
        receiverId: notification?.sender?._id,
        notificationId : notification._id     // for stating the notification state in DB for UI once it is clicked
      })
    }
    
    //database handling
    try {
      const response = await axios.post(`https://chatapp-bolum-backend.onrender.com/api/v1/user/accept-friend-request?anotheruserId=${notification?.sender?._id}`, {}, {
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
      console.log('Rejecting friend request', notification)
      console.log('Current User', currentUser)
      socket.emit('reject-friend-request', {
        senderId: currentUser?._id ,
        receiverId: notification?.sender?._id,
        notificationId : notification._id       // for stating the notification state in DB for UI once it is clicked
      })
    }
    await updateNotificationStatus(notification)
  }

  const updateNotificationStatus = async (notification) => {
    // console.log("Trying to update the notification status", notification)
    const response = await axios.post(`https://chatapp-bolum-backend.onrender.com/api/v1/notification/update-notification-status?notificationId=${notification?._id}`,{}, {
      withCredentials : true
    })
    // console.log('Notification status updated', response.data.data)
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
                className={`w-full h-20 py-1 rounded-md flex justify-between gap-2 ${!notification?.seen ? "bg-purple-700 text-white " : "bg-slate-300 text-black"} `}
              >
                <div className='h-full w-[30%] flex justify-center items-center ml-3'>
                  <div className="relative h-12 w-12">
                    <div className="h-full w-full rounded-full bg-purple-950/90 overflow-hidden">
                      <img src={notification.sender?.avatar} alt="" />
                    </div>

                    {/* New Badge */}
                    {!notification.seen && (
                      <div className="absolute top-0 right-0 h-3 w-3 rounded-full bg-blue-500 border-2 border-white"></div>
                    )}
                  </div>
                </div>

                <div className='flex flex-col w-full h-full items-center justify-around'>
                  <div className='text-sm w-[90%]'>
                    {notification.sender?.fullname} sent you a friend request.
                  </div>
                  <div className='w-full flex gap-0 justify-around ml-20 mr-20'>
                    {notification?.friendStatus === 'null' ? (
                      <>
                        <button
                          disabled={notification?.status == 'accepted' ? true : false}
                          onClick={() => handleFriendRequestReject(notification)}
                          className={`text-sm hover:bg-purple-950/60 bg-purple-950/80 text-white px-2 py-[4px] cursor-pointer rounded-sm ${notification?.status == 'accepted' ? 'hidden' : 'flex'}`}
                        >
                          Reject
                        </button>
                        <button
                          disabled={notification?.status == 'accepted' ? true : false}
                          onClick={() => handleFriendRequestAccept(notification)}
                          className={`text-sm hover:bg-purple-950/60 bg-purple-950/80 text-white px-2 py-[4px] cursor-pointer rounded-sm ${notification?.status == 'accepted' ? 'hidden' : 'flex'}`}
                        >
                          Accept
                        </button>
                      </>
                    ) : (
                      <div className='w-full flex justify-end items-center text-sm mr-10'>
                        {notification?.friendStatus == 'accepted' ? (<span>Accepted</span>) : (<span>Rejected</span>)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          } else if (notification.type === 'message') {
            return (
              <div
                key={notification._id}
                className={`${!notification?.seen  ? "bg-purple-800 text-white " : "bg-slate-300 text-black"} w-full h-18 flex justify-between items-center py-1 bg-slate-300 rounded-md  gap-2`}
              >
                <div className='w-[30%] h-full flex justify-center items-center'>
                  <div className='h-12 w-12 rounded-full bg-purple-950 overflow-hidden'>
                    <img src={notification.sender?.avatar} alt="" />
                  </div>
                </div>
                <span className='w-full' aria-disabled>
                  {notification.sender?.fullname} {notification?.message}  
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

