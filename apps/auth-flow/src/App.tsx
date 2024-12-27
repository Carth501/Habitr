import { useState } from 'react'
import './App.css'

const API_URL = process.env.REACT_APP_API_URL

function App() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  const handleSignup = async () => {
    const response = await fetch(`${API_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: username, password }),
    })
    const data = await response.json()
    setMessage(data.message)
  }

  const handleLogin = async () => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: username, password }),
    })
    const data = await response.json()
    setMessage(data.message)
  }

  return (
    <>
      <div className="login-container">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="username-input"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="password-input"
        />
        <div>
            <button onClick={handleSignup} className="signup-button">Sign Up</button>
            <button onClick={handleLogin} className="login-button">Log In</button>
        </div>
        <p>{message}</p>
      </div>
    </>
  )
}

export default App