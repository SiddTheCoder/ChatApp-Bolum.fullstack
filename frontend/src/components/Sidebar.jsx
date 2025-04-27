import React, { useState, useEffect } from 'react'
import { CheckCheck } from 'lucide-react'
import axios from 'axios'
import { useSocket } from '../context/SocketContext'
import { useAuth } from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom';
import {House} from 'lucide-react'

function Sidebar() {
  const navigate = useNavigate()
  const { socket } = useSocket()
  const currentUser = useAuth()
  const [friends, setFriends] = useState([])
  
  const getUserAllFriends = async () => {
    try {
      const response = await axios.get('/api/v1/user/get-user-all-freinds', {}, {
        withCredentials : true
      })
      console.log('Freinds fetched scc', response.data.data?.friends)
      setFriends(response.data.data?.friends)
    } catch (err) {
      console.log('Error Occured while getting all friends', err)
    }
  }

  useEffect(() => {
    getUserAllFriends()
    socket?.on('friend-request-accepted', () => {
      getUserAllFriends()
    })
  }, [currentUser])



  return (
    <div className='bg-slate-200 w-full h-full flex flex-col p-1 gap-1'>
      
      <div className='h-8 w-full bg-slate-300/40 py-2 px-5 flex justify-start items-center'>
        <span onClick={() => navigate('/home')}><House /></span>
      </div>

      <div className='w-full flex justify-center'>
        <div className='border-b-2 border-slate-400 w-[90%]'></div>
      </div>

      <div className='h-full w-full bg-transparent p-2 flex gap-3 flex-col'>
        {[...friends].reverse().map((friend) => (
          <div
            onClick={() => navigate(`/home/chat/${friend._id}`)}
            key={friend._id}
            className='h-12 w-full bg-white rounded-md flex gap-1 shadow-2xl shadow-black cursor-pointer'
          >
          <div className='h-full w-[30%] flex justify-center items-center'>
            <div className='h-10 w-10 rounded-full bg-purple-900 cursor-pointer'></div>
          </div>
          <div className='w-full h-full flex flex-col items-start justify-center'>
              <h1 className='text-[14px] font-semibold'>{friend.fullname}</h1>
            <div className='text-[12px] font-light flex gap-1 items-center'>
              <span ><CheckCheck size={15} /></span>
              <span>Hello , How are You ?</span>
            </div>
          </div>
        </div>
        ))}
      </div>

    </div>
  )
}

export default Sidebar
