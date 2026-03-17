import { useState, useEffect, type FormEvent } from 'react';
import type { Todo, CreateTodoRequest, UpdateTodoRequest, Priority } from '../../types';
import { useTodos } from '../../hooks/useTodos';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';

interface TodoFormProps {
  open: boolean;
  onClose: () => void;
  editTodo?: Todo | null;
}

export function TodoForm({ open, onClose, editTodo }: TodoFormProps) {
  const { createTodo, updateTodo, categories } = useTodos();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [dueDate, setDueDate] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (editTodo) {
      setTitle(editTodo.title);
      setDescription(editTodo.description || '');
      setPriority(editTodo.priority);
      setDueDate(editTodo.due_date || '');
      setCategoryId(editTodo.category_id?.toString() || '');
    } else {
      setTitle('');
      setDescription('');
      setPriority('medium');
      setDueDate('');
      setCategoryId('');
    }
    setError('');
  }, [editTodo, open]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setLoading(true);
    setError('');

    try {
      if (editTodo) {
        const data: UpdateTodoRequest = {
          title: title.trim(),
          description: description.trim(),
          priority,
          due_date: dueDate || null,
          category_id: categoryId ? Number(categoryId) : null,
        };
        await updateTodo(editTodo.id, data);
      } else {
        const data: CreateTodoRequest = {
          title: title.trim(),
          description: description.trim() || undefined,
          priority,
          due_date: dueDate || null,
          category_id: categoryId ? Number(categoryId) : null,
        };
        await createTodo(data);
      }
      onClose();
    } catch (err) {
      setError((err as Error).message || '操作失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editTodo ? '编辑待办' : '新建待办'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}
        <Input
          label="标题"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="待办事项标题"
          required
        />
        <div className="w-full">
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            描述
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="添加详细描述（可选）"
            rows={3}
            className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200 resize-none"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Select
            label="优先级"
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
            options={[
              { value: 'low', label: '低' },
              { value: 'medium', label: '中' },
              { value: 'high', label: '高' },
            ]}
          />
          <Select
            label="分类"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            placeholder="无分类"
            options={categories.map((c) => ({
              value: c.id.toString(),
              label: c.name,
            }))}
          />
        </div>
        <Input
          label="截止日期"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            取消
          </Button>
          <Button type="submit" loading={loading}>
            {editTodo ? '保存' : '创建'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
