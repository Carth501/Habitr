import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from 'react';
import './App.css';
import DarkModeToggle from './components/DarkModeToggle';
import HabitTable from './components/HabitTable';

export type Frequency = 'Daily' | 'Weekly';

export interface Habit {
  id: number;
  title: string;
  description: string;
  progress: number;
  frequency: Frequency;
  created: string;
  suspended?: boolean;
  lastDone?: string;
  entryCount?: number; // Add entryCount to the Habit interface
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
  const { toast } = useToast()

  useEffect(() => {
    fetchHabits();
  }, []);

  const fetchHabits = async () => {
    const response = await fetch('http://localhost:4000/habits');
    const data = await response.json();
    const habitsWithCompletion = data.map((habit: Habit) => {
      const createdDate = new Date(habit.created);
      const now = new Date();
      const daysSinceCreated = Math.floor((now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24));
      let progress = 0;
      if(habit.frequency === 'Daily'){
        progress = habit.entryCount ? Math.min((habit.entryCount / (daysSinceCreated + 1)) * 100, 100) : 0;
      } else {
        progress = habit.entryCount ? Math.min((habit.entryCount / (daysSinceCreated / 7 + 1)) * 100, 100) : 0;
      }
      return { ...habit, progress };
    });
    setHabits(habitsWithCompletion);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewHabit({ ...newHabit, [name]: value });
  };

  const handleFreqChange = (value: Frequency) => {
    setNewHabit({ ...newHabit, frequency: value });
  };

  const addHabit = async () => {
    await fetch('http://localhost:4000/habits', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
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

  const updateHabit = async (id: number, updatedHabit: Habit) => {
    await fetch(`http://localhost:4000/habits/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedHabit),
    });
    fetchHabits();
  };

  const toggleSuspended = (id: number) => {
    const updatedHabits = habits.map((habit) => {
      if (habit.id === id) {
        updateHabit(habit.id, { ...habit, suspended: !habit.suspended });
      }
      return habit;
    });
    setHabits(updatedHabits);
  };

  const deleteHabit = async (id: number) => {
    await fetch(`http://localhost:4000/habits/${id}`, {
      method: 'DELETE',
    });
    fetchHabits();
  };

  const markHabitDone = async (id: number) => {
    const now = new Date();
    await fetch(`http://localhost:4000/habit-dates`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ habit_id: id, date_time: now.toISOString() }),
    });

    const response = await fetch(`http://localhost:4000/habits/${id}`);
    const updatedHabit = await response.json();

    const updatedHabits = habits.map((habit) =>
      habit.id === id ? updatedHabit : habit
    );
    setHabits(updatedHabits);
  };

  const isHabitDue = (habit: Habit) => {
    if (!habit.lastDone) return true;
    const lastDone = new Date(habit.lastDone);
    const now = new Date();
    switch (habit.frequency) {
      case 'Daily':
        return now.getDate() !== lastDone.getDate();
      case 'Weekly':
        return now.getTime() - lastDone.getTime() >= 604800000;
      default:
        return false;
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }

  return (
    <>
      <DarkModeToggle darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <h1>Habitr</h1>
      <HabitTable
        habits={habits}
        newHabit={newHabit}
        handleInputChange={handleInputChange}
        handleFreqChange={handleFreqChange}
        addHabit={addHabit}
        toggleSuspended={toggleSuspended}
        deleteHabit={deleteHabit}
        markHabitDone={markHabitDone}
        isHabitDue={isHabitDue}
      />
      <Toaster />
    </>
  );
}

export default App;
