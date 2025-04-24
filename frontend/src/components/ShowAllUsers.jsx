import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { UserPlus, UserRoundCog } from 'lucide-react'
import { useSocket } from '../context/SocketContext'
import { useAuth } from '../hooks/useAuth'

function ShowAllUsers() {


  const [sentRequests, setSentRequests] = useState(new Set())
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  

  // // from hook
  const currentUser = useAuth()
  
  // // from context api
  const { socket } = useSocket()
  

  useEffect(() => {
    if (!currentUser || !socket) return;
        
    if (currentUser) {
    
      // Register the user with the socket server
      socket.emit('register-user', currentUser._id)

      // Listen for friend request received event
      socket.on('friend-request-received', (data) => {
        console.log('Friend request received:', data)
        // Handle the friend request received event here
      })

      // return () => {
      //   if (socket) socket.disconnect();
      // }
    }
  }, [currentUser])

  useEffect(() => {
  
    const getAllUsers = async () => {
      try {
        setLoading(true)
        const response = await axios.get('/api/v1/user/get-all-users', {
          withCredentials: true
        })
        const filteredUsers = response.data.data.filter(user => user.username !== currentUser?.username)
        setUsers(filteredUsers)
        setLoading(false)
      } catch (err) {
        console.log('Error occurred while getting all users', err.response?.data)
        setLoading(false)
      }
    }
    getAllUsers()
  } , [currentUser])


  const toggleFriendRequest = (user) => {
    setSentRequests(prev => {
      const newSet = new Set(prev)
      if (newSet.has(user.username)) {
        newSet.delete(user.username)
        cancelFriendRequest(user)
      }
      else {
        newSet.add(user.username)
        // calling the sendFriendRequest
        sendFriendRequest(user)
      }
      return newSet
    })
  }

  const sendFriendRequest = (user) => {
    console.log('Sending friend request to:', user.username , `by : ${currentUser?.username}`)
        // Send friend request to the user
        if (socket) {
          socket.emit('send-friend-request', {
          senderId : currentUser._id,
          receiverId : user?._id
        })
       }
       console.log('Friend request sent to:', user.username, `by : ${currentUser?.username}`)
  }

  const cancelFriendRequest = (user) => {
    console.log('cancelling friend request to:', user.username, `by : ${currentUser?.username}`)
        // Cancel friend request to the user
        if (socket) {
          socket.emit('cancel-friend-request', {
          senderId : currentUser._id,
          receiverId : user?._id
        })
       }
       console.log('Friend request cancelled to:', user.username, `by : ${currentUser?.username}`)
  }


  return (
    <>
      {users?.map((user) => (
        <div  key={user.username} className='flex flex-wrap gap-5 p-3'>
          
          <div className='h-78 w-86 bg-slate-300 rounded-md shadow-lg flex flex-col items-center gap-3 p-2'>
         <div className='h-[73%] w-[65%] bg-purple-950 rounded-full'></div>
          <div className='w-full text-center -mt-1'>{ user.fullname}</div>

        <div className='w-[80%] flex justify-center items-center gap-2'>
          {!sentRequests.has(user.username) ? (<span
            onClick={() => toggleFriendRequest(user)}
            className='bg-purple-950/60 transition-all duration-150 ease-in-out hover:bg-purple-950/55 cursor-pointer text-center text-white px-5 py-1 rounded-sm w-[70%] flex  gap-3'><UserPlus />Add Friend</span>) :  (
              <span
            onClick={() => toggleFriendRequest(user)}
            className='transition-all duration-150 ease-in-out bg-purple-950/90 hover:bg-purple-950/75 cursor-pointer text-center text-white px-5 py-1 rounded-sm w-[70%] flex  gap-3'><UserRoundCog />Cancel Request</span>
            )}
        </div>
        
      </div>

        </div>
      ))}
      </>
  )
}

export default ShowAllUsers
