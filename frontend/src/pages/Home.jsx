import React from 'react'
import Header from '../components/Header'
import ShowAllUsers from '../components/ShowAllUsers'

function Home() {
  return (
    <div className='h-screen w-screen flex flex-col items-center  bg-slate-100 overflow-hidden'>
      <Header />
      <div className='w-full h-full flex'>
        <div className='min-w-[250px] w-[400px] h-full bg-purple-300'></div>

        <div className='w-full h-full flex flex-wrap overflow-y-scroll'>
          <ShowAllUsers />
        </div>
        
      </div>
      
    </div>
  )
}

export default Home
