import React, { useState, useEffect } from 'react'
import { CheckCheck, Search, SearchCheck, UserSearch } from 'lucide-react'
import axios from 'axios';
import { useSocket } from '../context/SocketContext'
import { useAuth } from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom';
import {House, Archive} from 'lucide-react'

function Sidebar() {
  const navigate = useNavigate()
  const { socket } = useSocket()
  const {currentUser} = useAuth()
  const [friends, setFriends] = useState([])
  const [latestMessages, setLatestMessages] = useState({});
  
  const getUserAllFriends = async () => {
    try {
      const response = await axios.get('https://chatapp-bolum-backend.onrender.com/api/v1/user/get-user-all-freinds', {}, {
        withCredentials : true
      })
      // console.log('Freinds fetched sc-----c', response.data.data?.friends)
      setFriends(response.data.data?.friends)
    } catch (err) {
      console.log('Error Occured while getting all friends', err)
    }
  }

  useEffect(() => {
    
    getUserFriendsWithTheirLatestMessages()
    socket?.on('friend-request-accepted', () => {
      getUserFriendsWithTheirLatestMessages()
    })
    socket?.on('new-message', async ({message}) => {
      setLatestMessages((prev) => ({
        ...prev,
        [message.sender]: message.content, // store latest message for friend
      }));
      // console.log("New message recieved")
      await getUserFriendsWithTheirLatestMessages()
    });

    return () => {
      socket?.off('new-message');
    };
  }, [currentUser,socket])

  const getUserFriendsWithTheirLatestMessages = async () => {
    try {
      const response = await axios.get("https://chatapp-bolum-backend.onrender.com/api/v1/user/get-user-friends-withLatest-messages", {
        withCredentials : true
      })
      // console.log('Friends with latest Message ', response.data)
      setFriends(response.data)
    } catch (err) {
      console.log('Error while fetching all friends with their latestMessage',err)
    }
  }

  return (
    <div className='bg-slate-200 w-full h-full flex flex-col p-1 gap-1'>
      
      <div className='h-8 w-full bg-slate-300/40 py-2 px-5 flex justify-start items-center gap-3'>
        <span className='cursor-pointer hover:scale-110 transition-all duration-150 ease-in flex text-sm items-center gap-1' onClick={() => navigate('/home')}> <House size={21} /></span>

        <span className='cursor-pointer hover:scale-110 transition-all duration-150 ease-in flex text-sm items-center gap-1'> <UserSearch size={21} /></span>

        <span className='cursor-pointer hover:scale-110 transition-all duration-150 ease-in flex text-sm items-center gap-1'> <Archive size={21} /></span>
    
      
      </div>

      <div className='w-full flex justify-center'>
        <div className='border-b-2 border-slate-400 w-[90%]'></div>
      </div>

      <div className='h-full w-full bg-transparent p-2 flex gap-3 flex-col overflow-y-scroll custom-scrollbar custom-scrollbar-hover'>
        {[...friends].reverse().map((friend) => (
          <div
            onClick={() => navigate(`/home/chat/${friend?._id}`)}
            key={friend._id}
            className={`h-12 w-full bg-white/40 rounded-md flex gap-1 shadow-2xl shadow-black cursor-pointer relative hover:bg-white/100 transition-all duration-150 ease-in-out `}

          >
          <div className='h-full w-[30%] flex justify-center items-center'>
              <div className='h-10 w-10 rounded-full bg-purple-900 cursor-pointer bg-cover overflow-hidden'>
                <img src={friend?.avatar} alt="" />
            </div>
          </div>
          <div className='w-full h-full flex flex-col items-start justify-center'>
              <h1 className='text-[14px] font-semibold'>{friend.fullname}</h1>
            <div className='text-[12px] font-light flex gap-1 items-center'>
              <span ><CheckCheck size={15} /></span>
              <span className="truncate max-w-[150px] overflow-hidden whitespace-nowrap">
                {latestMessages[friend._id]?.content || friend?.lastMessage?.content || 'Type your first message👋'}
              </span>
            </div>
            </div>
          <div className='absolute top-2 right-2'>
            <span className='text-[12px] font-light text-gray-500'>
              {new Date(friend?.lastMessage?.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
          </div>
        </div>
        ))}
      </div>

    </div>
  )
}

export default Sidebar
