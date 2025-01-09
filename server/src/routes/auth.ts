import bcrypt from 'bcrypt';
import { Request, RequestHandler, Response, Router } from "express";
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

interface Users { [key: string]: { passwordHash: string; photo?: string }};

export const users: Users = {};
const router = Router();

// Assuming you have a sessions object to store session data
const sessions: { [key: string]: { username: string } } = {};

const signupHandler: RequestHandler = async (req: Request, res: Response) => {
    const { name, password, photo } = req.body;

    if (!name?.trim() || !password.trim()) {
        return res.status(400)
    }

    if (users[name]) {
        return res.status(409).json({ message: 'User already exists.' });
    }

    const passwordHash = await bcrypt.hash(password.trim(), 10);
    users[name.trim()] = { passwordHash, photo: photo?.trim() };
    return res.status(201).json({ message: 'User created successfully.' });
};

router.post('/signup', signupHandler);

const loginHandler = async (req: Request, res: Response) => {
  const { name, password } = req.body;
  if (!name?.trim() || !password?.trim()) {
    return res.status(400).json({ message: 'Name and password are required.' });
  }
  const userRecord = users[name.trim()];
  if (!userRecord) {
    return res.status(401).json({ message: 'Invalid credentials.' });
  }

  const match = await bcrypt.compare(password.trim(), userRecord.passwordHash);
  if (!match) {
    return res.status(401).json({ message: 'Invalid credentials.' });
  }

  const sessionId = uuidv4();
  sessions[sessionId] = { username: name.trim() };

  const token = jwt.sign({ name: name.trim(), sessionId }, 'MY_SUPER_SECRET', { expiresIn: '1h' });

  // Set the token as an HTTP-only cookie
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Set to true in production
    sameSite: 'strict',
    domain: 'localhost', // Adjust this for your domain
    path: '/',
  });

  return res.json({ message: 'Login successful' });
};

router.post('/login', loginHandler);

export default router;