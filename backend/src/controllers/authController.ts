import { Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { eq } from 'drizzle-orm';
import { db } from '../../db/index.js';
import { users } from '../../db/schema.js';
import { AuthRequest } from '../middleware/auth.js';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key';

function generateToken(userId: number): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
}

export async function register(req: AuthRequest, res: Response) {
  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    res.status(400).json({ error: 'All fields required' });
    return;
  }

  const existing = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .get();

  if (existing) {
    res.status(400).json({ error: 'Email already exists' });
    return;
  }

  const password_hash = await bcrypt.hash(password, 10);
  const result = await db
    .insert(users)
    .values({ email, password_hash, name })
    .returning()
    .get();

  const token = generateToken(result.id);
  res.status(201).json({
    token,
    user: { id: result.id, email: result.email, name: result.name },
  });
}

export async function login(req: AuthRequest, res: Response) {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(401).json({ error: 'Invalid credentials' });
    return;
  }

  const user = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .get();

  if (!user) {
    res.status(401).json({ error: 'Invalid credentials' });
    return;
  }

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    res.status(401).json({ error: 'Invalid credentials' });
    return;
  }

  const token = generateToken(user.id);
  res.json({
    token,
    user: { id: user.id, email: user.email, name: user.name },
  });
}

export async function getMe(req: AuthRequest, res: Response) {
  const user = await db
    .select()
    .from(users)
    .where(eq(users.id, req.userId!))
    .get();

  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }

  res.json({
    user: { id: user.id, email: user.email, name: user.name },
  });
}
