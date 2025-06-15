import React, { useState, useEffect } from 'react'
import axios from 'axios';
import { UserPlus, UserRoundCog } from 'lucide-react'
import { useSocket } from '../context/SocketContext'
import { useAuth } from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom';

function ShowAllUsers() {
  const navigate = useNavigate()
  const [sentRequests, setSentRequests] = useState(new Set())
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)

  const {currentUser} = useAuth()
  const { socket } = useSocket()

  const getAllUsers = async () => {
    try {
      setLoading(true)
      const response = await axios.get('https://chatapp-bolum-backend.onrender.com/api/v1/user/get-all-users', {
        withCredentials: true
      })

      const filteredUsers = response.data.data.filter(
        user => user.username !== currentUser?.username
      )

      setUsers(filteredUsers)

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

    socket.on('friend-request-accepted', ({ from, to }) => {
      setUsers(prevUsers =>
        prevUsers.map(user => {
          if (user._id === from || user._id === to) {
            return {
              ...user,
              friends: [...user.friends, currentUser._id]
            };
          }
          return user;
        })
      )
    })

    socket.on('rejected-friend-request', ({ from }) => {
      // console.log('Friend Request Rejected from', from)
      setSentRequests(prev => {
        const newSet = new Set(prev);
        newSet.delete(from);
        return newSet;
      });
    })

    return () => {
      socket.off('friend-request-accepted');
      socket.off('rejected-friend-request');
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
      } else {
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
    if (!currentUser?._id) {
      console.warn("User not logged in.")
      return
    }
    if (socket) {
      socket.emit('send-friend-request', {
        senderId: currentUser._id,
        receiverId: user._id
      })
    }
    await axios.post(`https://chatapp-bolum-backend.onrender.com/api/v1/user/add-friend-request?requestGetterId=${user._id}`,{}, {
      withCredentials: true
    })
  }

  const cancelFriendRequest = async (user) => {
    if (socket) {
      socket.emit('cancel-friend-request', {
        senderId: currentUser._id,
        receiverId: user._id
      })
    }
    await axios.post(`https://chatapp-bolum-backend.onrender.com/api/v1/user/cancel-friend-request?requestGetterId=${user._id}`, {}, {
      withCredentials: true
    })
  }

  return (
    <div className="h-full w-full overflow-y-scroll p-6 bg-gray-50">
      <div className="flex flex-wrap justify-center gap-6">
        {!loading ? users?.map((user) => (
          <div
            key={user._id}
            className="w-72 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-transform duration-300 hover:scale-[1.02] p-5 flex flex-col items-center space-y-3"
          >
            <div className="w-24 h-24 rounded-full overflow-hidden shadow-sm">
              <img
                src={user.avatar}
                alt={user.fullname}
                className="w-full h-full object-cover"
              />
            </div>

            <div className='group relative w-full flex items-center justify-center space-x-2'>
              <span
                onClick={() => navigate(`/${user.username}`)}
                className="text-gray-800 font-semibold text-lg cursor-pointer hover:underline"
              >
                {user.fullname}
              </span>
             
            </div>

            <div className="w-full">
              {user.friends?.includes(currentUser._id) ? (
                <div className="bg-green-100 text-green-800 text-sm px-4 py-1 rounded-md text-center">
                  Friend
                </div>
              ) : (
                <div className="flex justify-center">
                  {!sentRequests.has(user._id) ? (
                    <button
                      onClick={() => toggleFriendRequest(user)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-md flex items-center gap-2 text-sm shadow-sm transition"
                    >
                      <UserPlus size={16} /> Add Friend
                    </button>
                  ) : (
                    <button
                      onClick={() => toggleFriendRequest(user)}
                      className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-1 rounded-md flex items-center gap-2 text-sm transition"
                    >
                      <UserRoundCog size={16} /> Cancel Request
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )) : ( Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="w-72 bg-white border border-gray-200 rounded-xl shadow-sm p-5 flex flex-col items-center space-y-3 animate-pulse"
          >
            {/* Avatar skeleton */}
            <div className="w-24 h-24 rounded-full bg-gray-300" />
      
            {/* Name skeleton */}
            <div className="h-5 w-3/4 bg-gray-300 rounded" />
      
            {/* Button skeleton */}
            <div className="w-full">
              <div className="h-8 w-1/2 mx-auto bg-gray-300 rounded" />
            </div>
          </div>
        )))}
      </div>
    </div>
  )
}

export default ShowAllUsers
