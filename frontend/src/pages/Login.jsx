import React from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios';
import { User, LockKeyhole, CircleDashed,MoveRight,EyeClosed } from 'lucide-react'
import BolumLogo from '../assets/Bolum-Logo.png'
import LineFallingImage from '../assets/line-falling.png'

function Login() {
  const navigate = useNavigate()
  const [errMessage, setErrorMessage] = React.useState(null)
  const [isLogging, setIsLogging] = React.useState(false)
  const [isUserNameTyping, setIsUserNameTyping] = React.useState(false)
  const [isPasswordTyping, setIsPasswordTyping] = React.useState(false)
  const [isPasswordVisible, setIsPasswordVisible] = React.useState(false)
  const [isPasswordTyped, setIsPasswordTyped] = React.useState(false)



  const [formData, setFormData] = React.useState({
    username: '',
    password: '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target

    if (name === 'username') {
      setIsUserNameTyping(true)
      setIsPasswordTyping(false)
      setTimeout(() => setIsUserNameTyping(false), 1500)
    }

    if (name === 'password') {
      setIsPasswordTyping(true)
      setIsUserNameTyping(false)
      setTimeout(() => setIsPasswordTyping(false), 1500)
    }

    if( name === 'password' && value.length > 0) {
      setIsPasswordTyped(true)
    }

    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.username) {
      setErrorMessage('Username or Email is required')
      setTimeout(() => setErrorMessage(null), 3000)
      return
    }
    if (!formData.password) {
      setErrorMessage('Password is required')
      setTimeout(() => setErrorMessage(null), 3000)
      return
    }

    await loginUser().then((message) => {
      if (!message) return

      setTimeout(() => {
        setErrorMessage(null)
      }, 3500)
    })
  }

  const loginUser = async () => {
    const dataToSend = {
      username: formData.username,
      email: formData.username.toLowerCase(), // for email login
      password: formData.password,
    }

    try {
      setIsLogging(true)
      const response = await axios.post(
        'https://chatapp-bolum-backend.onrender.com/api/v1/user/login-user',
        dataToSend,
        {
          withCredentials: true,
          headers: { 'Content-Type': 'application/json' },
        }
      )

      console.log(response)
      navigate('/home')
      return null
    } catch (error) {
      setIsLogging(false)
      const message = error.response?.data?.message || 'Login failed'
      setErrorMessage(message)
      console.error(error)
      return message
    }
  }

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-r from-white via-purple-100 to-blue-100">
      <div className="relative sm:flex hidden w-[35vw] border-purple-500 min-w-96 p-6 h-[80vh] min-h-96 bg-white/30 border shadow-2xl flex-col items-center border-none">
        <h1 className="text-2xl text-left w-full font-bold text-black/70 mb-2 font-exo2">Welcome to <span className='text-purple-700 text-4xl'>Bolum</span></h1>
        <img src={BolumLogo} alt="Bolum Logo" className="w-[90%] mb-4" />

        <img src={LineFallingImage} alt="Line Falling" width={100} className="w-[100%] top-5 absolute" />

      </div>

      <div className="w-96 h-[80vh] min-h-96 p-6 bg-white/30 border border-none shadow-2xl flex flex-col items-center">
        <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit}>
          <h1 className="text-3xl text-left font-bold text-purple-700 mb-2 font-exo2">Login</h1>

          <div className="flex items-center gap-2 w-full relative">
            <User size={18} className={`absolute left-1 text-purple-800 ${isUserNameTyping ? 'animate-bounce' : ''}`} />
            <input
              type="text"
              name="username"
              placeholder="Username or Email"
              className="py-3 px-6 w-full rounded border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={formData.username}
              onChange={handleChange}
            />
          </div>

          <div className="flex items-center gap-2 w-full relative">
            <LockKeyhole size={18} className={`absolute left-1 text-purple-800 ${isPasswordTyping ? 'animate-bounce' : ''}`} />
            <input
              type={isPasswordVisible ? 'text' : 'password'}
              name="password"
              placeholder="Password"
              className="w-full py-3 px-6 rounded border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={formData.password}
              onChange={handleChange}
            />
            <EyeClosed onClick={() => setIsPasswordVisible(prev => !prev)} size={18} className='absolute right-3 text-purple-800 cursor-pointer'  />
          </div>

          <div className="flex items-center gap-2">
            <input type="checkbox" id="rememberMe" className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded" />
            <label htmlFor="rememberMe" className="text-[13px] text-gray-600">Remember Me</label>
            <Link to="/user/forgot-password" className="text-purple-600 hover:underline ml-auto text-[13px]">Forgot Password?</Link>
          </div>

          {errMessage && <span className="text-red-600 text-center">{errMessage}</span>}

          <button
            type="submit"
            className="p-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold rounded hover:opacity-90 flex items-center justify-center gap-2 hover:gap-5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <CircleDashed size={24} strokeWidth={2.25} absoluteStrokeWidth className={`${isLogging ? 'animate-spin' : 'hidden'}`} />
            {isLogging ? 'Logining...' : 'Login'}
            {!isLogging && <MoveRight size={18} className="text-white" />}
          </button>
        </form>

        <p className="text-sm mt-4 text-gray-600">
          Don't have an account? <Link to="/user/register" className="text-purple-600 hover:underline">Register</Link>
        </p>
      </div>
    </div>
  )
}

export default Login
