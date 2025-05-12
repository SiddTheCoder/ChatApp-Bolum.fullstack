import React, { useEffect } from 'react'
import { useSocket } from '../context/SocketContext';

function EmojiCollection({ ChatMessageId , chatMessageSenderId}) {
  const {socket} = useSocket()

  const emojies = {
    '#123': '❤️',
    '#321': '🥲',
    '#231': '👋',
    '#555': '🔥',
    '#777': '😂',
    '#888': '👍'
  };

  const handleEmojiClick = (id)  => {
    console.log('EMOJI clicked ', id)
    socket.emit('react-message', {
      messageId : ChatMessageId,
      emojiId: id,
      receiverId : chatMessageSenderId
    })
  }

  useEffect(() => {
    if (!socket || typeof socket.on !== 'function') {
      console.log('Socket is not function')
      return
    };
  
    const onReacted = ( ChatMessage ) => {
      console.log('Message-Reacted in', ChatMessage);
    };
  
    const onGotReacted = (ChatMessage) => {
      console.log('Got Message-Reacted in', ChatMessage);
    };
  
    socket.on('message-reacted', onReacted);
    socket.on('got-message-reacted', onGotReacted);
  
    return () => {
      socket.off('message-reacted', onReacted);
      socket.off('got-message-reacted', onGotReacted);
    };
  }, [socket]);
  
  
  return (
    <div className='h-12 w-46  items-center flex justify-around p-2 rounded-md shadow-2xl shadow-black bg-white/90 absolute -top-12  left-5'>
      {Object.entries(emojies).map(([id, emoji]) => (
        <span className='text-xl hover:-translate-y-2 hover:scale-150 hover:-rotate-12 duration-300 ease-in-out transition-all cursor-pointer' onClick={() => handleEmojiClick(id)} key={id}>{emoji }</span>
      ))}
    </div>
  )
}

export default EmojiCollection
