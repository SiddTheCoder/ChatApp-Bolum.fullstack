import React from 'react'
import { CircleArrowLeft, School } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

function PageBacker({ className , setIsOutletActive}) {
  const navigate = useNavigate()

  const handleBackClick = () => {
    navigate(-1)
    setIsOutletActive ? setIsOutletActive(false) : null
  }
  return (
    <div className={`${className} text-xl items-center py-1 flex gap-2`}>
      <span onClick={handleBackClick}>
        <CircleArrowLeft size={23} className='text-slate-700 hover:text-slate-900 cursor-pointer hover:scale-110 transition-all duration-100 ease-in' />
      </span>
      <span onClick={() => navigate('/home')}>
        <School size={23} className='text-slate-700 hover:text-slate-900 cursor-pointer hover:scale-110 transition-all duration-100 ease-in' />
      </span>
    </div>
  )
}

export default PageBacker
