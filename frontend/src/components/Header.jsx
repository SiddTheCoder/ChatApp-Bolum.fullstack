import React, { useEffect, useState } from 'react'
import { Settings, Search, Bell } from 'lucide-react';
import { useSocket } from '../context/SocketContext'
import { useAuth } from '../hooks/useAuth';
import ShowNotifications from './ShowNotifications';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import BolumLogo from '../assets/Bolum-Logo.png'

function Header() {

  const navigate = useNavigate()
  //for notification count animation
  const [animateNotif, setAnimateNotif] = useState(false);
  
  const [notificationCount, setNotificationCount] = useState(0)
  const [userGeneratedTextImg, setUserGeneratedTextImg] = useState(null)
  const [showNotifications,setShowNotification] = useState(false)

  const [isAIChatBotHovered, setIsAIChatBotHovered] = useState(false)

  // FORM CONTEXT API HOOK
  const { socket } = useSocket()
  // FROM HOOK
  const {currentUser} = useAuth()
  


  // notification count animation
  useEffect(() => {
  if (notificationCount > 0) {
    setAnimateNotif(true);
    const timer = setTimeout(() => setAnimateNotif(false), 300); 
    return () => clearTimeout(timer);
  }
  }, [notificationCount]);
  

  const getUnSeenNotifications = async () => {
    const response = await axios.get('https://chatapp-bolum-backend.onrender.com/api/v1/notification/get-unseen-notifications-count', {
      withCredentials : true
    })
    // console.log('Unseen Notifications Count', response.data)
    // If the response is successful, update the notification count 
    setNotificationCount(response.data.data)
  }

  useEffect(() => {
    getUnSeenNotifications()
    socket?.on('friend-request-received', () => {
      // console.log('Friend Request received')
      setNotificationCount((prev) => prev+1)
    })
    socket?.on('cancelled-friend-request', () => {
      // console.log('Friend Request cancelled')
      setNotificationCount((prev) => prev-1)
    })

    socket?.on('friend-request-accepted', (data) => {
      // console.log('Friend Request accepted from', data)
      setNotificationCount((prev) => prev+1)
    })

    socket?.on('rejected-friend-request', () => {
      // console.log('Friend Request Rejected')
      setNotificationCount((prev) => prev+1)
    })
  } , [currentUser])

 

    useEffect(() => {
    if (currentUser?.fullname) {
      const username = currentUser.fullname.split(' ')
      let firstName = username[0]?.charAt(0) || ''
      let secondName = username[1]?.charAt(0) || ''
      let textImage = `${firstName} ${secondName}`
      setUserGeneratedTextImg(textImage)
    }
  }, [currentUser])
  

  const toggleShowNotifications = () => {
    setShowNotification(prev => !prev)
    getUnSeenNotifications()
  }

  useEffect(() => {
  const originalTitle = document.title;

  if (notificationCount > 0) {
    // Change title
    document.title = `🔔 (${notificationCount}) New Notifications!`;

    // After 3 seconds, restore
    const timeout = setTimeout(() => {
      document.title = originalTitle;
    }, 3000);

    // Clean up
    return () => clearTimeout(timeout);
  }
  }, [notificationCount]);




  return (
    <header className='h-12 bg-white/80 text-black w-full flex justify-between items-center pl-10 sm:px-2  border-b-1 border-black'>
      <div onClick={() => navigate('/home')} className='text-purple-950 flex gap-1 items-center justify-center cursor-pointer opacity-[0.8]  py-1 sm:px-1 rounded font-exile text-2xl sm:text-3xl relative -left-9 sm:-left-0 '><img src={BolumLogo} alt="" width={40} />BOLUM</div>

      

      <div className='flex justify-around items-center sm:gap-2'>

      <div className='group relative flex items-center justify-center gap-2 bg-white/80 rounded-md px-2 py-1 hover:bg-white/90 transition-all duration-150 ease-in hover:shadow-md hover:scale-[1.09]'>
          <svg
            onClick={() => navigate('/bolum-mentor')}
            onMouseEnter={() => setIsAIChatBotHovered(true)}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-brain-icon lucide-brain cursor-pointer"
          >
            <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z" />
            <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z" />
            <path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4" />
            <path d="M17.599 6.5a3 3 0 0 0 .399-1.375" />
            <path d="M6.003 5.125A3 3 0 0 0 6.401 6.5" />
            <path d="M3.477 10.896a4 4 0 0 1 .585-.396" />
            <path d="M19.938 10.5a4 4 0 0 1 .585.396" />
            <path d="M6 18a4 4 0 0 1-1.967-.516" />
            <path d="M19.967 17.484A4 4 0 0 1 18 18" />
          </svg>

          <div className="absolute -bottom-6 text-xs bg-purple-700 text-white px-2 py-1 rounded shadow-md hidden group-hover:block w-20 text-center transition-opacity duration-200 z-50">
            AI Mentor
          </div>
          {!isAIChatBotHovered && (<div className='h-3 w-3 rounded-full bg-red-700 absolute bottom-5 left-[25px] animate-ping text-sm '></div>)}
        </div>


        <div onClick={() => navigate('/settings')}>
          <Settings className='hover:animate-spin cursor-pointer hover:scale-[1.2] transition-all duration-150 ease-in' />
        </div>
        <div className='relative' onClick={toggleShowNotifications}>
          <Bell className='cursor-pointer hover:scale-[1.2] hover:z-10 transition-all duration-150 ease-in ml-2 mr-2' />
          {notificationCount > 0 && (
            <span
                className={`absolute -top-1 right-0 bg-red-500 text-white rounded-full h-4 w-4 flex items-center justify-center text-xs font-bold   transition-all duration-300 ease-out 
                ${animateNotif ? 'scale-125 bg-red-600' : 'scale-100'}`}
              >
                {notificationCount}
              </span>
          )}
          {showNotifications && <ShowNotifications isOpen={showNotifications} closeModel={toggleShowNotifications} />}
        </div>

        <div
          onClick={() => navigate(`/${currentUser?.username}`)}
          className='flex justify-between items-center gap-2 pr-2 cursor-pointer bg-purple-600/30 hover:bg-purple-600 py-1 px-3 rounded transition-all duration-100 ease-in'>
          <div className='hidden sm:flex flex-col items-center justify-center h-6 text-sm'>
            <span className='text-sm'>{currentUser?.fullname}</span>
          </div>
          <div className='h-8 w-8 rounded-full bg-white overflow-hidden object-cover flex justify-center items-center'>
            {currentUser?.avatar !== null ? (<img src={currentUser?.avatar}/>) : (  <span className="text-xs font-bold text-gray-700">{userGeneratedTextImg}</span>) }
            </div>
        </div>

      </div>

    </header>
  )
}

export default Header
