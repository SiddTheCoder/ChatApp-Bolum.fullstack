import React from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import axios from '../utils/axiosInstance';

function Register() {
  const navigate = useNavigate()

  const [formData, setFormData] = React.useState({
    username: '',
    password: '',
    fullname: '',
    email: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }))
  }

  const handleRegisterForm = (e) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
    // Add your register logic here (e.g., API call)
    registerUserToDB()
  }

  const registerUserToDB = async () => {
    try {
      const response = await axios.post('/api/v1/user/register-user', formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      })
      console.log('User registered successfully', response)
      navigate('/user/login')
    } catch (error) {
      console.log('Error occurred while registering the user', error.response?.data)
    }
  }

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600">
      <div
        className="h-auto py-5 px-5 min-w-[30vw]  bg-white/30 backdrop-blur-lg rounded-md shadow-xl bg-opacity-3zp-8 flex flex-col items-center justify-center gap-4"
      >
        <form onSubmit={handleRegisterForm} className="flex flex-col items-center w-full gap-4 bg-transparent">
          <h1 className="text-white text-2xl font-semibold my-5">Register Form</h1>
          <input
            type="text"
            name="username"
            placeholder="Username"
            className="w-full p-3 border-2 border-gray-400 rounded-md bg-transparent text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.username}
            onChange={handleChange}
          />
          <input
            type="text"
            name="fullname"
            placeholder="Full Name"
            className="w-full p-3 border-2 border-gray-400 rounded-md bg-transparent text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.fullname}
            onChange={handleChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full p-3 border-2 border-gray-400 rounded-md bg-transparent text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.email}
            onChange={handleChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full p-3 border-2 border-gray-400 rounded-md bg-transparent text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.password}
            onChange={handleChange}
          />
          <button
            type="submit"
            className="w-full p-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
          >
            Register
          </button>
        </form>
        <p className="text-center text-white mt-4">
          Already have an account?{' '}
          <Link to="/user/login" className="text-cyan-200 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Register
