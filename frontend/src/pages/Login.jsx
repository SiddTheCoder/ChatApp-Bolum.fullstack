import React from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios';

function Login() {
  const navigate = useNavigate()

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

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
    // Add your login logic here (e.g., API call)
    loginUser()
  }

  const loginUser = async() => {
    try {
      const response = await axios.post('/api/v1/user/login-user', formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      })
      console.log('User logged in successfully', response)
      navigate('/home')
    } catch (error) {
      console.log('Error occured while logging in the user', error.response?.data)
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
            className="bg-white/50 backdrop-blur-sm border-2 border-gray-200 rounded-md p-3 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.password}
            onChange={handleChange}
          />
          <button
            type="submit"
            className="bg-blue-500 text-white rounded-md p-3 mb-3 hover:bg-blue-600 transition duration-300"
            onClick={handleSubmit}
          >
            Login
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
