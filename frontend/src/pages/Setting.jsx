import React, { useState } from 'react'
import ProfileSettings from './setting-pages/ProfileSettings'
import AccountSettings from './setting-pages/AccountSettings'
import { NavLink,Outlet } from 'react-router-dom'

function Setting() {
  const [isOutletActive, setIsOutletActive] = useState(false)
  return (
    <div className="flex min-h-screen">
    {/* Fixed Sidebar */}
    <aside className="w-64 bg-gray-100 p-4">
      <nav className="flex flex-col gap-2 bg-slate-300/40 h-full">
        <NavLink
            to="profile"
            onClick={() => setIsOutletActive(true)}
          className={({ isActive }) =>
            isActive ? 'text-white bg-purple-500/80 h-10 flex pl-1 items-center' : 'text-gray-700 bg-purple-300/20 hover:bg-purple-300/90 h-10 flex pl-1 items-center'
          }
        >
          Profile Settings
        </NavLink>
        <NavLink
            to="account"
            onClick={() => setIsOutletActive(true)}
          className={({ isActive }) =>
            isActive ? 'text-white bg-purple-500/80 h-10 flex pl-1 items-center' : 'text-gray-700 bg-purple-300/20 hover:bg-purple-300/90 h-10 flex pl-1 items-center'
          }
        >
          Account Settings
        </NavLink>
      </nav>
    </aside>

    {/* Main Outlet Content */}
      <main className="flex-1">
        {!isOutletActive &&
          <div className='h-full flex justify-center flex-col items-center w-full bg-slate-300/30'>
            <div>All Setting at one place</div>
            <img src={'https://ugokawaii.com/wp-content/uploads/2023/09/explanation.gif'} alt="" width={400} />
          </div>}
      <Outlet />
    </main>
  </div>
  )
}

export default Setting
