import { useEffect, useState } from 'react';
import './App.css';

interface Habit {
  title: string;
  description: string;
  progress: number;
  frequency: 'Hourly' | 'Daily' | 'Weekly' | 'Monthly' | 'Yearly';
  hour?: string; // Optional hour field
}

function App() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [newHabit, setNewHabit] = useState<Habit>({
    title: '',
    description: '',
    progress: 0,
    frequency: 'Daily',
    hour: '',
  });

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
      title: '',
      description: '',
      progress: 0,
      frequency: 'Daily',
      hour: '',
    });
  };

  return (
    <>
      <div>
        <h1>Habitr</h1>
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Progress</th>
              <th>Frequency</th>
              <th>Hour</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <input
                  type="text"
                  name="title"
                  value={newHabit.title}
                  onChange={handleInputChange}
                  placeholder="Title"
                />
              </td>
              <td>
                <input
                  type="text"
                  name="description"
                  value={newHabit.description}
                  onChange={handleInputChange}
                  placeholder="Description"
                />
              </td>
              <td>
                <input
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
                  <option value="Hourly">Hourly</option>
                  <option value="Daily">Daily</option>
                  <option value="Weekly">Weekly</option>
                  <option value="Monthly">Monthly</option>
                  <option value="Yearly">Yearly</option>
                </select>
              </td>
              <td>
                <input
                  type="time"
                  name="hour"
                  value={newHabit.hour}
                  onChange={handleInputChange}
                  disabled={newHabit.frequency !== 'Daily'}
                />
              </td>
              <td>
                <button onClick={addHabit}>Add Habit</button>
              </td>
            </tr>
            {habits.map((habit, index) => (
              <tr key={index}>
                <td>{habit.title}</td>
                <td>{habit.description}</td>
                <td>{habit.progress}%</td>
                <td>{habit.frequency}</td>
                <td>{habit.frequency === 'Daily' ? habit.hour : ''}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default App;

