import React,{useState} from 'react'
import Header from '../components/Header'
import ShowAllUsers from '../components/ShowAllUsers'
import Sidebar from '../components/Sidebar'
import ChatApp from '../components/ChatApp'
import { Outlet, useLocation  } from 'react-router-dom'; 

function Home() {
  const location = useLocation()
  const isChatPage = location.pathname.includes('/home/chat/');
  
  return (
    <div className='h-screen w-screen flex flex-col items-center  bg-slate-100 overflow-hidden '>
      <Header />
      <div className='w-full h-full flex gap-1'>
        <div className='min-w-[250px] w-[450px] h-full'>
          <Sidebar />
        </div>

        <div className='w-full h-full overflow-hidden'>
          {!isChatPage && <ShowAllUsers />}
          <Outlet />
        </div>
        
      </div>
      
    </div>
  )
}

export default Home
