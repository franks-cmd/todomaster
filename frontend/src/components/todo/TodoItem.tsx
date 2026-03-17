import type { Todo } from '../../types';
import { Badge } from '../ui/Badge';
import { useTodos } from '../../hooks/useTodos';

interface TodoItemProps {
  todo: Todo;
  onEdit: (todo: Todo) => void;
  dragHandleProps?: Record<string, unknown>;
}

const priorityConfig = {
  high: { color: 'border-l-red-500', badge: 'danger' as const, label: '高' },
  medium: { color: 'border-l-amber-400', badge: 'warning' as const, label: '中' },
  low: { color: 'border-l-emerald-400', badge: 'success' as const, label: '低' },
};

function isOverdue(dueDate: string | null): boolean {
  if (!dueDate) return false;
  return new Date(dueDate) < new Date(new Date().toDateString());
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
}

export function TodoItem({ todo, onEdit, dragHandleProps }: TodoItemProps) {
  const { toggleTodo, deleteTodo } = useTodos();
  const config = priorityConfig[todo.priority];
  const overdue = !todo.completed && isOverdue(todo.due_date);

  return (
    <div
      className={`group flex items-start gap-3 rounded-xl border-l-4 bg-white p-4 shadow-sm ring-1 ring-gray-100 transition-all hover:shadow-md ${config.color} ${
        todo.completed ? 'opacity-60' : ''
      }`}
    >
      {/* Drag handle */}
      <button
        className="mt-0.5 cursor-grab touch-none text-gray-300 hover:text-gray-400 active:cursor-grabbing"
        {...dragHandleProps}
      >
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
          <circle cx="9" cy="5" r="1.5" />
          <circle cx="15" cy="5" r="1.5" />
          <circle cx="9" cy="12" r="1.5" />
          <circle cx="15" cy="12" r="1.5" />
          <circle cx="9" cy="19" r="1.5" />
          <circle cx="15" cy="19" r="1.5" />
        </svg>
      </button>

      {/* Checkbox */}
      <button
        onClick={() => toggleTodo(todo.id)}
        className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 transition-colors cursor-pointer ${
          todo.completed
            ? 'border-primary-500 bg-primary-500 text-white'
            : 'border-gray-300 hover:border-primary-400'
        }`}
      >
        {todo.completed && (
          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3
            className={`text-sm font-medium ${
              todo.completed ? 'text-gray-400 line-through' : 'text-gray-900'
            }`}
          >
            {todo.title}
          </h3>
          <div className="flex flex-shrink-0 items-center gap-1">
            <Badge variant={config.badge}>{config.label}</Badge>
            {todo.category_name && (
              <Badge className="gap-1">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: todo.category_color || '#6b7280' }}
                />
                {todo.category_name}
              </Badge>
            )}
          </div>
        </div>
        {todo.description && (
          <p className="mt-1 text-sm text-gray-500 line-clamp-2">{todo.description}</p>
        )}
        <div className="mt-2 flex items-center gap-3">
          {todo.due_date && (
            <span
              className={`flex items-center gap-1 text-xs ${
                overdue ? 'font-medium text-red-500' : 'text-gray-400'
              }`}
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {overdue ? '已逾期 · ' : ''}
              {formatDate(todo.due_date)}
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
        <button
          onClick={() => onEdit(todo)}
          className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 cursor-pointer"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
        <button
          onClick={() => {
            if (confirm('确定删除这个待办事项吗？')) deleteTodo(todo.id);
          }}
          className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500 cursor-pointer"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
}
