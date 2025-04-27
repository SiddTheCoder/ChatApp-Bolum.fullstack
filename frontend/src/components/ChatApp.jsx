import React, { useEffect, useState } from 'react'
import { EllipsisVertical, Search, Lock, Plus, Send } from 'lucide-react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../hooks/useAuth'
import { useSocket } from '../context/SocketContext'

function ChatApp({ }) {
  const { friendId } = useParams()
  const { socket } = useSocket()
  const currentUser = useAuth()
  const [user, setUser] = useState(null)
  const [content,setContent] = useState('')

  const getUserById = async () => {
    try {
      const response = await axios.get(`/api/v1/user/get-user-by-id?userId=${friendId}`)
      console.log('User Fteched by ID successfully', response.data.data)
      setUser(response.data.data)
    } catch (err) {
      console.log('Error occured while fetching the user by ID', err)
    }
  }

  useEffect(() => {
    getUserById()
  }, [friendId])


  useEffect(() => {
    socket?.on('message-sent', (message) => {
      console.log('Message Sent', message)
    })

    socket?.on("new-message", (message) => {
      console.log('Message Received', message)
    })

    return () => {
      socket?.off('new-message', handleMessageReceived)
    }
  }, [socket])

  const handleMessageInjector = async (e) => {
    e.preventDefault();
     if (content.trim() === "") return; // Don't send if message is empty
    console.log('Try : Message sent from',currentUser?.fullname,' to ',user?.fullname,' withcontent ',content)
    socket?.emit('send-message', {
      senderId : currentUser._id,
      receiverId : friendId,
      content : content
    })
    console.log('Message sent from', currentUser?.fullname, 'to', user?.fullname)
    setContent('')
  }

  
  
  return (
    <div className='h-full w-full bg-slate-200 flex flex-col gap-1 py-1'>

      {/* chat Header */}
      <div className='h-18 w-full bg-[#2C2C2C] flex justify-between items-center py-1 px-5 text-white'>
        {/* left side */}
        <div className='flex gap-3 items-center cursor-pointer'>
          <div className='h-10 w-10 rounded-full bg-purple-200'></div>
          <div className='leading-1'>{user?.fullname}</div>
        </div>
        {/* right side */}
        <div className='flex gap-2 items-center'>
          <span
            className='hover:bg-white/90 hover:text-black transition-all duration-300 ease-out cursor-pointer p-2 rounded-full'><Search size={20} />
          </span>
          <span
            className='hover:bg-white/90 bg-white/10 hover:text-black transition-all duration-300 ease-out cursor-pointer p-2 rounded-full'><EllipsisVertical size={20} />
          </span>
        </div>
      </div>
      
      {/* message showcaser */}
      <div className='w-full h-full bg-[#e3e0db] overflow-y-scroll'></div>
      
       {/* message injector */}
      <div className='w-full h-20 bg-[#2C2C2C] flex justify-center items-center py-1 px-5 gap-3 text-white'>
        <div className='hover:bg-white/90 hover:text-black transition-all duration-300 ease-out cursor-pointer p-2 rounded-full'><Plus /></div>
        <form onSubmit={handleMessageInjector} className='w-full'>
          <input
            type="text"
            name="userMessage"
            id="userMessage"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Type a message"
            className="w-full min-h-10 h-auto max-h-[4.5rem] overflow-y-auto bg-white/10 rounded-md outline-none border-none px-5"
          />
        </form>
        <div onClick={handleMessageInjector} className='bg-white/90 text-black hover:bg-purple-600 hover:text-white transition-all duration-300 ease-out cursor-pointer py-2 px-3 rounded-full'>
          <Send />
        </div>
      </div>
      
      {/* SLogan (message) */}
      <div className='w-full flex justify-center items-center text-[11px]  mb-1'>All messages are end-to-end encrypted <Lock size={13} className='ml-2'/></div>

    </div>
  )
}

export default ChatApp
