import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useEffect, useState } from 'react';
import './App.css';

interface Habit {
  id: number;
  title: string;
  description: string;
  progress: number;
  frequency: 'Hourly' | 'Daily' | 'Weekly' | 'Monthly' | 'Yearly';
  hour?: string; // Optional hour field
  suspended?: boolean;
  lastDone?: string; // Timestamp of the last completion
}

function App() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [newHabit, setNewHabit] = useState<Habit>({
    id: 0,
    title: '',
    description: '',
    progress: 0,
    frequency: 'Daily',
    hour: '',
  });
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    fetchHabits();
  }, []);

  const fetchHabits = async () => {
    const response = await fetch('http://localhost:4000/habits');
    const data = await response.json();
    setHabits(data);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewHabit({ ...newHabit, [name]: value });
  };

  const addHabit = async () => {
    await fetch('http://localhost:4000/habits', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newHabit),
    });
    fetchHabits();
    setNewHabit({
      id: 0,
      title: '',
      description: '',
      progress: 0,
      frequency: 'Daily',
      hour: '',
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
    const updatedHabits = habits.map((habit) => {
      if (habit.id === id) {
        const now = new Date().toISOString();
        updateHabit(habit.id, { ...habit, lastDone: now });
      }
      return habit;
    });
    setHabits(updatedHabits);
  };

  const isHabitDue = (habit: Habit) => {
    if (!habit.lastDone) return true;
    const lastDone = new Date(habit.lastDone);
    const now = new Date();
    switch (habit.frequency) {
      case 'Hourly':
        return now.getTime() - lastDone.getTime() >= 3600000;
      case 'Daily':
        return now.getDate() !== lastDone.getDate();
      case 'Weekly':
        return now.getTime() - lastDone.getTime() >= 604800000;
      case 'Monthly':
        return now.getMonth() !== lastDone.getMonth();
      case 'Yearly':
        return now.getFullYear() !== lastDone.getFullYear();
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
        <div className='flex justify-end'>
            <Switch checked={darkMode} onCheckedChange={() => {toggleDarkMode()}}/> 
            Dark Mode
        </div>
        <h1>Habitr</h1>
        <table className='habits-table'>
        <thead>
            <tr>
            <th>Actions</th>
            <th>Title</th>
            <th>Description</th>
            <th>Progress</th>
            <th>Frequency</th>
            <th>Hour</th>
            </tr>
        </thead>
        <tbody>
            <tr>
            <td></td>
            <td>
                <Input
                type="text"
                name="title"
                value={newHabit.title}
                onChange={handleInputChange}
                placeholder="Title"
                />
            </td>
            <td>
                <Input
                type="text"
                name="description"
                value={newHabit.description}
                onChange={handleInputChange}
                placeholder="Description"
                />
            </td>
            <td>
                <Input
                type="number"
                name="progress"
                value={newHabit.progress}
                onChange={handleInputChange}
                placeholder="Progress"
                min="0"
                max="100"
                />
            </td>
            <td>
                <select
                name="frequency"
                value={newHabit.frequency}
                onChange={handleInputChange}
                >
                <option value="Daily">Daily</option>
                <option value="Weekly">Weekly</option>
                </select>
            </td>
            <td>
                <Input
                type="time"
                name="hour"
                value={newHabit.hour}
                onChange={handleInputChange}
                disabled={newHabit.frequency !== 'Daily'}
                />
            </td>
            <td>
                <Button onClick={addHabit}>Add Habit</Button>
            </td>
            </tr>
            {habits.map((habit) => (
            <tr key={habit.id} style={{ textDecoration: habit.suspended ? 'line-through' : 'none' }}>
                <td>
                <Button onClick={() => toggleSuspended(habit.id)}>Suspend</Button>
                <Button onClick={() => deleteHabit(habit.id)}>Delete</Button>
                <Button onClick={() => markHabitDone(habit.id)} 
                    disabled={!isHabitDue(habit)}>Mark as Done</Button>
                </td>
                <td>{habit.title}</td>
                <td className='description-cell'>{habit.description}</td>
                <td>{habit.progress}%</td>
                <td>{habit.frequency}</td>
                <td>{habit.frequency === 'Daily' ? habit.hour : ''}</td>
            </tr>
            ))}
        </tbody>
        </table>
    </>
  );
}

export default App;
