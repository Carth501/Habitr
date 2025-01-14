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
      created TEXT,
      suspended BOOLEAN DEFAULT FALSE,
      deleted BOOLEAN DEFAULT FALSE,
      last_done TEXT,
      user_id INTEGER NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS habit_dates (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      habit_id INTEGER NOT NULL,
      date_time TEXT NOT NULL,
      deleted BOOLEAN DEFAULT FALSE,
      FOREIGN KEY (habit_id) REFERENCES habits(id) ON DELETE CASCADE
    )
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      photo TEXT
    )
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY NOT NULL,
      user_id INTEGER NOT NULL,
      expiry TEXT NOT NULL,
      ended BOOLEAN DEFAULT FALSE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  return db;
};

export default initializeDb;