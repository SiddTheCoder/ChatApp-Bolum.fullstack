import React, { useState } from 'react';
import EmojiCollection from './EmojiCollection';
import { Baby} from 'lucide-react'
import { useSocket } from '../context/SocketContext';

const MessageBubble = ({ isSelf, message, user }) => {

  const {socket} = useSocket()
  const emojies = {
    '#123': '❤️',
    '#321': '🥲',
    '#231': '👋',
    '#555': '🔥',
    '#777': '😂',
    '#888': '👍'
  };

  const [isHovered, setIsHovered] = useState(false)
  const [openEmojiCollection, setOpenEmojiCollection] = useState(false)

  const handleMouseHoverEntry = () => {
    if (!isSelf) {
      setIsHovered(true)
    }
  }
  const handleMouseHoverLeave = () => {
    setIsHovered(false)
    setOpenEmojiCollection(false)
  }

  const handleEmojiDoubleClick = (messageId,emojiId,receiverId) => {
    console.log('Clicked on the message,', messageId)
    socket.emit('dis-react-message', {
      messageId, emojiId, receiverId
    })
  }

  return (
    <div className={`w-full flex ${isSelf ? 'justify-end' : 'justify-start'} my-1`}>
      <div
        onMouseEnter={handleMouseHoverEntry}
        onMouseLeave={handleMouseHoverLeave}
        className={`flex ${isSelf ? 'flex-row-reverse' : 'flex-row'} items-end gap-2 max-w-[80%] relative`}>

        {!isSelf && (
          <div className="h-6 w-6 rounded-full bg-purple-800 object-cover overflow-hidden">
            <img src={user?.avatar} alt="" />
          </div>
        )}

        {/* Message box */}
        <div
          className={`
            px-3 py-2 
            rounded-2xl 
            text-[16px] 
            break-words
            relative
            ${isSelf 
              ? 'bg-blue-500 text-white rounded-br-none' 
              : 'bg-gray-300 text-black rounded-bl-none'
            }
            ${message.isReacted 
            ? 'mb-4'
            : ''
            }
          `}
        >
          {message.content}
          <span
            onDoubleClick={() => handleEmojiDoubleClick(message?._id,message.reactedEmoji,message.sender?._id)}
            className='absolute cursor-pointer -bottom-4 text-sm bg-white/90 rounded-full  right-0'>
            {message.isReacted ? emojies[message.reactedEmoji] : null}
          </span>
        </div>
        
        {isHovered && (
          <span
            onClick={() => setOpenEmojiCollection(prev => !prev)}
            className='absolute font-thin -right-5 cursor-pointer hover:scale-125 transition-all duration-150 ease-in bottom-[8px]'>
            <Baby size={20} />
          </span>
        )}

        <div className=''>
          {openEmojiCollection && (
            <EmojiCollection ChatMessageId={message?._id} chatMessageSenderId={message.sender?._id} />
          )}
        </div>

      </div>
    </div>
  );
};

export default MessageBubble;
