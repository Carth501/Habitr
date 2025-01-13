import express from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import initializeDb from '../db/init';

const router = express.Router();

router.get('/', async (req, res) => {
  const raw_token = req.cookies.token;
  const token = jwt.verify(raw_token, 'MY_SUPER_SECRET') as JwtPayload;
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  const user_id = token.uid;
  const db = await initializeDb();
  const habits = await db.all(`
    SELECT h.*, MAX(hd.date_time) as last_done, COUNT(hd.id) as entryCount
    FROM habits h
    LEFT JOIN habit_dates hd ON h.id = hd.habit_id
    WHERE h.deleted = false AND h.user_id = ?
    GROUP BY h.id
  `, [user_id]);
  res.json(habits);
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const db = await initializeDb();
  const habit = await db.get(`
    SELECT h.*, MAX(hd.date_time) as last_done, COUNT(hd.id) as entryCount
    FROM habits h
    LEFT JOIN habit_dates hd ON h.id = hd.habit_id
    WHERE h.id = ? AND h.deleted = false
    GROUP BY h.id
  `, [id]);

  if (!habit) {
    return res.status(404).json({ message: 'Habit not found.' });
  }

  res.json(habit);
});

router.post('/', async (req, res) => {
  const { title, description, progress, frequency, suspended, last_done } = req.body;
  const created = new Date().toISOString();
  const db = await initializeDb();
  await db.run(
    'INSERT INTO habits (title, description, progress, frequency, created, suspended, last_done, deleted) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [title, description, progress, frequency, created, suspended, last_done, false]
  );
  res.status(201).json({ message: 'Habit created successfully.' });
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description, progress, frequency, suspended, last_done } = req.body;
  const db = await initializeDb();
  await db.run(
    'UPDATE habits SET title = ?, description = ?, progress = ?, frequency = ?, suspended = ?, last_done = ? WHERE id = ?',
    [title, description, progress, frequency, suspended, last_done, id]
  );
  res.json({ message: 'Habit updated successfully.' });
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const db = await initializeDb();
  await db.run('UPDATE habits SET deleted = ? WHERE id = ?', [true, id]);
  res.json({ message: 'Habit deleted successfully.' });
});

export default router;