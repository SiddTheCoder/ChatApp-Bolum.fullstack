import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { UserPlus, UserRoundCog } from 'lucide-react'
import { useSocket } from '../context/SocketContext'
import { useAuth } from '../hooks/useAuth'

function ShowAllUsers() {
  // for storing the request button state
  const [sentRequests, setSentRequests] = useState(new Set())

  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)

  // from hook
  const currentUser = useAuth()
  // from context
  const { socket } = useSocket()

  const getAllUsers = async () => {
      try {
        setLoading(true)
        const response = await axios.get('/api/v1/user/get-all-users', {
          withCredentials: true
        })

        const filteredUsers = response.data.data.filter(
          user => user.username !== currentUser?.username
        )

        setUsers(filteredUsers)

        // Sync sentRequests with server data
        const alreadySent = filteredUsers
          .filter(user => user.alreadyRequestSent?.includes(currentUser?._id))
          .map(user => user._id)

        setSentRequests(new Set(alreadySent))

        setLoading(false)
      } catch (err) {
        console.log('Error occurred while getting all users', err.response?.data)
        setLoading(false)
      }
    }

  useEffect(() => {
    if (!currentUser || !socket) return

    socket.emit('register-user', currentUser._id)

    socket.on('friend-request-accepted', ({from,to}) => {
      setUsers(prevUsers =>
      prevUsers.map(user => {
        if (user._id === from || user._id === to) {
          return {
            ...user,
            friends: [...user.friends, currentUser._id]
          };
        }
        return user;
      }))
    })

    socket.on('rejected-friend-request', ({from}) => {
      console.log('Freind Request Rejected from', from )
      
      // CLEAN the button UI immediately
      setSentRequests(prev => {
        const newSet = new Set(prev);
        newSet.delete(from); // IMPORTANT
        return newSet;
      });

    })

    // Clean up on unmount
    return () => {
      socket.off('friend-request-accepted');
      socket.off('rejected-friend-request');  // <-- important to clean this too
      socket.off('friend-request-received');
    }
  }, [currentUser, socket])

  useEffect(() => {
    if (currentUser) {
      getAllUsers()
    }
  }, [currentUser])

  const toggleFriendRequest = (user) => {
    setSentRequests(prev => {
      const newSet = new Set(prev)
      if (newSet.has(user._id)) {
        newSet.delete(user._id)
        cancelFriendRequest(user)
        setTimeout(() => {
          getAllUsers()
        }, 4000)
      }
      else {
        newSet.add(user._id)
        sendFriendRequest(user)
        setTimeout(() => {
          getAllUsers()
        }, 2000)
      }
      return newSet
    })
  }

  const sendFriendRequest = async (user) => {
    console.log('Sending friend request to:', user.username, `by: ${currentUser?.username}`)
    if (socket) {
      socket.emit('send-friend-request', {
        senderId: currentUser._id,
        receiverId: user._id
      })
    }
    const response = await axios.post(`/api/v1/user/add-friend-request?requestGetterId=${user._id}`, {withCredentials:true})
    console.log('Friend request sent:', response)
  }

  const cancelFriendRequest = async (user) => {
    console.log('Cancelling friend request to:', user.username, `by: ${currentUser?.username}`)
    if (socket) {
      socket.emit('cancel-friend-request', {
        senderId: currentUser._id,
        receiverId: user._id
      })
    }
    const response = await axios.post(`/api/v1/user/cancel-friend-request?requestGetterId=${user._id}`,{withCredentials:true})
    console.log('Friend request cancelled:', response)
  }

  return (
    <>
      {users?.map((user) => (
        <div key={user._id} className='flex flex-wrap gap-5 p-3 mb-10'>
          <div className='h-78 w-86 bg-slate-300 rounded-md shadow-lg flex flex-col items-center gap-3 p-2'>
            <div className='h-[73%] w-[65%] bg-purple-950 rounded-full'></div>
            <div className='w-full text-center -mt-1'>{user.fullname}</div>

            <div className='w-[80%] flex justify-center items-center gap-2'>
              {
                user.friends?.includes(currentUser._id) ? (
                <div  className='bg-purple-950/90 transition-all duration-150 ease-in-out hover:bg-purple-950/55 cursor-pointer text-center text-white justify-center px-5 py-1 rounded-sm w-[70%] flex gap-3'><span>Friend</span></div>
                ) : (
                    <div className='w-full flex justify-center'>
                      {!sentRequests.has(user._id) ? (
                          <span
                            onClick={() => toggleFriendRequest(user)}
                            className='bg-purple-950/60 transition-all duration-150 ease-in-out hover:bg-purple-950/55 cursor-pointer text-center text-white px-5 py-1 rounded-sm w-[70%] flex gap-3'
                          >
                            <UserPlus />Add Friend
                          </span>
                        ) : (
                          <span
                            onClick={() => toggleFriendRequest(user)}
                            className='transition-all duration-150 ease-in-out bg-purple-950/90 hover:bg-purple-950/75 cursor-pointer text-center text-white px-5 py-1 rounded-sm w-[70%] flex gap-3'
                          >
                            <UserRoundCog />Cancel Request
                            </span>
                        )}
                    </div>
                )
              }
              
            </div>
          </div>
        </div>
      ))}
    </>
  )
}

export default ShowAllUsers
