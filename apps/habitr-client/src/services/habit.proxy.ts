import { Habit } from '@/data.store';

const API_URL = import.meta.env.VITE_API_URL;

export const checkSession = async (sessionCookie: string) => {
	const response = await fetch(`${API_URL}/auth/check-session`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ session: sessionCookie }),
	});
	return response.json();
};

export const fetchHabits = async () => {
	const response = await fetch(`${API_URL}/habits`, { credentials: 'include' });
	return response.json();
};

export const addHabit = async (newHabit: Habit) => {
	if (newHabit.title === '' || newHabit.title === undefined) {
		return;
	}
	await fetch(`${API_URL}/habits`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		credentials: 'include',
		body: JSON.stringify({ ...newHabit }),
	});
};

export const deleteHabit = async (id: number) => {
	await fetch(`${API_URL}/habits/${id}`, {
		method: 'DELETE',
		credentials: 'include',
	});
};

export const markHabitDone = async (id: number) => {
	const now = new Date();
	await fetch(`${API_URL}/habit-dates`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ habit_id: id, date_time: now.toISOString() }),
		credentials: 'include',
	});

	const response = await fetch(`${API_URL}/habits/${id}`);
	return response.json();
};

export const logoutUser = async (sessionCookie: string) => {
	await fetch(`${API_URL}/auth/logout`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ session: sessionCookie }),
	});
};
