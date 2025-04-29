import React from 'react';

const MessageBubble = ({ isSelf, message, user }) => {
  return (
    <div className={`w-full flex ${isSelf ? 'justify-end' : 'justify-start'} my-1`}>
      <div className={`flex ${isSelf ? 'flex-row-reverse' : 'flex-row'} items-end gap-2 max-w-[80%]`}>

        {/* Avatar only if not self */}
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
            ${isSelf 
              ? 'bg-blue-500 text-white rounded-br-none' 
              : 'bg-gray-300 text-black rounded-bl-none'
            }
          `}
        >
          {message.content}
        </div>

      </div>
    </div>
  );
};

export default MessageBubble;
