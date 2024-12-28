import { NextFunction, Request, Response, Router } from 'express';
import jwt from 'jsonwebtoken';

// Reuse the in-memory store from auth.ts for demonstration
import { users } from './auth'; // Adjust import if needed

const router = Router();

function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ message: 'No token provided.' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Invalid token format.' });
  }

  jwt.verify(token, 'MY_SUPER_SECRET', (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Token is invalid or expired.' });
    }
    (req as any).user = user;
    next();
  });
}

router.get('/', authenticateToken, (req, res) => {
  const user = (req as any).user;
  if (!users[user.name]) {
    return res.status(404).json({ message: 'User not found.' });
  }
  return res.json({
    name: user.name,
    photo: users[user.name].photo
  });
});

router.put('/', authenticateToken, (req, res) => {
  const user = (req as any).user;
  const { name, photo } = req.body;

  if (!users[user.name]) {
    return res.status(404).json({ message: 'User not found.' });
  }

  if (name?.trim()) {
    // If you change the username, you'd need to handle collisions in real usage
    const userData = users[user.name];
    delete users[user.name];
    users[name.trim()] = userData;
    user.name = name.trim();
  }

  if (photo?.trim()) {
    users[user.name].photo = photo.trim();
  }

  return res.json({ message: 'Profile updated.', name: user.name, photo: users[user.name].photo });
});

export default router;
