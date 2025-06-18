import React, { useEffect, useState } from 'react'
import Setting from './setting-pages/Setting'
import { NavLink, Outlet, useLocation } from 'react-router-dom'

function SettingLayout() {
  const location = useLocation()

  const [isOutletActive, setIsOutletActive] = useState(false)

  useEffect(() => {
    const currentPath = location.pathname.split('/').pop()
    setIsOutletActive(currentPath === 'profile' || currentPath === 'account')
  }, [location])

  return (
    <div className="flex min-h-screen">
      {/* Fixed Sidebar */}
      <aside className="sm:w-64 bg-gray-100 p-4">
        <nav className="flex flex-col gap-2 bg-slate-300/40 h-full">
          <NavLink
            to="profile"
            className={({ isActive }) =>
              isActive
                ? 'text-white text-sm bg-purple-500/80 h-10 flex pl-1 items-center'
                : 'text-gray-700 text-sm  bg-purple-300/20 hover:bg-purple-300/90 h-10 flex pl-1 items-center'
            }
          >
            Profile Settings
          </NavLink>
          <NavLink
            to="account"
            className={({ isActive }) =>
              isActive
                ? 'text-white text-sm bg-purple-500/80 h-10 flex pl-1 items-center'
                : 'text text-sm gray-700 bg-purple-300/20 hover:bg-purple-300/90 h-10 flex pl-1 items-center'
            }
          >
            Account Settings
          </NavLink>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        {!isOutletActive && <Setting />}
        <Outlet />
      </main>
    </div>
  )
}

export default SettingLayout
