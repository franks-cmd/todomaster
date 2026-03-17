import { useContext } from 'react';
import { TodoContext } from '../context/TodoContext';

export function useCategories() {
  const ctx = useContext(TodoContext);
  if (!ctx) throw new Error('useCategories must be used within TodoProvider');
  const { categories, fetchCategories, createCategory, deleteCategory } = ctx;
  return { categories, fetchCategories, createCategory, deleteCategory };
}
