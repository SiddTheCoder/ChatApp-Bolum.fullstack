import React, { useEffect, useState , useRef} from 'react'
import {
  EllipsisVertical, Search, Lock, Plus, Send, X, CircleUserRound, UserX,
  Trash,
  Users
 } from 'lucide-react'
import { useParams } from 'react-router-dom'
import axios from 'axios';
import { useAuth } from '../hooks/useAuth'
import { useSocket } from '../context/SocketContext'
import MessageBubble from './MessageBubble'
import { useNavigate } from 'react-router-dom'

function ChatApp({ }) {
  const navigate = useNavigate()
  const { friendId } = useParams()
  const { socket } = useSocket()
  const currentUser = useAuth()
  const [user, setUser] = useState(null)
  const [content, setContent] = useState('')
  const messagesEndRef = useRef(null);
  const [messageCollection, setMessageCollection] = useState([])
  const [userInfoModelStatus,setUserInfoModelStatus] = useState(false)

  // getting iser by id 
  const getUserById = async () => {
    try {
      const response = await axios.get(`/api/v1/user/get-user-by-id?userId=${friendId}`)
      setUser(response.data.data)
    } catch (err) {
      console.log('Error occured while fetching the user by ID', err)
    }
  }

  // first render
  useEffect(() => {
    getUserById()
    findOrCreateChatAndGetAllMessages(friendId)
  }, [friendId])

  
  // for auto-scrolling
  useEffect(() => {
    scrollToBottom();
  }, [messageCollection]);

  // socket behaviours
  useEffect(() => {
    socket?.on('message-sent', async ({message,chatId}) => {
      console.log('Message Sent', message)
     await findOrCreateChatAndGetAllMessages(friendId)
    })

    socket?.on("new-message", async ({message,chatId}) => {
      console.log('Message Received', message)
      await findOrCreateChatAndGetAllMessages(friendId)
    })

    return () => {
      socket?.off('new-message')
    }
  }, [socket])

  // reacting messages
  useEffect(() => {
    if (!socket || typeof socket.on !== 'function') {
      console.log('Socket is not function')
      return
    };
  
    const onReacted = ( ChatMessage ) => {
      findOrCreateChatAndGetAllMessages(friendId)
    };
  
    const onGotReacted = (ChatMessage) => {
      findOrCreateChatAndGetAllMessages(friendId)
    };
  
    socket.on('message-reacted', onReacted);
    socket.on('got-message-reacted', onGotReacted);

    socket.on('got-message-dis-reacted', () => {
      findOrCreateChatAndGetAllMessages(friendId)
    })

    socket.on('message-dis-reacted', () => {
      findOrCreateChatAndGetAllMessages(friendId)
    })
  
    return () => {
      socket.off('message-reacted', onReacted);
      socket.off('got-message-reacted', onGotReacted);
      socket.off('message-dis-reacted')
      socket.off('got-message-dis-reacted')
    };
  }, [socket])

  // getting chat messages
  const getChatMessages = async (chatId) => {
    try {
      const response = await axios.get(`/api/v1/chatMessage/chat/${chatId}/messages`)
      console.log('Chat Message Fteched from getChatMessages', response.data.data)
      setMessageCollection(response.data.data)
    } catch (err) {
      console.log('message retrieval failed for chat', err)
    }
  }

  // getting chat or if not then creating it and also getting messages inside it 
  const findOrCreateChatAndGetAllMessages = async (friendId) => {
    try {
      const response = await axios.get(`/api/v1/chat/find-or-create-chat-getAllMessages?friendId=${friendId}`)
      console.log("Chat and Message Fetched from findOrCreateChatAndGetAllMessages", response.data.data)
      setMessageCollection(response.data.data)
    } catch (err) {
      console.log('Error occured at findOrCreateChatAndGetAllMessages' , err)
    }
  }

  // handlong message
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
    await findOrCreateChatAndGetAllMessages(friendId)
  }

  // for auto scroll funtion
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  
  return (
    <div className='h-[94vh] flex flex-row-reverse gap-1'>

      {/* User Infro Model */}
      {userInfoModelStatus && (
        <div
        className={`z-50 rounded-md transition-all duration-700 ease-in-out
          absolute right-2 top-25 h-[70vh] w-[24%] py-1 bg-gradient-to-br from-blue-500 via-purple-950 to-blue-700 text-white
          ${userInfoModelStatus ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto duration-500' : 'opacity-0 translate-y-4 scale-95 pointer-events-none'}
        `}>
        <div
            className='wraapeer-closer flex w-full h-10 items-center justify-start px-2'>
            <X size={35} onClick={() => setUserInfoModelStatus(false)} className='hover:bg-white/90 hover:text-black text-white transition-all duration-300 ease-out cursor-pointer p-2 rounded-full' />
        </div>
        <div className='h-[30%] w-full flex justify-center items-center'>
          <div className='w-30 h-30 overflow-hidden rounded-full object-contain'>
            <img src={user?.avatar} alt="" />
          </div>
        </div>
          <div className='w-full text-white text-center -mt-2'>{user?.fullname}</div>
          
          <div className='w-full h-10 flex items-center justify-center gap-3 mt-4'>
            <span className="relative group">
            <CircleUserRound
              size={40}
              onClick={() => navigate(`/${user?.username}`)}
              className="hover:bg-white/90 bg-white/20 hover:text-black text-white transition-all duration-300 ease-out cursor-pointer p-2 rounded-full"
            />
            <div className="absolute top-10 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 scale-95 group-hover:scale-100 transition-all duration-300 pointer-events-none whitespace-nowrap">
              Visit Profile
            </div>
          </span>
          </div>
          
          <div className='w-full h-auto flex flex-col mt-4 text-sm'>
            <ul className='w-auto pr-10 cursor-pointer h-auto p-2 hover:bg-white/30 flex items-center gap-2 '>
             <span><UserX size={15} /></span> Block {user?.fullname?.split(" ")[0]}
            </ul>
            <ul className='w-auto pr-10 cursor-pointer h-auto p-2 hover:bg-white/30 flex items-center gap-2  '>
              <span><Trash size={15} /></span>Delete your chats with {user?.fullname?.split(" ")[0]}
            </ul>
            <ul className='w-auto pr-10 cursor-pointer h-auto p-2 hover:bg-white/30 flex items-center gap-2  '>
              <span><Users size={15} /></span>Create Group including {user?.fullname?.split(" ")[0]}
            </ul>
          </div>
        {/* Add more itmes here */}
      </div>
      )}

      <div className='h-full w-full bg-slate-200 flex flex-col gap-1 py-1'>

      {/* chat Header */}
      <div className='h-18 w-full bg-[#5c5c5c] flex justify-between items-center py-1 px-5 text-white'>
        {/* left side */}
          <div
            onClick={() => navigate(`/${user.username}`)}
            className='flex gap-3 items-center cursor-pointer'>
          <div className='h-10 w-10 rounded-full bg-purple-200 object-cover overflow-hidden'>
            <img src={user?.avatar} alt="" />
          </div>
          <div className='leading-1'>{user?.fullname}</div>
        </div>
        {/* right side */}
        <div className='flex gap-2 items-center'>
          <span
            className='hover:bg-white/90 hover:text-black transition-all duration-300 ease-out cursor-pointer p-2 rounded-full'><Search size={20} />
          </span>
            <span
              onClick={() => setUserInfoModelStatus(prev => !prev)}
            className='hover:bg-white/90 bg-white/10 hover:text-black transition-all duration-300 ease-out cursor-pointer p-2 rounded-full'><EllipsisVertical size={20} />
          </span>
        </div>
      </div>
      
      {/* message showcaser */}
      <div className='w-full h-full bg-[#e3e0db] overflow-y-scroll px-2'>
        {messageCollection.map((message) => (
          <MessageBubble 
            user = {user}
            key={message._id} 
            isSelf={message?.sender?._id === currentUser?._id}
            message={message}
          />
        ))}
        <div ref={messagesEndRef}></div> 
      </div>
            
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
      <div className='w-full flex justify-center items-center text-[11px] '>All messages are end-to-end encrypted <Lock size={13} className='ml-2'/></div>

    </div>
    </div>
  )
}

export default ChatApp
