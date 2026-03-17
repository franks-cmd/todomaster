import { api } from './api';
import type {
  Todo,
  CreateTodoRequest,
  UpdateTodoRequest,
  TodoFilters,
} from '../types';

export const todoService = {
  getAll(filters?: TodoFilters) {
    const params = new URLSearchParams();
    if (filters?.search) params.set('search', filters.search);
    if (filters?.category != null) params.set('category', String(filters.category));
    if (filters?.priority) params.set('priority', filters.priority);
    if (filters?.completed != null) params.set('completed', String(filters.completed));
    const qs = params.toString();
    return api.get<{ todos: Todo[] }>(`/todos${qs ? `?${qs}` : ''}`);
  },

  create(data: CreateTodoRequest) {
    return api.post<{ todo: Todo }>('/todos', data);
  },

  update(id: number, data: UpdateTodoRequest) {
    return api.put<{ todo: Todo }>(`/todos/${id}`, data);
  },

  delete(id: number) {
    return api.delete<{ message: string }>(`/todos/${id}`);
  },

  toggle(id: number) {
    return api.patch<{ todo: Todo }>(`/todos/${id}/toggle`);
  },

  reorder(orderedIds: number[]) {
    return api.put<{ message: string }>('/todos/reorder', { orderedIds });
  },
};
