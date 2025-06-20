import { useState, useEffect, useRef } from 'react'
import { CheckCheck, UserSearch, ChevronDown, Trash } from 'lucide-react'
import axios from 'axios';
import { useSocket } from '../context/SocketContext'
import { useAuth } from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom';
import { House, Archive } from 'lucide-react'
import ToasterNotification from './semi-components/ToasterNotification'

function Sidebar() {
  const navigate = useNavigate()
  const { socket } = useSocket()
  const { currentUser } = useAuth()
  const [friends, setFriends] = useState([])
  const [latestMessages, setLatestMessages] = useState({});
  const [archivedChats, setArchivedChats] = useState([]);
  const [outletState, setOutletState] = useState('homeChats');
  const [openChatId, setOpenChatId] = useState(null); // stores the ID of the open dropdown

  const [archivedChatsLoading, setArchivedChatsLoading] = useState(false);
  const [archivingChat, setArchivingChat] = useState(false);
  const [unArchivingChat, setUnArchivingChat] = useState(false);
  const [userChatLoading, setUserChatLoading] = useState(false);

  const [showToast, setShowToast] = useState(false);

  const triggerToast = () => {
    setShowToast(true);
  };

  const [tooltip, setTooltip] = useState(null);
  const timerRef = useRef(null);

  const handleMouseEnter = (label) => {
    timerRef.current = setTimeout(() => {
      setTooltip(label);
    }, 150);
  };

  const handleMouseLeave = () => {
    clearTimeout(timerRef.current);
    setTooltip(null);
  };

  const handleChatOptionClick = (id, e) => {
    e.stopPropagation();
    setOpenChatId(prev => (prev === id ? null : id));
  }

  const getUserFriendsWithTheirLatestMessages = async () => {
    try {
      setUserChatLoading(true)
      const response = await axios.get("https://chatapp-bolum-backend.onrender.com/api/v1/user/get-user-friends-withLatest-messages", {
        withCredentials: true
      })
      console.log('Friends with latest Message ', response.data)
      setFriends(response.data?.friends || [])
      setUserChatLoading(false)
    } catch (err) {
      console.log('Error while fetching all friends with their latestMessage', err)
      setUserChatLoading(false)
    }
  }

  const getArchivedChats = async (e) => {
    setArchivedChatsLoading(true)
    e.stopPropagation();
    const chatType = 'archivedChats';
    try {
      const response = await axios.get(`https://chatapp-bolum-backend.onrender.com/api/v1/user/get-user-friends-withLatest-messages?chatType=${chatType}`, {
        withCredentials: true
      })
      // console.log('Archived chat fetched Successfully', response.data)
      setArchivedChats(response.data?.friends || [])
      setOpenChatId(null) // close the dropdown after archiving
      setArchivedChatsLoading(false)
    } catch (err) {
      setArchivedChatsLoading(false)
      console.log('Error while archiving chat', err)
    }
  }

  const archiveChat = async (chatId, e) => {
    if (!chatId) {
      console.error('No chat ID provided for archiving');
      return;
    }
    setArchivingChat(true)
    e.stopPropagation();
    try {
      const response = await axios.post(`https://chatapp-bolum-backend.onrender.com/api/v1/chat/archive-chat?chatId=${chatId}`, {}, {
        withCredentials: true
      });
      getUserFriendsWithTheirLatestMessages(); // Refresh friends list after archiving
      setOpenChatId(null) // close the dropdown after archiving
      setArchivingChat(false)
    } catch (error) {
      console.error('Error archiving chat:', error);
      setArchivingChat(false)
    }
  }

  const unArchiveChat = async (chatId, e) => {
    setUnArchivingChat(true)
    e.stopPropagation();
    try {
      const response = await axios.post(`https://chatapp-bolum-backend.onrender.com/api/v1/chat/un-archive-chat?chatId=${chatId}`, {}, {
        withCredentials: true
      });
      // console.log('Chat unarchived successfully:', response.data);
      getArchivedChats(e)
      setOpenChatId(null) // close the dropdown after unarchiving
      setUnArchivingChat(false)
    } catch (error) {
      console.error('Error unarchiving chat:', error);
      setUnArchivingChat(false)
    }
  }

  useEffect(() => {
    getUserFriendsWithTheirLatestMessages()
    
    socket?.on('friend-request-accepted', () => {
      getUserFriendsWithTheirLatestMessages()
    })
    
    socket?.on('new-message', async ({ message }) => {
      setLatestMessages((prev) => ({
        ...prev,
        [message.sender]: message.content, // store latest message for friend
      }));
      await getUserFriendsWithTheirLatestMessages()
    });

    return () => {
      socket?.off('friend-request-accepted');
      socket?.off('new-message');
    };
  }, [currentUser])


  return (
    <div className='bg-slate-200 w-full h-full flex flex-col p-1 gap-1'>
      <div className='h-8 w-full bg-slate-300/40 py-2 px-5 hidden sm:flex justify-start items-center gap-2'>
        {/* Home Icon */}
        <div
          className='relative flex items-center justify-center'
          onMouseEnter={() => handleMouseEnter('chatHome')}
          onMouseLeave={handleMouseLeave}
        >
          <span
            onClick={() => {
              setOutletState('homeChats')
              getUserFriendsWithTheirLatestMessages()
            }}
            className='cursor-pointer hover:scale-110 transition-all duration-75 ease-in flex text-sm items-center'
          >
            <House className='hover:bg-purple-900 hover:text-white p-1 rounded-full ' size={29} />
          </span>

          {tooltip === 'chatHome' && (
            <div className='absolute top-full mt-1 left-1/2 -translate-x-1/2 bg-purple-950 text-white text-xs px-2 py-1 rounded shadow-md z-10 whitespace-nowrap'>
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
            <UserSearch  className='hover:bg-purple-900 hover:text-white p-1 rounded-full ' size={29} />
          </span>

          {tooltip === 'Search' && (
            <div className='absolute top-full mt-1 left-1/2 -translate-x-1/2 bg-purple-950 text-white text-xs px-2 py-1 rounded shadow-md z-10 whitespace-nowrap'>
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
          <span onClick={(e) => {
            setOutletState('archivedChats')
            getArchivedChats(e)
          }} className='cursor-pointer hover:scale-110 transition-all duration-150 ease-in flex text-sm items-center'>
            <Archive  className='hover:bg-purple-900 hover:text-white p-1 rounded-full ' size={29} />
          </span>

          {tooltip === 'Archive' && (
            <div className='absolute top-full mt-1 left-1/2 -translate-x-1/2 bg-purple-950 text-white text-xs px-2 py-1 rounded shadow-md z-10 whitespace-nowrap'>
              Archive Chats
            </div>
          )}
        </div>

        {/* Chat with AI */}
        <div
          className='relative flex items-center justify-center'
          onMouseEnter={() => handleMouseEnter('Chat with AI')}
          onMouseLeave={handleMouseLeave}
        >
          <span onClick={(e) => {
            setOutletState('aiChat')
            getAIChat(e)
          }} className='cursor-pointer hover:scale-110 transition-all duration-150 ease-in flex text-sm items-center'>
            <svg
            onClick={() => navigate('/bolum-mentor')}
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-brain-icon lucide-brain cursor-pointer"
          >
            <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z" />
            <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z" />
            <path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4" />
            <path d="M17.599 6.5a3 3 0 0 0 .399-1.375" />
            <path d="M6.003 5.125A3 3 0 0 0 6.401 6.5" />
            <path d="M3.477 10.896a4 4 0 0 1 .585-.396" />
            <path d="M19.938 10.5a4 4 0 0 1 .585.396" />
            <path d="M6 18a4 4 0 0 1-1.967-.516" />
            <path d="M19.967 17.484A4 4 0 0 1 18 18" />
          </svg>
          </span>

          {tooltip === 'Chat with AI' && (
            <div className='absolute top-full mt-1 left-1/2 -translate-x-1/2 bg-purple-950 text-white text-xs px-2 py-1 rounded shadow-md z-10 whitespace-nowrap'>
              Chat with AI
            </div>
          )}
        </div>
      </div>

      <div className='w-full hidden sm:flex justify-center'>
        <div className='border-b-2 border-slate-400 w-[90%]'></div>
      </div>

      {outletState === 'homeChats' && (
        <div className='sm:h-full h-auto w-full p-2 flex flex-row gap-5 sm:gap-3 sm:flex-col sm:overflow-y-scroll overflow-x-scroll custom-scrollbar custom-scrollbar-hover bg-transparent'>
          {!userChatLoading ? [...friends].reverse().map((friend) => (
            <div
              onClick={() => navigate(`/home/chat/${friend?._id}`)}
              key={friend._id}
              onMouseEnter={() => handleMouseEnter(friend.fullname)}
              onMouseLeave={handleMouseLeave}
              className={`h-12 w- bg-white/30 rounded-md flex gap-1 cursor-pointer relative hover:bg-white/100 transition-all duration-150 ease-in-out`}
            >
              <div className='h-full w-auto flex flex-col justify-center items-center'>
                <div className='h-10 w-10 rounded-full bg-purple-900 cursor-pointer bg-cover overflow-hidden'>
                  <img src={friend?.avatar} alt={friend?.fullname} />
                </div>
                <span className='block sm:hidden text-[10px]'>{friend?.fullname.split(' ')[0]}</span>
              </div>
              <div className='w-full h-full hidden sm:flex flex-col items-start justify-center'>
                <h1 className='text-[13.5px] font-semibold'>{friend.fullname}</h1>
                <div className='text-[12px] font-light flex gap-1 items-center'>
                  <span><CheckCheck size={15} /></span>
                  <span className="truncate max-w-[150px] overflow-hidden whitespace-nowrap text-gray-600">
                    {latestMessages[friend._id] || friend?.lastMessage?.content || 'Type your first message👋'}
                  </span>
                </div>
              </div>
              <div className='hidden sm:block absolute bottom-1 right-2'>
                <span className='text-[12px] font-light text-gray-500'>
                  {friend?.lastMessage?.createdAt ? new Date(friend.lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                </span>
              </div>
              {tooltip === friend.fullname && (
                <div
                  onClick={(e) => handleChatOptionClick(friend._id, e)}
                  className='hidden sm:block absolute top-1 right-2'>
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
                    <span
                      onClick={(e) => {
                        archiveChat(friend.lastMessage?.chat, e);
                        if (!friend.lastMessage?.chat) {
                          triggerToast();
                          e.stopPropagation();
                        }
                      }}
                      className='text-sm transition-all duration-150 ease-in bg-purple-200/10 hover:bg-purple-400/10 py-2 flex gap-1 items-center px-2 pt-1'>
                      <Archive  className={`${archivingChat ? 'animate-bounce' : ''}`} size={15} /> {archivingChat ? 'Archiving...' : 'Archive Chat'}
                      <ToasterNotification
                        message="Talk first to archive this chat"
                        show={showToast}
                        onClose={() => setShowToast(false)}
                      />
                    </span>
                    <div className='w-full flex justify-center'><span className='w-[95%] border-b-2 my-1 border-b-blue-900'></span></div>
                    <span className='bg-purple-200/10 hover:bg-purple-400/10 transition-all duration-150 ease-in py-2 text-sm flex gap-1 items-center px-2 pt-1'><Trash size={15} /> Delete Chat</span>
                  </div>
                </div>
              )}
            </div>
          )) : (
            <div className='h-full w-full bg-transparent p-2 flex gap-3 flex-col overflow-y-scroll custom-scrollbar custom-scrollbar-hover'>
              {[...Array(2)].map((_, index) => (
                <div
                  key={index}
                  className='h-12 w-full bg-white/30 rounded-md flex gap-1 cursor-pointer relative animate-pulse'
                >
                  <div className='h-full w-[30%] flex justify-center items-center'>
                    <div className='h-10 w-10 rounded-full bg-gray-400'></div>
                  </div>

                  <div className='w-full h-full flex flex-col items-start justify-center gap-[2px]'>
                    <div className='h-3 w-[60%] bg-gray-400 rounded'></div>
                    <div className='h-2 w-[80%] bg-gray-300 rounded'></div>
                  </div>

                  <div className='absolute bottom-1 right-2'>
                    <div className='h-2 w-10 bg-gray-300 rounded'></div>
                  </div>

                  <div className='absolute top-1 right-2'>
                    <div className='h-6 w-6 bg-gray-300 rounded-full'></div>
                  </div>
                </div>
              ))}
            </div>

          )}
        </div>
      )}

      {outletState === 'archivedChats' && (
        <div className='h-full w-full bg-transparent p-2 flex gap-3 flex-col overflow-y-scroll custom-scrollbar custom-scrollbar-hover'>
          {!archivedChatsLoading ? archivedChats.length > 0 ? [...archivedChats].reverse().map((friend) => (
            <div
              onClick={() => navigate(`/home/chat/${friend?._id}`)}
              key={friend._id}
              onMouseEnter={() => handleMouseEnter(friend.fullname)}
              onMouseLeave={handleMouseLeave}
              className={`h-12 w-full bg-white/30 rounded-md flex gap-1 cursor-pointer relative hover:bg-white/100 transition-all duration-150 ease-in-out`}
            >
              <div className='h-full w-[30%] flex justify-center items-center'>
                <div className='h-10 w-10 rounded-full bg-purple-900 cursor-pointer bg-cover overflow-hidden'>
                  <img src={friend?.avatar} alt="" />
                </div>
              </div>
              <div className='w-full h-full flex flex-col items-start justify-center'>
                <h1 className='text-[13.5px] font-semibold'>{friend.fullname}</h1>
                <div className='text-[12px] font-light flex gap-1 items-center'>
                  <span><CheckCheck size={15} /></span>
                  <span className="truncate max-w-[150px] overflow-hidden whitespace-nowrap text-gray-600">
                    {latestMessages[friend._id] || friend?.lastMessage?.content || 'Type your first message👋'}
                  </span>
                </div>
              </div>
              <div className='absolute bottom-1 right-2'>
                <span className='text-[12px] font-light text-gray-500'>
                  {friend?.lastMessage?.createdAt ? new Date(friend.lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                </span>
              </div>
              {tooltip === friend.fullname && (
                <div
                  onClick={(e) => handleChatOptionClick(friend._id, e)}
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
                  <div className='h-22 my-2 w-40 bg-gray-300/90 rounded-md flex flex-col p-2 shadow-lg'>
                    <span
                      onClick={(e) => unArchiveChat(friend.lastMessage?.chat, e)}
                      className='text-sm transition-all duration-150 ease-in bg-purple-200/10 hover:bg-purple-400/10 py-2 flex gap-1 items-center px-2 pt-1'>
                      <Archive className={`${unArchivingChat ? 'animate-bounce' : ''}`} size={15} /> {unArchivingChat ? 'Unarchiving...' : 'Unarchive Chat'}
                    </span>
                    <div className='w-full flex justify-center'><span className='w-[95%] border-b-2 my-1 border-b-blue-900'></span></div>
                    <span className='bg-purple-200/10 hover:bg-purple-400/10 transition-all duration-150 ease-in py-2 text-sm flex gap-1 items-center px-2 pt-1'><Trash size={15} /> Delete Chat</span>
                  </div>
                </div>
              )}
            </div>
          )) : <p className="text-center text-sm text-gray-500">No archived chats found.</p>
          : (
            <div className='h-full w-full bg-transparent p-2 flex gap-3 flex-col overflow-y-scroll custom-scrollbar custom-scrollbar-hover'>
              {[...Array(2)].map((_, index) => (
                <div
                  key={index}
                  className='h-12 w-full bg-white/30 rounded-md flex gap-1 cursor-pointer relative animate-pulse'
                >
                  <div className='h-full w-[30%] flex justify-center items-center'>
                    <div className='h-10 w-10 rounded-full bg-gray-400'></div>
                  </div>

                  <div className='w-full h-full flex flex-col items-start justify-center gap-[2px]'>
                    <div className='h-3 w-[60%] bg-gray-400 rounded'></div>
                    <div className='h-2 w-[80%] bg-gray-300 rounded'></div>
                  </div>

                  <div className='absolute bottom-1 right-2'>
                    <div className='h-2 w-10 bg-gray-300 rounded'></div>
                  </div>

                  <div className='absolute top-1 right-2'>
                    <div className='h-6 w-6 bg-gray-300 rounded-full'></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

       <div className='w-full sm:hidden flex justify-center'>
        <div className='border-b-2 border-slate-400 w-[90%]'></div>
      </div>

    </div>
  )
}

export default Sidebar