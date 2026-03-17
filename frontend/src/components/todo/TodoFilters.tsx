import { useState, useEffect, useRef } from 'react';
import { useTodos } from '../../hooks/useTodos';
import { Select } from '../ui/Select';
import type { Priority } from '../../types';

export function TodoFilters() {
  const { filters, setFilters, fetchTodos } = useTodos();
  const [search, setSearch] = useState(filters.search || '');
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const newFilters = { ...filters, search: value || undefined };
      setFilters(newFilters);
      fetchTodos(newFilters);
    }, 300);
  };

  const handlePriorityChange = (value: string) => {
    const newFilters = {
      ...filters,
      priority: (value || undefined) as Priority | undefined,
    };
    setFilters(newFilters);
    fetchTodos(newFilters);
  };

  const handleCompletedChange = (value: string) => {
    const newFilters = {
      ...filters,
      completed: value === '' ? undefined : value === 'true',
    };
    setFilters(newFilters);
    fetchTodos(newFilters);
  };

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <svg
          className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="text"
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder="搜索待办事项..."
          className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-4 text-sm placeholder-gray-400 transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
        />
      </div>
      <div className="flex gap-2">
        <Select
          value={filters.priority || ''}
          onChange={(e) => handlePriorityChange(e.target.value)}
          placeholder="所有优先级"
          options={[
            { value: 'high', label: '高优先级' },
            { value: 'medium', label: '中优先级' },
            { value: 'low', label: '低优先级' },
          ]}
          className="w-32"
        />
        <Select
          value={filters.completed == null ? '' : String(filters.completed)}
          onChange={(e) => handleCompletedChange(e.target.value)}
          placeholder="所有状态"
          options={[
            { value: 'false', label: '未完成' },
            { value: 'true', label: '已完成' },
          ]}
          className="w-28"
        />
      </div>
    </div>
  );
}
