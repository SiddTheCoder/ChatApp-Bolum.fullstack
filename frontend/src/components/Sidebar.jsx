import { useState, useEffect, useRef } from 'react'
import { CheckCheck, UserSearch, ChevronDown, Trash} from 'lucide-react'
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

  const [outletState, setOutletState] = useState('homeChats'); 
  const [openChatId, setOpenChatId] = useState(null); // stores the ID of the open dropdown

  const [tooltip, setTooltip] = useState(null);
  const timerRef = useRef(null);

  const handleMouseEnter = (label) => {
    timerRef.current = setTimeout(() => {
      setTooltip(label);
    }, 150); 
  };
  const handleMouseLeave = () => {
    // setChatOptions(false)
    clearTimeout(timerRef.current);
    setTooltip(null);
  };

  const handleChatOptionClick = (id) => {
    setOpenChatId(prev => (prev === id ? null : id));
  }
  
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

  const handleArchieveClick = async (e) => {
    e.stopPropagation(); // prevent navigating to chat
    if (!openChatId) return; // if no chat is open, do nothing
    // try {
    //   const response = await axios.post('https://chatapp-bolum-backend.onrender.com/api/v1/chat/archive-chat', {
    //     chatId: openChatId
    //   }, {
    //     withCredentials: true
    //   })
    //   console.log('Chat Archieved Successfully', response.data)
    //   setOpenChatId(null) // close the dropdown after archiving
    //   getUserFriendsWithTheirLatestMessages() // refresh friends list
    // } catch (err) {
    //   console.log('Error while archiving chat', err)
    // }
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
      console.log('Friends with latest Message ', response.data)
      const a = response.data.flat()
      setFriends(response.data)
      console.log('Friends with chatUd ', a)
    } catch (err) {
      console.log('Error while fetching all friends with their latestMessage',err)
    }
  }

  return (
    <div className='bg-slate-200 w-full h-full flex flex-col p-1 gap-1'>
      
      <div className='h-8 w-full bg-slate-300/40 py-2 px-5 flex justify-start items-center gap-5'>

          {/* Home Icon */}
          <div
            className='relative flex items-center justify-center'
            onMouseEnter={() => handleMouseEnter('chatHome')}
            onMouseLeave={handleMouseLeave}
          >
            <span
              onClick={() => setOutletState('homeChats')}
              className='cursor-pointer hover:scale-110 transition-all duration-150 ease-in flex text-sm items-center'
            >
              <House size={19} />
            </span>

            {tooltip === 'chatHome' && (
              <div className='absolute top-full mt-1 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded shadow-md z-10 whitespace-nowrap'>
                Chat Home
              </div>
            )}
          </div>

          {/* Search Icon */}
          <div
            className='relative flex items-center justify-center'
            onMouseEnter={() => handleMouseEnter('Search')}
            onMouseLeave={handleMouseLeave}
          >
            <span className='cursor-pointer hover:scale-110 transition-all duration-150 ease-in flex text-sm items-center'>
              <UserSearch size={19} />
            </span>

            {tooltip === 'Search' && (
              <div className='absolute top-full mt-1 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded shadow-md z-10 whitespace-nowrap'>
                Search
              </div>
            )}
          </div>

          {/* Archive Icon */}
          <div
            className='relative flex items-center justify-center'
            onMouseEnter={() => handleMouseEnter('Archive')}
            onMouseLeave={handleMouseLeave}
          >
            <span onClick={() => setOutletState('archivedChats')} className='cursor-pointer hover:scale-110 transition-all duration-150 ease-in flex text-sm items-center'>
              <Archive size={19} />
            </span>

            {tooltip === 'Archive' && (
              <div className='absolute top-full mt-1 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded shadow-md z-10 whitespace-nowrap'>
                Archive
              </div>
            )}
          </div>

      </div>


      <div className='w-full flex justify-center'>
        <div className='border-b-2 border-slate-400 w-[90%]'></div>
      </div>

      {outletState === 'homeChats' && (
        <div className='h-full w-full bg-transparent p-2 flex gap-3 flex-col overflow-y-scroll custom-scrollbar custom-scrollbar-hover'>
        {[...friends].reverse().map((friend) => (
          <div
            onClick={() => navigate(`/home/chat/${friend?._id}`)}
            key={friend._id}
            onMouseEnter={() => handleMouseEnter(friend.fullname)}
            onMouseLeave={handleMouseLeave}
            className={`h-12 w-full bg-white/30 rounded-md flex gap-1  cursor-pointer relative hover:bg-white/100 transition-all duration-150 ease-in-out `}

          >
          <div className='h-full w-[30%] flex justify-center items-center'>
              <div className='h-10 w-10 rounded-full bg-purple-900 cursor-pointer bg-cover overflow-hidden'>
                <img src={friend?.avatar} alt="" />
            </div>
          </div>
          <div className='w-full h-full flex flex-col items-start justify-center'>
              <h1 className='text-[13.5px] font-semibold'>{friend.fullname}</h1>
            <div className='text-[12px] font-light flex gap-1 items-center'>
              <span ><CheckCheck size={15} /></span>
              <span className="truncate max-w-[150px] overflow-hidden whitespace-nowrap text-gray-600">
                {latestMessages[friend._id]?.content || friend?.lastMessage?.content || 'Type your first message👋'}
              </span>
            </div>
            </div>
          <div className='absolute bottom-1 right-2'>
            <span className='text-[12px] font-light text-gray-500'>
              {new Date(friend?.lastMessage?.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
          </div>
           {tooltip === friend.fullname && (
              <div
                onClick={(e) => {
                  e.stopPropagation(); // prevent navigating to chat
                  handleChatOptionClick(friend._id);
                }}
                className='absolute top-1 right-2'>
                <span className='cursor-pointer hover:scale-110 transition-all duration-150 ease-in flex text-sm items-center'> <ChevronDown size={30} className='bg-slate-300/50 rounded-full p-1' />
                </span>
              </div>
            )}
            
            {openChatId === friend._id && (
              <div
                className='absolute top-5 right-7 z-20'
                onMouseLeave={() => setOpenChatId(null)}
              >
                <div className='h-22 my-2 w-36 bg-gray-300/90 rounded-md flex flex-col p-2 shadow-lg'>
                  <span onClick={handleArchieveClick} className='text-sm transition-all duration-150 ease-in bg-purple-200/10 hover:bg-purple-400/10 py-2 flex gap-1 items-center px-2 pt-1'><Archive size={15} /> Archieve Chat</span>
                  <div className='w-full flex justify-center'><span className='w-[95%] border-b-2 my-1 border-b-blue-900'></span></div>
                  <span className='bg-purple-200/10 hover:bg-purple-400/10 transition-all duration-150 ease-in py-2 text-sm flex gap-1 items-center px-2 pt-1'><Trash size={15} /> Delete Chat</span>
                </div>
              </div>
            )}
            
        </div>
        ))}
      </div>
      )}

      {outletState === 'archivedChats' && (
        <div className='h-full w-full bg-transparent p-2 flex gap-3 flex-col overflow-y-scroll custom-scrollbar custom-scrollbar-hover'>
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Temporibus optio, asperiores, quos aperiam magni minus labore quasi itaque eum reiciendis fugiat!
        </div>
      )}

    </div>
  )
}

export default Sidebar
