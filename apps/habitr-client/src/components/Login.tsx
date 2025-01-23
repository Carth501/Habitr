import { handleLogin, handleSignup } from '@/services/login.proxy';
import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';

const Login = ({
	onLogin,
	onMessage,
	rememberMe,
	setRememberMe,
}: {
	onLogin: (username: string) => void;
	onMessage: (message: { title: string; description: string }) => void;
	rememberMe: boolean;
	setRememberMe: (value: boolean) => void;
}) => {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');

	const handleSignupClick = async () => {
		const data = await handleSignup(username, password);
		onMessage({ title: 'Signup', description: data.message });
	};

	const handleLoginClick = async (e: React.FormEvent) => {
		e.preventDefault();
		const data = await handleLogin(username, password, rememberMe);
		if (data.ok) {
			onLogin(username);
		} else {
			onMessage({ title: 'Login', description: data.message });
		}
	};

	return (
		<form onSubmit={handleLoginClick} className="max-w-md mx-auto">
			<div>
				<label>Username:</label>
				<Input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
			</div>
			<div>
				<label>Password:</label>
				<Input
					type="password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
				/>
			</div>
			<div className="flex">
				<Button type="submit" className="m-0.5">
					Login
				</Button>
				<Button type="button" onClick={handleSignupClick} className="m-0.5">
					Signup
				</Button>
				<label className="flex text-xs m-0.5">
					<Input
						type="checkbox"
						checked={rememberMe}
						onChange={(e) => setRememberMe(e.target.checked)}
						className="mr-0.5"
					/>
					Remember me
				</label>
			</div>
		</form>
	);
};

export default Login;
