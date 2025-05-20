import React from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios';
// import ErrorHandler from '../components/ErrorHandler'

function Login() {
  const navigate = useNavigate()
  const [errMessage, setErrorMessage] = React.useState(null)
  const [isLogging, setIsLogging] = React.useState(false)

  const [formData, setFormData] = React.useState({
    username: '',
    password: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    // console.log('Form submitted:', formData)
    if ((formData.username || formData.password) === '') {
      setErrorMessage('User Credentials is required')
      setTimeout(() => {
        setErrorMessage(null)
      }, 3000);
    }
    else if ((formData.username) === '') {
      setErrorMessage('Username or Email is Required')
      setTimeout(() => {
        setErrorMessage(null)
      }, 3000);
    }
    else if ((formData.password) === '') {
      setErrorMessage('Password is required')
      setTimeout(() => {
        setErrorMessage(null)
      }, 3000);
    }
    else {
      // adding the logic for api call
      await loginUser().then((message) => {
        if (!message) return
        setTimeout(() => {
          console.log(message)
          if (message?.includes('Password')) {
            setFormData((prev) => ({ ...prev, password: '' }))
          }
          if (message?.includes('User')) {
            setFormData((prev) => ({ ...prev, username: '' }))
          }
          setErrorMessage(null)
        }, 3500)
      })
    }
  }

  const loginUser = async() => {
    try {
      setIsLogging(true)
      const response = await axios.post('/api/v1/user/login-user', formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      })
      // console.log('User logged in successfully', response)
      navigate('/home')
      return null
    } catch (error) {
      setIsLogging(false)
      // console.log('Error occured while logging in the user', error.response?.data)
      const message = error.response?.data?.message
      setErrorMessage(message)
      return message
    }
  }

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600">
      <div className="h-96 w-96 bg-white/30 backdrop-blur-lg rounded-md shadow-xl flex flex-col items-center justify-center gap-6 p-6">
        <form className="flex flex-col items-center justify-center w-full gap-4">
          <h1 className="text-3xl font-semibold text-white">Login</h1>
          <input
            type="text"
            name="username"
            placeholder="Username"
            className="bg-white/50 backdrop-blur-sm border-2 border-gray-200 rounded-md p-3 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.username}
            onChange={handleChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="bg-white/50 backdrop-blur-sm border-2 border-gray-200 rounded-md p-3 mb-0 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.password}
            onChange={handleChange}
          />


          <div className='h-6 w-full flex justify-center'>
            {errMessage && <span className='text-red-500 h-full'>{errMessage}</span>}
          </div>
          
          <button
            type="submit"
            className="bg-blue-500 text-white rounded-md p-3 mb-3 hover:bg-blue-600 transition duration-300 cursor-pointer"
            onClick={handleSubmit}
          >
            {isLogging ? 'Logining' : 'Login'}
          </button>
        </form>
        <p className="text-sm text-white">
          Don't have an account?{' '}
          <Link to="/user/register" className="text-blue-200 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login
