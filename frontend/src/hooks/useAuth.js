import axios from 'axios';
import { useState,useEffect } from 'react'

const getCurrentUser = async () => {
    try {
      const response = await axios.get('/api/v1/user/get-current-user', {
        withCredentials : true
      })
      return response.data.data
    } catch (err) {
      console.log('Error occured while getting the current user inside auth hook',err.response?.data)
    }
}
  
export const useAuth = () => {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await getCurrentUser()
      setCurrentUser(userData)
      setLoading(false)
    }
    fetchUser()
  }, [])

  return {currentUser,loading}
}