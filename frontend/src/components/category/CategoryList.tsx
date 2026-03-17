import { useEffect } from 'react';
import { useTodos } from '../../hooks/useTodos';

interface CategoryListProps {
  onSelect?: () => void;
}

export function CategoryList({ onSelect }: CategoryListProps) {
  const { categories, filters, setFilters, fetchCategories, deleteCategory, fetchTodos } =
    useTodos();

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleSelect = (categoryId?: number) => {
    const newFilters = { ...filters, category: categoryId };
    setFilters(newFilters);
    fetchTodos(newFilters);
    onSelect?.();
  };

  const handleDelete = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('确定删除这个分类吗？')) return;
    await deleteCategory(id);
    if (filters.category === id) {
      const newFilters = { ...filters, category: undefined };
      setFilters(newFilters);
      fetchTodos(newFilters);
    }
  };

  return (
    <ul className="space-y-1">
      <li>
        <button
          onClick={() => handleSelect(undefined)}
          className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors cursor-pointer ${
            filters.category == null
              ? 'bg-primary-50 text-primary-700'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <span className="h-3 w-3 rounded-full bg-gray-300" />
          全部
        </button>
      </li>
      {categories.map((cat) => (
        <li key={cat.id}>
          <button
            onClick={() => handleSelect(cat.id)}
            className={`group flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors cursor-pointer ${
              filters.category === cat.id
                ? 'bg-primary-50 text-primary-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <span className="flex items-center gap-2">
              <span
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: cat.color }}
              />
              {cat.name}
            </span>
            <span
              onClick={(e) => handleDelete(cat.id, e)}
              className="hidden rounded p-0.5 text-gray-400 hover:bg-red-100 hover:text-red-500 group-hover:inline-block cursor-pointer"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}
