import { Router } from 'express';
import { open } from 'sqlite';
import sqlite3 from 'sqlite3';

const router = Router();

const getDbConnection = async () => {
  return open({
    filename: './habits.db',
    driver: sqlite3.Database
  });
};

router.get('/', async (req, res) => {
  const db = await getDbConnection();
  const habitDates = await db.all('SELECT * FROM habit_dates WHERE habit_dates.deleted = false');
  res.json(habitDates);
});

router.post('/', async (req, res) => {
  const { habit_id, date_time } = req.body;
  const db = await getDbConnection();
  const result = await db.run('INSERT INTO habit_dates (habit_id, date_time, deleted) VALUES (?, ?, ?)', [habit_id, date_time, false]);
  res.json({ id: result.lastID });
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const db = await getDbConnection();
  await db.run('UPDATE habit_dates SET deleted = ? WHERE id = ?', [true, id]);
  res.sendStatus(204);
});

export default router;