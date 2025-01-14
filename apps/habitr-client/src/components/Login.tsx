import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';

const API_URL = import.meta.env.VITE_API_URL;

const Login = ({ onLogin, onMessage }: { onLogin: (username: string) => void, onMessage: (message: { title: string, description: string }) => void }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = async () => {
    const response = await fetch(`${API_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: username, password }),
    });
    const data = await response.json();
    onMessage({ title: 'Signup', description: data.message });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: username, password }),
      credentials: 'include',
    });
    const data = await response.json();
    if (response.ok) {
      onLogin(username);
    } else {
      onMessage({ title: 'Login Failed', description: data.message });
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <div>
        <label>Username:</label>
        <Input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div>
        <label>Password:</label>
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <Button type="submit">Login</Button>
      <Button type="button" onClick={handleSignup}>Signup</Button>
    </form>
  );
};

export default Login;