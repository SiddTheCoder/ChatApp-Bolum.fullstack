import React,{useState} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios';

function Register() {
  const navigate = useNavigate()
  const [errMessage, setErrorMessage] = useState(null)
  const [isRegistering, setIsRegistering] = useState(false)

  const [formData, setFormData] = React.useState({
    username: '',
    password: '',
    fullname: '',
    email: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevData) => ({ ...prevData, [name]: value }))
  }

  const handleRegisterForm = (e) => {
    e.preventDefault()
    if ((formData.username || formData.password) === '') {
      setErrorMessage('User Credentials is required')
    } else if (formData.username === '') {
      setErrorMessage('Username or Email is Required')
    } else if (formData.fullname === '') {
      setErrorMessage('Full Name is required')
    } else if (formData.email === '') {
      setErrorMessage('Email is required')
    } else if (formData.password === '') {
      setErrorMessage('Password is required')
    } else {
      registerUserToDB()
      return
    }
    setTimeout(() => setErrorMessage(null), 3000)
  }

  const registerUserToDB = async () => {
    try {
      setIsRegistering(true)
      const response = await axios.post('https://chatapp-bolum-backend.onrender.com/api/v1/user/register-user', formData, {
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' }
      })
      navigate('/home')
    } catch (error) {
      setIsRegistering(false)
    }
  }

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-r from-white via-purple-100 to-blue-100">
      <div className="min-w-[30vw] py-6 px-6 bg-white border border-purple-300 rounded-lg shadow-2xl flex flex-col items-center">
        <form onSubmit={handleRegisterForm} className="w-full flex flex-col gap-4">
          <h1 className="text-3xl text-center font-bold text-purple-700 mb-4">Register</h1>
          <input type="text" name="username" placeholder="Username"
            className="p-3 rounded border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500" value={formData.username} onChange={handleChange} />
          <input type="text" name="fullname" placeholder="Full Name"
            className="p-3 rounded border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500" value={formData.fullname} onChange={handleChange} />
          <input type="email" name="email" placeholder="Email"
            className="p-3 rounded border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500" value={formData.email} onChange={handleChange} />
          <input type="password" name="password" placeholder="Password"
            className="p-3 rounded border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500" value={formData.password} onChange={handleChange} />
          {errMessage && <span className="text-red-600 text-center">{errMessage}</span>}
          <button type="submit" className="p-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold rounded hover:opacity-90">
            {isRegistering ? 'Registering...' : 'Register'}
          </button>
        </form>
        <p className="text-sm mt-4 text-gray-600">
          Already have an account? <Link to="/user/login" className="text-blue-600 hover:underline">Login</Link>
        </p>
      </div>
    </div>
  )
}

export default Register;