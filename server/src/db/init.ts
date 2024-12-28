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
      hour TEXT
    )
  `);

  return db;
};

export default initializeDb;