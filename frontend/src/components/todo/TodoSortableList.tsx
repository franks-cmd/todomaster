import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { TodoItem } from './TodoItem';
import type { Todo } from '../../types';

interface SortableTodoItemProps {
  todo: Todo;
  onEdit: (todo: Todo) => void;
}

export function SortableTodoItem({ todo, onEdit }: SortableTodoItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: todo.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={isDragging ? 'dragging' : ''}
    >
      <TodoItem
        todo={todo}
        onEdit={onEdit}
        dragHandleProps={{ ...attributes, ...listeners }}
      />
    </div>
  );
}
