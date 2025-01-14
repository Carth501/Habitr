import bcrypt from 'bcrypt';
import { Request, RequestHandler, Response, Router } from "express";
import initializeDb from '../db/init';

const router = Router();

// Assuming you have a sessions object to store session data
const sessions: { [key: string]: { username: string } } = {};

const signupHandler: RequestHandler = async (req: Request, res: Response) => {
    const { name, password, photo } = req.body;

    if (!name?.trim() || !password.trim()) {
        return res.status(400)
    }

    
    const db = await initializeDb();
    const user = await db.get(`
        SELECT * FROM users WHERE name = ?
    `, [name]);

    if (user !== undefined) {
        return res.status(409).json({ message: 'User already exists.' });
    }

    const passwordHash = await bcrypt.hash(password.trim(), 10);
    const result = await db.run('INSERT INTO users (name, password_hash, photo) VALUES (?, ?, ?)', [name, passwordHash, photo?.trim()]);
    return res.status(201).json({ message: 'User created successfully.' });
};

router.post('/signup', signupHandler);

const loginHandler = async (req: Request, res: Response) => {
  const { name, password } = req.body;
  if (!name?.trim() || !password?.trim()) {
    return res.status(400).json({ message: 'Name and password are required.' });
  }
  const db = await initializeDb();
  const userRecord = await db.get(`
    SELECT * FROM users WHERE name = ?
  `, [name.trim()]);
  if (!userRecord) {
    return res.status(401).json({ message: 'Invalid credentials.' });
  }

  const match = await bcrypt.compare(password.trim(), userRecord.password_hash);
  if (!match) {
    return res.status(401).json({ message: 'Invalid credentials.' });
  }

  const sessionID = Math.random().toString(36).slice(2);
  const expiry = new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString();
  await db.run('INSERT INTO sessions (id, user_id, expiry) VALUES (?, ?, ?)', 
    [sessionID, userRecord.id, expiry]);

  res.cookie('session', sessionID, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    domain: 'localhost',
    path: '/',
  }); 

  return res.json({ message: 'Login successful' });
};

router.post('/login', loginHandler);

export default router;