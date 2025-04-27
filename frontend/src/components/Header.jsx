import React, { useEffect, useState } from 'react'
import { Settings, Search, Bell } from 'lucide-react';
import { useSocket } from '../context/SocketContext'
import { useAuth } from '../hooks/useAuth';
import ShowNotifications from './ShowNotifications';
import axios from 'axios'

function Header() {

  //for notification count animation
  const [animateNotif, setAnimateNotif] = useState(false);
  
  const [notificationCount, setNotificationCount] = useState(0)
  const [userGeneratedTextImg, setUserGeneratedTextImg] = useState(null)
  const [showNotifications,setShowNotification] = useState(false)

  // FORM CONTEXT API HOOK
  const { socket } = useSocket()
  // FROM HOOK
  const currentUser = useAuth()
  


  // notification count animation
  useEffect(() => {
  if (notificationCount > 0) {
    setAnimateNotif(true);
    const timer = setTimeout(() => setAnimateNotif(false), 300); 
    return () => clearTimeout(timer);
  }
  }, [notificationCount]);
  

  const getUnSeenNotifications = async () => {
    const response = await axios.get('/api/v1/notification/get-unseen-notifications-count', {
      withcredentials : true
    })
    setNotificationCount(response.data.data)
  }

  useEffect(() => {
    getUnSeenNotifications()
    socket?.on('friend-request-received', () => {
      setNotificationCount((prev) => prev+1)
    })
    socket?.on('cancelled-friend-request', () => {
      console.log('Friend Request cancelled')
      setNotificationCount((prev) => prev-1)
    })

    socket?.on('friend-request-accepted', (data) => {
      console.log('Friend Request accepted from', data)
      setNotificationCount((prev) => prev+1)
    })

    socket?.on('rejected-friend-request', () => {
      console.log('Friend Request Rejected')
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
    <header className='h-12 bg-white/80 text-black w-full flex justify-between items-center pl-10 px-2 border-b-1 border-black'>
      <div className='flex gap-1 items-center justify-center cursor-pointer hover:bg-purple-950/50 py-1 px-4 rounded '>Search <Search className='relative top-[0.5px] hover:animate-bounce' size={20} strokeWidth={1.75} absoluteStrokeWidth /></div>

      <div className='flex justify-around items-center gap-2'>
        <div><Settings className='hover:animate-spin cursor-pointer hover:scale-[1.2] transition-all duration-150 ease-in' /></div>
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

        <div className='flex justify-between items-center gap-2 pr-2 cursor-pointer bg-purple-600/30 hover:bg-purple-600 py-1 px-3 rounded transition-all duration-100 ease-in'>
          <div className='flex flex-col items-center justify-center h-6 text-sm'>
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
