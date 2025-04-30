import React from 'react'
import { useParams } from 'react-router-dom'

function UserProfile() {
  const params = useParams()
  return (
    <div>
      Welcome to user Profile {params.username} <br /> <br />
      // Hey The routing is done now . Lets goo
    </div>
  )
}

export default UserProfile
