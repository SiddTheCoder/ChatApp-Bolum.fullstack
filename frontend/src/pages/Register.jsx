import React from 'react'
import {Link} from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

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
      console.log('Error occured while registering the user', error.response?.data)
    }
  }

  return (
    <div
      className='h-screen w-screen flex flex-col items-center justify-center bg-slate-700'
    >
      <div
        className='h-96 w-2xl bg-white rounded-md shadow-lg flex flex-col items-center justify-center gap-3'
      >
        <form
          onSubmit={handleRegisterForm}
          className='flex flex-col items-center justify-center h-full w-full gap-3'>
          <h1 className=''>Register Form</h1>
          <input
            type="text"
            name='username'
            placeholder='username'
            className='border-2 border-gray-400 rounded-md p-2 mb-2'
            value={formData.username}
            onChange={handleChange}
          />
          <input
            type="text"
            name='fullname'
            placeholder='fullname'
            className='border-2 border-gray-400 rounded-md p-2 mb-2'
            value={formData.fullname}
            onChange={handleChange}
          />
          <input
            type="email"
            name='email'
            placeholder='email'
            className='border-2 border-gray-400 rounded-md p-2 mb-2'
            value={formData.email}
            onChange={handleChange}
          />
          <input
            type="password"
            name='password'
            placeholder='password'
            className='border-2 border-gray-400 rounded-md p-2 mb-2'
            value={formData.password}
            onChange={handleChange}
          />
          <button
            type='submit'
            className='bg-blue-500 text-white rounded-md p-2 mb-2 hover:bg-blue-600 transition duration-300'
          >Register</button>

        </form>
        <p className='text-center'>Already have an account? <Link to='/login' className='text-blue-500 hover:underline'>Login</Link></p>
      </div>
    </div>
  )
}

export default Register
