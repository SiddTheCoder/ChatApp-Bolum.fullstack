import React from 'react'
import { io } from 'socket.io-client'
import { useEffect, useState } from 'react'
import { getPrivateRoomId } from '../utils/chat.utils'

const socket = io('http://localhost:3000')

function ChatApp() {

  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])
  const [receiverId, setReceiverId] = useState('')
  

  useEffect(() => { 
    

    socket.on('connect', () => {
      console.log('A user Connected', socket.id);
    })

    socket.on('recieve-message', (msgData) => {
      setMessages((prevMessages) => [...prevMessages, message])
      console.log(`Msg : `, msgData.message);
    })

    return () => {
      socket.off('connection')
      socket.off('recieve-message')
    }
  }, [])

  const handleGroupJoin = () => { 
    const roomId = getPrivateRoomId(socket.id, receiverId)
    socket.emit('join-room', roomId)
    console.log('Joined room:', roomId);
  }

  const handleMessageSend = () => {
    const roomId = getPrivateRoomId(socket.id, receiverId)
    socket.emit('send-message', { roomId, message })
    setMessages((prevMessages) => [...prevMessages, message])
    setMessage('')
  }

  return (
    <>
      <div className='h-52 w-2xl bg-slate-300 mx-auto'>
        <h1 className='text-center text-2xl font-bold'>Chat App</h1>
        <div className='flex flex-col items-center justify-center h-full'>
          <input
            type="text" placeholder='group name' className='border-2 border-gray-400 rounded-md p-2 mb-2'
            onChange={(e) => setReceiverId(e.target.value)}
            value={receiverId}
          />

          <input
            type="text" placeholder='message' className='border-2 border-gray-400 rounded-md p-2 mb-2'
            onChange={(e) => setMessage(e.target.value)}
            value={message}
          />

          <button
            className='bg-blue-500 text-white px-4 py-2 rounded-md'
            onClick={handleGroupJoin}>Join Room
          </button>

          <button
            className='bg-green-500 text-white px-4 py-2 rounded-md mt-2'
            onClick={handleMessageSend}>Send Message
          </button>

        </div>
        {/* {messages.length > 0 && (
          <div className='mt-4 p-2 bg-white rounded-md shadow-md max-h-40 overflow-y-auto'>
            <h2 className='text-lg font-semibold'>Messages:</h2>
            <ul className='list-disc pl-5'>
              {messages.map((msg, index) => (
                <li key={index} className='mb-1'>{msg}</li>
              ))}
            </ul>
          </div>
        )} */}
      </div>
    </>
  )
}

export default ChatApp
