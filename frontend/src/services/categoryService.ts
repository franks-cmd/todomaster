import { api } from './api';
import type { Category, CreateCategoryRequest } from '../types';

export const categoryService = {
  getAll() {
    return api.get<{ categories: Category[] }>('/categories');
  },

  create(data: CreateCategoryRequest) {
    return api.post<{ category: Category }>('/categories', data);
  },

  delete(id: number) {
    return api.delete<{ message: string }>(`/categories/${id}`);
  },
};
