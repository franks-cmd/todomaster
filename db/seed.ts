import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });

import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { db } from './index.js';
import { users, categories, todos } from './schema.js';

async function seed() {
  console.log('Seeding database...');

  const existing = await db.select().from(users).where(eq(users.email, 'demo@example.com')).get();
  if (existing) {
    console.log('Seed data already exists, skipping.');
    return;
  }

  const password_hash = await bcrypt.hash('password123', 10);

  const result = await db
    .insert(users)
    .values({ email: 'demo@example.com', password_hash, name: 'Demo User' })
    .returning()
    .get();
  const demoUser = result;

  console.log('  ✓ Demo user created');

  const categoryData = [
    { name: 'Work', color: '#ef4444', user_id: demoUser.id },
    { name: 'Personal', color: '#6366f1', user_id: demoUser.id },
    { name: 'Shopping', color: '#10b981', user_id: demoUser.id },
  ];

  const insertedCategories = await db.insert(categories).values(categoryData).returning().all();
  console.log('  ✓ Categories created');

  const [work, personal, shopping] = insertedCategories;

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const nextWeek = new Date(today);
  nextWeek.setDate(nextWeek.getDate() + 7);

  const fmt = (d: Date) => d.toISOString().split('T')[0];

  const todoData = [
    {
      title: 'Finish project proposal',
      description: 'Draft and review the Q2 project proposal document',
      priority: 'high',
      due_date: fmt(tomorrow),
      sort_order: 0,
      category_id: work.id,
      user_id: demoUser.id,
    },
    {
      title: 'Review pull requests',
      description: 'Review and merge pending PRs on GitHub',
      priority: 'medium',
      due_date: fmt(today),
      sort_order: 1,
      category_id: work.id,
      user_id: demoUser.id,
    },
    {
      title: 'Go for a run',
      description: '5km morning jog in the park',
      priority: 'low',
      sort_order: 0,
      category_id: personal.id,
      user_id: demoUser.id,
    },
    {
      title: 'Read "Clean Code"',
      description: 'Finish chapters 5-8',
      priority: 'medium',
      due_date: fmt(nextWeek),
      sort_order: 1,
      category_id: personal.id,
      user_id: demoUser.id,
    },
    {
      title: 'Buy groceries',
      description: 'Milk, eggs, bread, vegetables, fruits',
      priority: 'high',
      due_date: fmt(today),
      sort_order: 0,
      category_id: shopping.id,
      user_id: demoUser.id,
    },
    {
      title: 'Order new headphones',
      description: 'Research and order noise-cancelling headphones',
      priority: 'low',
      due_date: fmt(nextWeek),
      sort_order: 1,
      category_id: shopping.id,
      user_id: demoUser.id,
    },
  ];

  await db.insert(todos).values(todoData).run();
  console.log('  ✓ Todos created');

  console.log('Seeding complete!');
}

seed();
