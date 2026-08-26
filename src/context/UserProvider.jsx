import { useState } from 'react'
import axios from 'axios'
import { UserContext } from './UserContext'

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001'

const getStoredUser = () => {
  const stored = sessionStorage.getItem('user')

  if (!stored) {
    return { email: '', password: '' }
  }

  try {
    return JSON.parse(stored)
  } catch {
    sessionStorage.removeItem('user')
    return { email: '', password: '' }
  }
}

export default function UserProvider({ children }) {
  const [user, setUser] = useState(getStoredUser)

  const signUp = async () => {
    await axios.post(
      `${apiUrl}/users/signup`,
      { user },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )

    setUser({ email: '', password: '' })
  }

  const signIn = async () => {
    const response = await axios.post(
      `${apiUrl}/users/signin`,
      { user },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )

    setUser(response.data)
    sessionStorage.setItem(
      'user',
      JSON.stringify(response.data),
    )
  }

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        signUp,
        signIn,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}
