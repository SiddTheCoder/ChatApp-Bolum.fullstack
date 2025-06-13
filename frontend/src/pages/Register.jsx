import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { User, LockKeyhole, CircleDashed, MoveRight, Mail, UserPen, EyeClosed } from 'lucide-react';
import BolumLogo from '../assets/Bolum-Logo.png';
import LineFallingImage from '../assets/line-falling.png'

function Register() {
  const navigate = useNavigate();
  const [errMessage, setErrorMessage] = useState(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isUserNameTyping, setIsUserNameTyping] = useState(false);
  const [isPassTyping, setIsPassTyping] = useState(false);
  const [isUserFullNameTyping, setIsUserFullNameTyping] = useState(false);
  const [isUserEmailTyping, setIsUserEmailTyping] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = React.useState(false)

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    fullname: '',
    email: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'username') {
      setIsUserNameTyping(true);
      setIsPassTyping(false);
      setTimeout(() => setIsUserNameTyping(false), 1500);
    }
    if (name === 'password') {
      setIsPassTyping(true);
      setIsUserNameTyping(false);
      setTimeout(() => setIsPassTyping(false), 1500);
    }
    if (name === 'fullname') {
      setIsPassTyping(false);
      setIsUserNameTyping(false);
      setIsUserFullNameTyping(true);
      setIsUserEmailTyping(false);
      setTimeout(() => setIsUserFullNameTyping(false), 1500);
    }
    if (name === 'email') {
      setIsPassTyping(false);
      setIsUserNameTyping(false);
      setIsUserEmailTyping(true);
      setIsUserFullNameTyping(false);
      setTimeout(() => setIsUserEmailTyping(false), 1500);
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegisterForm = (e) => {
    e.preventDefault();
    if (!formData.username || !formData.fullname || !formData.email || !formData.password) {
      setErrorMessage('All fields are required');
      setTimeout(() => setErrorMessage(null), 3000);
      return;
    }
    registerUserToDB();
  };

  const registerUserToDB = async () => {
    try {
      setIsRegistering(true);
      const response = await axios.post(
        'https://chatapp-bolum-backend.onrender.com/api/v1/user/register-user',
        formData,
        {
          withCredentials: true,
          headers: { 'Content-Type': 'application/json' },
        }
      );
      navigate('/home');
    } catch (error) {
      console.error(error);
      setIsRegistering(false);

      if (error.message === 'Network Error') {
        setErrorMessage('Network error: Check your internet connection.');
      } else if (error.code === 'ECONNABORTED') {
        setErrorMessage('Request timed out. Try again.');
      } else {
        setErrorMessage(error.response?.data?.message || 'Something went wrong!');
      }

      setTimeout(() => setErrorMessage(null), 3000);
    }
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-r from-white via-purple-100 to-blue-100">
       <div className="relative sm:flex hidden w-[35vw] border-purple-500 min-w-96 p-6 h-[80vh] min-h-96 bg-white/30 border shadow-2xl flex-col items-center border-none">
             <h1 className="text-2xl text-left w-full font-bold text-black/70 mb-2 font-exo2">Welcome to <span className='text-purple-700 text-4xl'>Bolum</span></h1>
             <img src={BolumLogo} alt="Bolum Logo" className="w-[90%] mb-4" />
     
             <img src={LineFallingImage} alt="Line Falling" width={100} className="w-[100%] top-5 absolute" />
     
           </div>

      <div className="w-96 h-[80vh] min-h-96 p-6 bg-white/30 border border-none shadow-2xl flex flex-col items-center">
        <form onSubmit={handleRegisterForm} className="w-full flex flex-col gap-4">
          <h1 className="text-3xl text-left font-bold text-purple-700 mb-2 font-exo2">Register</h1>

          <div className="flex items-center gap-2 w-full relative">
            <User size={18} className={`absolute left-1 text-purple-800 ${isUserNameTyping ? 'animate-bounce' : ''}`} />
            <input type="text" name="username" placeholder="Username" className="py-3 px-6 w-full rounded border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500" value={formData.username} onChange={handleChange} />
          </div>

          <div className="flex items-center gap-2 w-full relative">
            <UserPen size={18} className={`absolute left-1 text-purple-800 ${isUserFullNameTyping ? 'animate-bounce' : ''}`} />
            <input type="text" name="fullname" placeholder="Full Name" className="py-3 px-6 w-full rounded border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500" value={formData.fullname} onChange={handleChange} />
          </div>

          <div className="flex items-center gap-2 w-full relative">
            <Mail  size={18} className={`absolute left-1 text-purple-800 ${isUserEmailTyping ? 'animate-bounce' : ''}`} />
            <input type="email" name="email" placeholder="Email" className="py-3 px-6 w-full rounded border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500" value={formData.email} onChange={handleChange} />
          </div>
          

          <div className="flex items-center gap-2 w-full relative">
            <LockKeyhole size={18} className={`absolute left-1 text-purple-800 ${isPassTyping ? 'animate-bounce' : ''}`} />
            <input 
            type={isPasswordVisible ? 'text' : 'password'} name="password"
             placeholder="Password" 
             className="py-3 px-6 w-full rounded border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500" 
             value={formData.password} 
             onChange={handleChange} 
             />

             <EyeClosed onClick={() => setIsPasswordVisible(prev => !prev)} size={18} className='absolute right-3 text-purple-800 cursor-pointer'  />
          </div>

          {errMessage && <span className="text-red-600 text-center">{errMessage}</span>}

          <button
            type="submit"
            className="p-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold rounded hover:opacity-90 flex items-center justify-center gap-2 hover:gap-5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <CircleDashed size={24} strokeWidth={2.25} absoluteStrokeWidth className={`${isRegistering ? 'animate-spin' : 'hidden'}`} />
            {isRegistering ? 'Registering...' : 'Register'}
            {!isRegistering && <MoveRight size={18} className="text-white" />}
          </button>
        </form>

        <p className="text-sm mt-4 text-gray-600">
          Already have an account? <Link to="/user/login" className="text-purple-600 hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;