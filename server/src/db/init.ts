import { open } from 'sqlite';
import sqlite3 from 'sqlite3';

const initializeDb = async () => {
  const db = await open({
    filename: './habits.db',
    driver: sqlite3.Database
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS habits (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      progress INTEGER NOT NULL,
      frequency TEXT NOT NULL,
      hour TEXT,
      suspended BOOLEAN DEFAULT FALSE,
      lastDone TEXT
    )
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS habit_dates (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      habit_id INTEGER NOT NULL,
      date_time TEXT NOT NULL,
      FOREIGN KEY (habit_id) REFERENCES habits(id) ON DELETE CASCADE
    )
  `);

  return db;
};

export default initializeDb;