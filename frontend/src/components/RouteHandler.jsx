import React from 'react'
import { useNavigate } from 'react-router-dom'

// const routes = [
//     {
//       name: 'Home',
//       target : '/home'
//     },
//     {
//       name: 'Profile',
//       targte : '/:username'
//     }
//   ]

function RouteHandler({ routes = [] }) {
  const navigate = useNavigate()

  const handleRouting = (target) => {
    navigate(target)
  }

  return (
    <div className='flex gap-5'>
      
      {routes?.map((route) => (
        <span
          onClick={() => handleRouting(route.target)}
          key={route.name}
          className='bg-gradient-to-br from-white to-purple-900 px-4 py-1 text-sm rounded-md text-black cursor-pointer hover:scale-105 transition-all duration-200 ease-in-out hover:bg-gradient-to-bl'
        >
          {route.name}
        </span>
      ))}
    </div>
  )
}

export default RouteHandler
