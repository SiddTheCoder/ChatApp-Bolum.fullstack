import React, { useEffect } from 'react';
import axios from 'axios';
import { Link , useNavigate } from 'react-router-dom';

function Lander() {

  const navigate = useNavigate()

  useEffect(() => {
    const checkAuth = async () => {
      const response = await axios.get('/api/v1/user/verify-user', { withCredentials: true })
    if (response.data.isAuthenticated === true) {
      navigate('/home')
    } else {
      navigate('/')
    }
    }
    checkAuth()
  }, [])

  return (
    <div
      className="h-screen w-screen bg-cover bg-center bg-no-repeat"
      
    >
      <div className="flex flex-col items-center justify-center h-full bg-black bg-opacity-50">
        <h1 className="text-4xl font-bold text-center text-gray-300">
          The <span className="text-blue-500">Best</span> Place to Build Your <span className="text-blue-500">Notes</span>
        </h1>

        <div className="flex justify-center items-center mt-10 gap-4 min-h-96 bg-slate-900 bg-opacity-70 w-[80%] mx-auto rounded-lg p-5">
          <Link to='/user/register'><button className="bg-blue-500 text-white text-2xl px-8 py-3 rounded-md cursor-pointer hover:bg-blue-600 transition-all duration-300">
            Register
          </button></Link>
          <Link to='/user/login'><button className="bg-blue-500 text-white text-2xl px-8 py-3 rounded-md cursor-pointer hover:bg-blue-600 transition-all duration-300">
            Login
          </button></Link>
        </div>

        <div className="text-center text-gray-400 text-sm mt-4">
          Note: We provide you the best control over Building Notes
        </div>
      </div>
    </div>
  );
}

export default Lander;
