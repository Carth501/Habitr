import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/use-toast';
import {
	addHabit,
	checkSession,
	deleteHabit,
	fetchHabits,
	logoutUser,
	markHabitDone,
} from '@/services/habit.proxy';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import './App.css';
import HabitTable from './components/HabitTable';
import Login from './components/Login';
import { Button } from './components/ui/button';
import { Switch } from './components/ui/switch';
import useDataStore, { Habit } from './data.store';
import useUiSettingsStore from './ui-settings.store';

export type Frequency = 'Daily' | 'Weekly';

function App() {
	const { darkMode, toggleDarkMode } = useUiSettingsStore();
	if (darkMode) {
		document.documentElement.classList.add('dark');
	} else {
		document.documentElement.classList.remove('dark');
	}
	const { toast } = useToast();
	const { user, setUser, habits, setHabits, rememberMe, setRememberMe } = useDataStore();
	const [newHabit, setNewHabit] = useState<Habit>({
		id: 0,
		title: '',
		description: '',
		progress: 0,
		frequency: 'Daily',
		created: '',
	});

	useEffect(() => {
		checkUserSession();
	}, []);

	const checkUserSession = async () => {
		const sessionCookie = Cookies.get('session');
		if (sessionCookie) {
			const result = await checkSession(sessionCookie);
			if (result.valid) {
				setUser(result.username);
				loadHabits();
			} else {
				Cookies.remove('session');
			}
		}
	};

	const loginUser = async (username: string) => {
		setUser(username);
		loadHabits();
	};

	const logout = async () => {
		const sessionCookie = Cookies.get('session');
		if (sessionCookie) {
			await logoutUser(sessionCookie);
		}
		setUser('');
		setHabits([]);
	};

	const loadHabits = async () => {
		const data = await fetchHabits();
		const habitsWithCompletion = data.map(calculateCompletionPercentage);
		setHabits(habitsWithCompletion);
	};

	const calculateCompletionPercentage = (habit: Habit): Habit => {
		const createdDate = new Date(habit.created);
		const now = new Date();
		const daysSinceCreated = Math.floor(
			(now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24),
		);
		const divisor = habit.frequency === 'Daily' ? daysSinceCreated : daysSinceCreated / 7;
		const progress = habit.entryCount
			? Math.min((habit.entryCount / (divisor + 1)) * 100, 100)
			: 0;
		return { ...habit, progress };
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
		const { name, value } = e.target;
		setNewHabit({ ...newHabit, [name]: value });
	};

	const handleFreqChange = (value: Frequency) => {
		setNewHabit({ ...newHabit, frequency: value });
	};

	const addNewHabit = async () => {
		await addHabit(newHabit);
		toast({
			title: newHabit.title,
			description: newHabit.description,
		});
		loadHabits();
		setNewHabit({
			id: 0,
			title: '',
			description: '',
			progress: 0,
			frequency: 'Daily',
			created: '',
		});
	};

	const toggleSuspended = (id: number) => {
		const updatedHabits = habits.map((habit) => {
			if (habit.id === id) {
				const updatedHabit = calculateCompletionPercentage({
					...habit,
					suspended: !habit.suspended,
				});
				return updatedHabit;
			}
			return habit;
		});
		setHabits(updatedHabits);
	};

	const removeHabit = async (id: number) => {
		await deleteHabit(id);
		loadHabits();
	};

	const markHabitAsDone = async (id: number) => {
		const updatedHabit = await markHabitDone(id);
		const updatedHabits = habits.map((habit) =>
			habit.id === id ? calculateCompletionPercentage(updatedHabit) : habit,
		);
		setHabits(updatedHabits);
	};

	const isHabitDue = (habit: Habit) => {
		if (!habit.last_done) return true;
		const last_done = new Date(habit.last_done);
		const now = new Date();
		switch (habit.frequency) {
			case 'Daily':
				return now.getDate() !== last_done.getDate();
			case 'Weekly':
				return now.getTime() - last_done.getTime() >= 604800000;
			default:
				return false;
		}
	};

	return (
		<div className={darkMode ? 'dark' : ''}>
			<div className="flex justify-between items-center">
				<Button onClick={() => logout()} disabled={!user}>
					Logout
				</Button>
				<div className="flex items-center">
					<Switch checked={darkMode} onCheckedChange={toggleDarkMode} />
					Dark Mode
				</div>
			</div>
			<h1>Habitr</h1>
			{!user && (
				<Login
					onLogin={loginUser}
					onMessage={toast}
					rememberMe={rememberMe}
					setRememberMe={setRememberMe}
				/>
			)}
			{user && (
				<HabitTable
					habits={habits}
					newHabit={newHabit}
					handleInputChange={handleInputChange}
					handleFreqChange={handleFreqChange}
					addHabit={addNewHabit}
					toggleSuspended={toggleSuspended}
					deleteHabit={removeHabit}
					markHabitDone={markHabitAsDone}
					isHabitDue={isHabitDue}
				/>
			)}
			<Toaster />
		</div>
	);
}

export default App;
