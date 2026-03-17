import { useContext } from 'react';
import { TodoContext } from '../context/TodoContext';

export function useTodos() {
  const ctx = useContext(TodoContext);
  if (!ctx) throw new Error('useTodos must be used within TodoProvider');
  return ctx;
}
