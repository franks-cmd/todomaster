import { Response } from 'express';
import { eq, and, like, asc, sql } from 'drizzle-orm';
import { db } from '../../db/index.js';
import { todos, categories } from '../../db/schema.js';
import { AuthRequest } from '../middleware/auth.js';

const todoSelectFields = {
  id: todos.id,
  title: todos.title,
  description: todos.description,
  completed: todos.completed,
  priority: todos.priority,
  due_date: todos.due_date,
  sort_order: todos.sort_order,
  category_id: todos.category_id,
  category_name: categories.name,
  category_color: categories.color,
  user_id: todos.user_id,
  created_at: todos.created_at,
  updated_at: todos.updated_at,
};

function formatTodo(row: typeof todoSelectFields extends infer T ? { [K in keyof T]: any } : never) {
  return {
    ...row,
    completed: Boolean(row.completed),
    category_name: row.category_name ?? undefined,
    category_color: row.category_color ?? undefined,
  };
}

async function getTodoWithCategory(todoId: number) {
  const row = await db
    .select(todoSelectFields)
    .from(todos)
    .leftJoin(categories, eq(todos.category_id, categories.id))
    .where(eq(todos.id, todoId))
    .get();

  return row ? formatTodo(row) : null;
}

export async function getTodos(req: AuthRequest, res: Response) {
  const userId = req.userId!;
  const { search, category, priority, completed } = req.query;

  const conditions: ReturnType<typeof eq>[] = [eq(todos.user_id, userId)];

  if (typeof search === 'string' && search) {
    conditions.push(like(todos.title, `%${search}%`));
  }
  if (typeof category === 'string' && category) {
    conditions.push(eq(todos.category_id, Number(category)));
  }
  if (typeof priority === 'string' && priority) {
    conditions.push(eq(todos.priority, priority));
  }
  if (typeof completed === 'string') {
    conditions.push(eq(todos.completed, completed === 'true' ? 1 : 0));
  }

  const rows = await db
    .select(todoSelectFields)
    .from(todos)
    .leftJoin(categories, eq(todos.category_id, categories.id))
    .where(and(...conditions))
    .orderBy(asc(todos.sort_order))
    .all();

  res.json({ todos: rows.map(formatTodo) });
}

export async function createTodo(req: AuthRequest, res: Response) {
  const userId = req.userId!;
  const { title, description, priority, due_date, category_id } = req.body;

  if (!title) {
    res.status(400).json({ error: 'Title is required' });
    return;
  }

  const maxResult = await db
    .select({
      maxOrder: sql<number>`coalesce(max(${todos.sort_order}), -1)`,
    })
    .from(todos)
    .where(eq(todos.user_id, userId))
    .get();

  const sort_order = (maxResult?.maxOrder ?? -1) + 1;

  const newTodo = await db
    .insert(todos)
    .values({
      title,
      description: description ?? '',
      priority: priority ?? 'medium',
      due_date: due_date ?? null,
      category_id: category_id ?? null,
      sort_order,
      user_id: userId,
    })
    .returning()
    .get();

  const todo = await getTodoWithCategory(newTodo.id);
  res.status(201).json({ todo });
}

export async function updateTodo(req: AuthRequest, res: Response) {
  const userId = req.userId!;
  const todoId = Number(req.params.id);

  const existing = await db
    .select()
    .from(todos)
    .where(and(eq(todos.id, todoId), eq(todos.user_id, userId)))
    .get();

  if (!existing) {
    res.status(404).json({ error: 'Todo not found' });
    return;
  }

  const { title, description, priority, due_date, category_id, completed } =
    req.body;

  const updateData: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  if (title !== undefined) updateData.title = title;
  if (description !== undefined) updateData.description = description;
  if (priority !== undefined) updateData.priority = priority;
  if (due_date !== undefined) updateData.due_date = due_date;
  if (category_id !== undefined) updateData.category_id = category_id;
  if (completed !== undefined) updateData.completed = completed ? 1 : 0;

  await db.update(todos).set(updateData).where(eq(todos.id, todoId)).run();

  const todo = await getTodoWithCategory(todoId);
  res.json({ todo });
}

export async function deleteTodo(req: AuthRequest, res: Response) {
  const userId = req.userId!;
  const todoId = Number(req.params.id);

  const existing = await db
    .select()
    .from(todos)
    .where(and(eq(todos.id, todoId), eq(todos.user_id, userId)))
    .get();

  if (!existing) {
    res.status(404).json({ error: 'Todo not found' });
    return;
  }

  await db.delete(todos).where(eq(todos.id, todoId)).run();
  res.json({ message: 'Todo deleted' });
}

export async function toggleTodo(req: AuthRequest, res: Response) {
  const userId = req.userId!;
  const todoId = Number(req.params.id);

  const existing = await db
    .select()
    .from(todos)
    .where(and(eq(todos.id, todoId), eq(todos.user_id, userId)))
    .get();

  if (!existing) {
    res.status(404).json({ error: 'Todo not found' });
    return;
  }

  await db.update(todos)
    .set({
      completed: existing.completed ? 0 : 1,
      updated_at: new Date().toISOString(),
    })
    .where(eq(todos.id, todoId))
    .run();

  const todo = await getTodoWithCategory(todoId);
  res.json({ todo });
}

export async function reorderTodos(req: AuthRequest, res: Response) {
  const userId = req.userId!;
  const { orderedIds } = req.body;

  if (!orderedIds || !Array.isArray(orderedIds)) {
    res.status(400).json({ error: 'orderedIds array required' });
    return;
  }

  for (let i = 0; i < orderedIds.length; i++) {
    await db.update(todos)
      .set({ sort_order: i })
      .where(and(eq(todos.id, orderedIds[i]), eq(todos.user_id, userId)))
      .run();
  }

  res.json({ message: 'Reorder successful' });
}
