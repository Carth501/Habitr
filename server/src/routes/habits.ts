import { Router } from 'express';
import initializeDb from '../db/init';

const router = Router();

router.get('/', async (req, res) => {
  const db = await initializeDb();
  const habits = await db.all('SELECT * FROM habits');
  res.json(habits);
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