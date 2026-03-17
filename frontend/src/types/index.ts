export type Priority = 'low' | 'medium' | 'high';

export interface User {
  id: number;
  email: string;
  name: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Todo {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  priority: Priority;
  due_date: string | null;
  sort_order: number;
  category_id: number | null;
  category_name?: string;
  category_color?: string;
  user_id: number;
  created_at: string;
  updated_at: string;
}

export interface CreateTodoRequest {
  title: string;
  description?: string;
  priority?: Priority;
  due_date?: string | null;
  category_id?: number | null;
}

export interface UpdateTodoRequest {
  title?: string;
  description?: string;
  priority?: Priority;
  due_date?: string | null;
  category_id?: number | null;
  completed?: boolean;
}

export interface ReorderRequest {
  orderedIds: number[];
}

export interface Category {
  id: number;
  name: string;
  color: string;
  user_id: number;
  created_at: string;
}

export interface CreateCategoryRequest {
  name: string;
  color?: string;
}

export interface TodoFilters {
  search?: string;
  category?: number;
  priority?: Priority;
  completed?: boolean;
}
