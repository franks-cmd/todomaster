import { useEffect, useState, useCallback } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useTodos } from '../../hooks/useTodos';
import { SortableTodoItem } from './TodoSortableList';
import { TodoForm } from './TodoForm';
import { TodoFilters } from './TodoFilters';
import { Button } from '../ui/Button';
import type { Todo } from '../../types';

export function TodoList() {
  const { todos, loading, error, filters, fetchTodos, reorderTodos } = useTodos();
  const [formOpen, setFormOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

  useEffect(() => {
    fetchTodos(filters);
  }, [fetchTodos, filters]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;

      const oldIndex = todos.findIndex((t) => t.id === active.id);
      const newIndex = todos.findIndex((t) => t.id === over.id);
      if (oldIndex === -1 || newIndex === -1) return;

      const reordered = [...todos];
      const [moved] = reordered.splice(oldIndex, 1);
      if (moved) reordered.splice(newIndex, 0, moved);

      reorderTodos(reordered.map((t) => t.id));
    },
    [todos, reorderTodos],
  );

  const handleEdit = (todo: Todo) => {
    setEditingTodo(todo);
    setFormOpen(true);
  };

  const handleCloseForm = () => {
    setFormOpen(false);
    setEditingTodo(null);
  };

  const completedCount = todos.filter((t) => t.completed).length;
  const totalCount = todos.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">我的待办</h1>
          <p className="mt-1 text-sm text-gray-500">
            {totalCount > 0
              ? `${completedCount}/${totalCount} 已完成`
              : '暂无待办事项'}
          </p>
        </div>
        <Button onClick={() => setFormOpen(true)}>
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          新建待办
        </Button>
      </div>

      {/* Filters */}
      <TodoFilters />

      {/* Progress bar */}
      {totalCount > 0 && (
        <div className="h-2 overflow-hidden rounded-full bg-gray-100">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary-400 to-primary-600 transition-all duration-500"
            style={{ width: `${(completedCount / totalCount) * 100}%` }}
          />
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <svg className="h-8 w-8 animate-spin text-primary-500" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        </div>
      )}

      {/* Todo items */}
      {!loading && todos.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 py-16">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-50">
            <svg className="h-8 w-8 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <p className="mt-4 text-lg font-medium text-gray-600">暂无待办事项</p>
          <p className="mt-1 text-sm text-gray-400">点击上方按钮创建你的第一个待办</p>
        </div>
      )}

      {!loading && todos.length > 0 && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={todos.map((t) => t.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-3">
              {todos.map((todo) => (
                <SortableTodoItem
                  key={todo.id}
                  todo={todo}
                  onEdit={handleEdit}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {/* Form modal */}
      <TodoForm
        open={formOpen}
        onClose={handleCloseForm}
        editTodo={editingTodo}
      />
    </div>
  );
}
