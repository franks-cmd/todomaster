import { useState, type FormEvent } from 'react';
import { useCategories } from '../../hooks/useCategories';
import { Button } from '../ui/Button';

const PRESET_COLORS = [
  '#6366f1', '#8b5cf6', '#ec4899', '#ef4444',
  '#f97316', '#eab308', '#22c55e', '#14b8a6',
  '#06b6d4', '#3b82f6',
];

export function CategoryForm() {
  const { createCategory } = useCategories();
  const [name, setName] = useState('');
  const [color, setColor] = useState(PRESET_COLORS[0]!);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    try {
      await createCategory(name.trim(), color);
      setName('');
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="分类名称"
        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder-gray-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
      />
      <div className="flex flex-wrap gap-1.5">
        {PRESET_COLORS.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setColor(c)}
            className={`h-6 w-6 rounded-full transition-all cursor-pointer ${
              color === c ? 'ring-2 ring-offset-2 ring-primary-500 scale-110' : 'hover:scale-110'
            }`}
            style={{ backgroundColor: c }}
          />
        ))}
      </div>
      <Button type="submit" size="sm" loading={loading} className="w-full">
        添加分类
      </Button>
    </form>
  );
}
