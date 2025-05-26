import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios';
import { useAuth } from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import RouteHandler from '../components/RouteHandler'
import Header from '../components/Header'

function UserProfile() {
  const { username } = useParams()
  const {currentUser} = useAuth()
  const navigate = useNavigate()

  const [user, setUser] = useState({})
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false)

  const checkAuthentication = async (username) => {
    // console.log("Current user",currentUser)
    if (currentUser?.username !== username) {
      console.log('Read Mode only')
      setIsUserAuthenticated(false)
    }
    else {
      console.log('Read/Write mode')
      setIsUserAuthenticated(true)
    }
  }

  
  const getUserByUserName = async (username) => {
    try {
      const response = await axios.get(`https://chatapp-bolum-backend.onrender.com/api/v1/user/get-user-by-username?username=${username}`)
      // console.log('User Fteched successfully', response.data.data)
      setUser(response.data.data)
    } catch (error) {
      if (error.response?.data?.statuscode == 500 || error.response?.data?.success === 'false') {
       navigate('*')
      }
    }
  }

  useEffect(() => {
    checkAuthentication(username)
    getUserByUserName(username)
  }, [currentUser])

  const logoutUser = async () => {
    try {
      const response = await axios.get('https://chatapp-bolum-backend.onrender.com/api/v1/user/logout-user', {}, {
        withCredentials: true
      })
      // console.log("User Logout", response)
      // console.log('Naviageting')
      navigate('/')
      if (response.data?.status ==+ 200 || response.data?.statusText === 'OK') {
      }
    } catch (err) {
      console.log('Error occured while Logouting the user', err)
    }
  }

  const routes = [
    {
      name: 'Home',
      target : '/home'
    },
    {
      name: 'Profile',
      targte : `/${username}`
    }
  ]

  return (
    <>
      
      <div className='h-[5vh] left-10 top-5 relative  sm:absolute'>
        <RouteHandler routes={routes} />
      </div>
         
    <div className="min-h-[100vh] bg-gradient-to-br from-blue-500 to-purple-900 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-xl p-6 min-h-[80vh] max-w-6xl w-full text-white border border-white/20">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <img
            src={user?.avatar}
            alt="avatar"
            className="w-32 h-32 rounded-full border-4 border-white shadow-md object-cover cursor-pointer"
          />
          <div className="text-center md:text-left flex-1">
            <h2 className="text-3xl font-bold">{user?.fullname}</h2>
            <p className="text-lg text-white/70">@{user?.username}</p>
            <p className="mt-2 text-white/80">{user?.bio}</p>
            <p className="mt-1 text-sm text-white/60">{user?.email}</p>
            <div className="mt-2 flex w-full">
               {isUserAuthenticated && <span onClick={() => navigate('settings/profile')} className="inline-block px-3 py-1 cursor-pointer hover:bg-gradient-to-br from-purple-400 to-blue-600 bg-gradient-to-bl transition-all duration-300 ease-in-out  border-2  text-sm rounded-full">
                  Edit Profile
               </span>
               }
            </div>
            <div className="mt-2">
               {isUserAuthenticated && <span onClick={logoutUser} className="inline-block px-3 py-1 cursor-pointer hover:bg-gradient-to-br from-purple-400 to-blue-600 bg-gradient-to-bl transition-all duration-300 ease-in-out  border-2  text-sm rounded-full">
                  Logout
               </span>
               }
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-center mt-6">
          <div className="bg-white/10 p-4 rounded-xl border border-white/20 hover:scale-105 transition-all duration-200 ease-initial cursor-pointer">
            <h3 className="text-xl font-semibold">{user.friends?.length}</h3>
            <p className="text-sm text-white/70">Friends</p>
          </div>
          <div className="bg-white/10 p-4 rounded-xl border border-white/20 hover:scale-105 transition-all duration-200 ease-initial cursor-pointer">
            <h3 className="text-xl font-semibold">{user.followers?.length}</h3>
            <p className="text-sm text-white/70">Followers</p>
          </div>
          <div className="bg-white/10 p-4 rounded-xl border border-white/20 hover:scale-105 transition-all duration-200 ease-initial cursor-pointer">
            <h3 className="text-xl font-semibold">{user.following?.length}</h3>
            <p className="text-sm text-white/70">Following</p>
          </div>
          <div className="bg-white/10 p-4 rounded-xl border border-white/20 hover:scale-105 transition-all duration-200 ease-initial cursor-pointer">
            <h3 className="text-xl font-semibold">{user.alreadyRequestSent?.length}</h3>
            <p className="text-sm text-white/70">Requests Sent</p>
          </div>
          <div className="bg-white/10 p-4 rounded-xl border border-white/20 hover:scale-105 transition-all duration-200 ease-initial cursor-pointer">
            <h3 className="text-xl font-semibold">{user.notifications?.length}</h3>
            <p className="text-sm text-white/70">Notifications</p>
          </div>
          <div className="bg-white/10 p-4 rounded-xl border border-white/20 hover:scale-105 transition-all duration-200 ease-initial cursor-pointer">
            <h3 className="text-xl font-semibold">{new Date(user.createdAt).toLocaleDateString()}</h3>
            <p className="text-sm text-white/70">Joined</p>
          </div>
        </div>
      </div>
      </div>
      
    </>
  )
}

export default UserProfile
