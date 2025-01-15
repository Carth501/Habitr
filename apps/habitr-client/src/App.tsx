import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import './App.css';
import DarkModeToggle from './components/DarkModeToggle';
import HabitTable from './components/HabitTable';
import Login from "./components/Login";
import { Button } from "./components/ui/button";

export type Frequency = 'Daily' | 'Weekly';

const API_URL = import.meta.env.VITE_API_URL;

export interface Habit {
  id: number;
  title: string;
  description: string;
  progress: number;
  frequency: Frequency;
  created: string;
  suspended?: boolean;
  last_done?: string;
  entryCount?: number;
}

function App() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [newHabit, setNewHabit] = useState<Habit>({
    id: 0,
    title: '',
    description: '',
    progress: 0,
    frequency: 'Daily',
    created: '',
  });
  const [darkMode, setDarkMode] = useState(false);
  const { toast } = useToast();
  const [user, setUser] = useState('');

  useEffect(() => {
    checkSession();
    setDarkMode(false);
    checkDarkModeCookie();
  }, []);

  const checkSession = async () => {
    const sessionCookie = Cookies.get('session');
    if (sessionCookie) {
      const response = await fetch(`${API_URL}/auth/check-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ session: sessionCookie }),
      });
      const result = await response.json();
      if (result.valid) {
        setUser(result.username);
        fetchHabits();
      } else {
        Cookies.remove('session');
      }
    }
  };

  const loginUser = async (username: string) => {
    setUser(username);
    fetchHabits();
  };

  const logoutUser = async () => {
    setUser('');
    setHabits([]);
    await fetch(`${API_URL}/auth/logout`, {
      method: 'PUT',
    });
    Cookies.remove('session');
  };

  const fetchHabits = async () => {
    const response = await fetch(`${API_URL}/habits`, {credentials: 'include'});
    const data = await response.json();
    const habitsWithCompletion = data.map(calculateCompletionPercentage);
    setHabits(habitsWithCompletion);
  };

  const calculateCompletionPercentage = (habit: Habit): Habit => {
    const createdDate = new Date(habit.created);
    const now = new Date();
    const daysSinceCreated = Math.floor((now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24));
    const divisor = habit.frequency === 'Daily' ? daysSinceCreated : (daysSinceCreated / 7);
    const progress = habit.entryCount ? Math.min((habit.entryCount / (divisor + 1)) * 100, 100) : 0;
    return { ...habit, progress };
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewHabit({ ...newHabit, [name]: value });
  };

  const handleFreqChange = (value: Frequency) => {
    setNewHabit({ ...newHabit, frequency: value });
  };

  const addHabit = async () => {
    await fetch(`${API_URL}/habits`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ ...newHabit }),
    });
    toast({
      title: newHabit.title,
      description: newHabit.description,
    });
    fetchHabits();
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
        const updatedHabit = calculateCompletionPercentage({ ...habit, suspended: !habit.suspended });
        return updatedHabit;
      }
      return habit;
    });
    setHabits(updatedHabits);
  };

  const deleteHabit = async (id: number) => {
    await fetch(`${API_URL}/habits/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    fetchHabits();
  };

  const markHabitDone = async (id: number) => {
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
    const updatedHabit = await response.json();

    const updatedHabits = habits.map((habit) =>
      habit.id === id ? calculateCompletionPercentage(updatedHabit) : habit
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

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    document.cookie = `darkMode=${darkMode};SameSite=Lax;`;
  }

  const checkDarkModeCookie = () => {
    if (document.cookie.includes('darkMode=true')) {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }

  const displayMessage = (message: { title: string; description: string }) => {
    toast({
      title: message.title,
      description: message.description,
    });
  }

  return (
    <>
      <div className='flex justify-between items-center'>
        <Button onClick={() => logoutUser()} disabled={!user}>Logout</Button>
        <DarkModeToggle darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      </div>
      <h1>Habitr</h1>
      {!user && <Login onLogin={loginUser} onMessage={displayMessage}/>}
      {user && <HabitTable
        habits={habits}
        newHabit={newHabit}
        handleInputChange={handleInputChange}
        handleFreqChange={handleFreqChange}
        addHabit={addHabit}
        toggleSuspended={toggleSuspended}
        deleteHabit={deleteHabit}
        markHabitDone={markHabitDone}
        isHabitDue={isHabitDue}
      />}
      <Toaster />
    </>
  );
}

export default App;
