const API_URL = import.meta.env.VITE_API_URL;

export const handleSignup = async (username: string, password: string) => {
	const response = await fetch(`${API_URL}/auth/signup`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ name: username, password }),
	});
	return response.json();
};

export const handleLogin = async (username: string, password: string, rememberMe: boolean) => {
	const response = await fetch(`${API_URL}/auth/login`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ name: username, password, rememberMe }),
		credentials: 'include',
	});
	return response.json();
};
