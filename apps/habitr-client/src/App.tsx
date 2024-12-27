import { useState } from 'react';
import './App.css';

interface Habit { title: string, description: string, progress: number, start: Date, end: Date };

function App() {

    const [habits, setHabits] = useState<Habit[]>([
    {
        title: 'Exercise',
        description: 'Daily morning exercise',
        progress: 50,
        start: new Date('2023-01-01'),
        end: new Date('2023-12-31'),
      },
      {
        title: 'Reading',
        description: 'Read 30 minutes every day',
        progress: 70,
        start: new Date('2023-01-01'),
        end: new Date('2023-12-31'),
      },
    ]);

    const [newHabit, setNewHabit] = useState<Habit>({
      title: '',
      description: '',
      progress: 0,
      start: new Date(),
      end: new Date(),
    })

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target
      setNewHabit({ ...newHabit, [name]: value })
    }


    const addHabit = () => {
        setHabits([...habits, newHabit])
        setNewHabit({
          title: '',
          description: '',
          progress: 0,
          start: new Date(),
          end: new Date(),
        })
      }

  return (
    <>
      <div>
        <h1> Habitr </h1>
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Progress</th>
              <th>Start Date</th>
              <th>End Date</th>
            </tr>
          </thead>
          <tbody>
            {habits.map((habit, index) => (
              <tr key={index}>
                <td>{habit.title}</td>
                <td>{habit.description}</td>
                <td>{habit.progress}%</td>
                <td>{habit.start.toDateString()}</td>
                <td>{habit.end.toDateString()}</td>
              </tr>
            ))}
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
                <input
                  type="date"
                  name="start"
                  value={newHabit.start.toISOString().split('T')[0]}
                  onChange={handleInputChange}
                />
              </td>
              <td>
                <input
                  type="date"
                  name="end"
                  value={newHabit.end.toISOString().split('T')[0]}
                  onChange={handleInputChange}
                />
              </td>
              <td>
                <button onClick={addHabit}>Add Habit</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  )
}

export default App

