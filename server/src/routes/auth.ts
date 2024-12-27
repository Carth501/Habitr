import bcrypt from 'bcrypt';
import { Request, RequestHandler, Response, Router } from "express";
import jwt from 'jsonwebtoken';

interface Users { [key: string]: { passwordHash: string; photo?: string }};

export const users: Users = {};
const router = Router();


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

  // Compare password
  const match = await bcrypt.compare(password.trim(), userRecord.passwordHash);
  if (!match) {
    return res.status(401).json({ message: 'Invalid credentials.' });
  }

  // Create token
  // For a real app, store a SECRET in environment variables
  const token = jwt.sign({ name: name.trim() }, 'MY_SUPER_SECRET', { expiresIn: '1h' });
  return res.json({ token });
};

router.post('/login', loginHandler);

export default router;