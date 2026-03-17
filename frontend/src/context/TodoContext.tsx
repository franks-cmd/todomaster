import {
  createContext,
  useReducer,
  useCallback,
  type ReactNode,
} from 'react';
import type { Todo, Category, TodoFilters, CreateTodoRequest, UpdateTodoRequest } from '../types';
import { todoService } from '../services/todoService';
import { categoryService } from '../services/categoryService';

interface TodoState {
  todos: Todo[];
  categories: Category[];
  filters: TodoFilters;
  loading: boolean;
  error: string | null;
}

type TodoAction =
  | { type: 'SET_LOADING'; loading: boolean }
  | { type: 'SET_ERROR'; error: string | null }
  | { type: 'SET_TODOS'; todos: Todo[] }
  | { type: 'ADD_TODO'; todo: Todo }
  | { type: 'UPDATE_TODO'; todo: Todo }
  | { type: 'DELETE_TODO'; id: number }
  | { type: 'SET_CATEGORIES'; categories: Category[] }
  | { type: 'ADD_CATEGORY'; category: Category }
  | { type: 'DELETE_CATEGORY'; id: number }
  | { type: 'SET_FILTERS'; filters: TodoFilters };

interface TodoContextValue extends TodoState {
  fetchTodos: (filters?: TodoFilters) => Promise<void>;
  createTodo: (data: CreateTodoRequest) => Promise<void>;
  updateTodo: (id: number, data: UpdateTodoRequest) => Promise<void>;
  deleteTodo: (id: number) => Promise<void>;
  toggleTodo: (id: number) => Promise<void>;
  reorderTodos: (orderedIds: number[]) => Promise<void>;
  fetchCategories: () => Promise<void>;
  createCategory: (name: string, color?: string) => Promise<void>;
  deleteCategory: (id: number) => Promise<void>;
  setFilters: (filters: TodoFilters) => void;
}

export const TodoContext = createContext<TodoContextValue | null>(null);

function todoReducer(state: TodoState, action: TodoAction): TodoState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.loading };
    case 'SET_ERROR':
      return { ...state, error: action.error, loading: false };
    case 'SET_TODOS':
      return { ...state, todos: action.todos, loading: false, error: null };
    case 'ADD_TODO':
      return { ...state, todos: [...state.todos, action.todo] };
    case 'UPDATE_TODO':
      return {
        ...state,
        todos: state.todos.map((t) => (t.id === action.todo.id ? action.todo : t)),
      };
    case 'DELETE_TODO':
      return { ...state, todos: state.todos.filter((t) => t.id !== action.id) };
    case 'SET_CATEGORIES':
      return { ...state, categories: action.categories };
    case 'ADD_CATEGORY':
      return { ...state, categories: [...state.categories, action.category] };
    case 'DELETE_CATEGORY':
      return {
        ...state,
        categories: state.categories.filter((c) => c.id !== action.id),
      };
    case 'SET_FILTERS':
      return { ...state, filters: action.filters };
  }
}

const initialState: TodoState = {
  todos: [],
  categories: [],
  filters: {},
  loading: false,
  error: null,
};

export function TodoProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(todoReducer, initialState);

  const fetchTodos = useCallback(async (filters?: TodoFilters) => {
    dispatch({ type: 'SET_LOADING', loading: true });
    try {
      const { todos } = await todoService.getAll(filters);
      dispatch({ type: 'SET_TODOS', todos });
    } catch (e) {
      dispatch({ type: 'SET_ERROR', error: (e as Error).message });
    }
  }, []);

  const createTodo = useCallback(async (data: CreateTodoRequest) => {
    const { todo } = await todoService.create(data);
    dispatch({ type: 'ADD_TODO', todo });
  }, []);

  const updateTodo = useCallback(async (id: number, data: UpdateTodoRequest) => {
    const { todo } = await todoService.update(id, data);
    dispatch({ type: 'UPDATE_TODO', todo });
  }, []);

  const deleteTodo = useCallback(async (id: number) => {
    await todoService.delete(id);
    dispatch({ type: 'DELETE_TODO', id });
  }, []);

  const toggleTodo = useCallback(async (id: number) => {
    const { todo } = await todoService.toggle(id);
    dispatch({ type: 'UPDATE_TODO', todo });
  }, []);

  const reorderTodos = useCallback(
    async (orderedIds: number[]) => {
      const reordered = orderedIds
        .map((id, index) => {
          const todo = state.todos.find((t) => t.id === id);
          return todo ? { ...todo, sort_order: index } : null;
        })
        .filter((t): t is Todo => t !== null);
      dispatch({ type: 'SET_TODOS', todos: reordered });

      try {
        await todoService.reorder(orderedIds);
      } catch {
        dispatch({ type: 'SET_TODOS', todos: state.todos });
      }
    },
    [state.todos],
  );

  const fetchCategories = useCallback(async () => {
    try {
      const { categories } = await categoryService.getAll();
      dispatch({ type: 'SET_CATEGORIES', categories });
    } catch (e) {
      dispatch({ type: 'SET_ERROR', error: (e as Error).message });
    }
  }, []);

  const createCategory = useCallback(async (name: string, color?: string) => {
    const { category } = await categoryService.create({ name, color });
    dispatch({ type: 'ADD_CATEGORY', category });
  }, []);

  const deleteCategory = useCallback(async (id: number) => {
    await categoryService.delete(id);
    dispatch({ type: 'DELETE_CATEGORY', id });
  }, []);

  const setFilters = useCallback((filters: TodoFilters) => {
    dispatch({ type: 'SET_FILTERS', filters });
  }, []);

  return (
    <TodoContext.Provider
      value={{
        ...state,
        fetchTodos,
        createTodo,
        updateTodo,
        deleteTodo,
        toggleTodo,
        reorderTodos,
        fetchCategories,
        createCategory,
        deleteCategory,
        setFilters,
      }}
    >
      {children}
    </TodoContext.Provider>
  );
}
