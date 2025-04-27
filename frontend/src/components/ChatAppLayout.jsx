import React from 'react'
import { EllipsisVertical, Search, Lock, Plus ,  Send} from 'lucide-react'

function ChatAppLayout({}) {
  return (
    <div className='h-full w-full bg-slate-200 flex flex-col gap-1 py-1'>

      {/* chat Header */}
      <div className='h-18 w-full bg-[#2C2C2C] flex justify-between items-center py-1 px-5 text-white'>
        {/* left side */}
        <div className='flex gap-3 items-center cursor-pointer'>
          <div className='h-10 w-10 rounded-full bg-purple-200'></div>
          <div className='leading-1'>Siddhant Yadav</div>
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
        <div className='w-full'>
          <input
            type="text"
            name="userMessage"
            id="userMessage"
            placeholder="Type a message"
            className="w-full min-h-10 h-auto max-h-[4.5rem] overflow-y-auto bg-white/10 rounded-md outline-none border-none px-5"
          />
        </div>
        <div className='bg-white/90 text-black hover:bg-purple-600 hover:text-white transition-all duration-300 ease-out cursor-pointer py-2 px-3 rounded-full'>
          <Send />
        </div>
      </div>
      
      {/* SLogan (message) */}
      <div className='w-full flex justify-center items-center text-[11px]  mb-1'>All messages are end-to-end encrypted <Lock size={13} className='ml-2'/></div>

    </div>
  )
}

export default ChatAppLayout
