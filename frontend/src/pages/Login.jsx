import React from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios';

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
    setFormData((prevData) => ({ ...prevData, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if ((formData.username || formData.password) === '') {
      setErrorMessage('User Credentials is required')
    } else if (formData.username === '') {
      setErrorMessage('Username or Email is Required')
    } else if (formData.password === '') {
      setErrorMessage('Password is required')
    } else {
      await loginUser().then((message) => {
        if (!message) return
        setTimeout(() => {
          if (message?.includes('Password')) setFormData((prev) => ({ ...prev, password: '' }))
          if (message?.includes('User')) setFormData((prev) => ({ ...prev, username: '' }))
          setErrorMessage(null)
        }, 3500)
      })
      return
    }
    setTimeout(() => setErrorMessage(null), 3000)
  }

  const loginUser = async () => {
    try {
      setIsLogging(true)
      const response = await axios.post('/api/v1/user/login-user', formData, {
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' }
      })
      navigate('/home')
      return null
    } catch (error) {
      setIsLogging(false)
      const message = error.response?.data?.message
      setErrorMessage(message)
      return message
    }
  }

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-r from-white via-purple-100 to-blue-100">
      <div className="w-96 p-6 bg-white border border-purple-300 rounded-lg shadow-2xl flex flex-col items-center">
        <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit}>
          <h1 className="text-3xl text-center font-bold text-purple-700 mb-2">Login</h1>
          <input type="text" name="username" placeholder="Username"
            className="p-3 rounded border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500" value={formData.username} onChange={handleChange} />
          <input type="password" name="password" placeholder="Password"
            className="p-3 rounded border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500" value={formData.password} onChange={handleChange} />
          {errMessage && <span className="text-red-600 text-center">{errMessage}</span>}
          <button type="submit" className="p-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold rounded hover:opacity-90">
            {isLogging ? 'Logining...' : 'Login'}
          </button>
        </form>
        <p className="text-sm mt-4 text-gray-600">
          Don't have an account? <Link to="/user/register" className="text-purple-600 hover:underline">Register</Link>
        </p>
      </div>
    </div>
  )
}

export default Login;