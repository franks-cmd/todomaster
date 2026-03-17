import { Response } from 'express';
import { eq, and } from 'drizzle-orm';
import { db } from '../../db/index.js';
import { categories } from '../../db/schema.js';
import { AuthRequest } from '../middleware/auth.js';

export async function getCategories(req: AuthRequest, res: Response) {
  const userId = req.userId!;

  const result = await db
    .select()
    .from(categories)
    .where(eq(categories.user_id, userId))
    .all();

  res.json({ categories: result });
}

export async function createCategory(req: AuthRequest, res: Response) {
  const userId = req.userId!;
  const { name, color } = req.body;

  if (!name) {
    res.status(400).json({ error: 'Name is required' });
    return;
  }

  const category = await db
    .insert(categories)
    .values({
      name,
      color: color || '#6366f1',
      user_id: userId,
    })
    .returning()
    .get();

  res.status(201).json({ category });
}

export async function deleteCategory(req: AuthRequest, res: Response) {
  const userId = req.userId!;
  const categoryId = Number(req.params.id);

  const existing = await db
    .select()
    .from(categories)
    .where(and(eq(categories.id, categoryId), eq(categories.user_id, userId)))
    .get();

  if (!existing) {
    res.status(404).json({ error: 'Category not found' });
    return;
  }

  await db.delete(categories).where(eq(categories.id, categoryId)).run();
  res.json({ message: 'Category deleted' });
}
