import { Router } from 'express';
import initializeDb from '../db/init';

const router = Router();

router.get('/', async (req, res) => {
  const db = await initializeDb();
  const habits = await db.all(`
    SELECT h.*, MAX(hd.date_time) as lastDone
    FROM habits h
    LEFT JOIN habit_dates hd ON h.id = hd.habit_id
    GROUP BY h.id
  `);
  res.json(habits);
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const db = await initializeDb();
  const habit = await db.get(`
    SELECT h.*, MAX(hd.date_time) as lastDone
    FROM habits h
    LEFT JOIN habit_dates hd ON h.id = hd.habit_id
    WHERE h.id = ?
    GROUP BY h.id
  `, [id]);

  if (!habit) {
    return res.status(404).json({ message: 'Habit not found.' });
  }

  res.json(habit);
});

router.post('/', async (req, res) => {
  const { title, description, progress, frequency, hour, suspended, lastDone } = req.body;
  const db = await initializeDb();
  await db.run(
    'INSERT INTO habits (title, description, progress, frequency, hour, suspended, lastDone) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [title, description, progress, frequency, hour, suspended, lastDone]
  );
  res.status(201).json({ message: 'Habit created successfully.' });
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description, progress, frequency, hour, suspended, lastDone } = req.body;
  const db = await initializeDb();
  await db.run(
    'UPDATE habits SET title = ?, description = ?, progress = ?, frequency = ?, hour = ?, suspended = ?, lastDone = ? WHERE id = ?',
    [title, description, progress, frequency, hour, suspended, lastDone, id]
  );
  res.json({ message: 'Habit updated successfully.' });
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const db = await initializeDb();
  await db.run('DELETE FROM habits WHERE id = ?', [id]);
  res.json({ message: 'Habit deleted successfully.' });
});

export default router;