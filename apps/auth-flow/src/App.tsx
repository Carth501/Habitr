import { useState } from 'react';
import './App.css';

const API_URL = import.meta.env.VITE_API_URL;
const VITE_CLIENT_URL = import.meta.env.VITE_CLIENT_URL;

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
    if(response.status === 200) {
        window.location.href = `${VITE_CLIENT_URL}`
    }

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