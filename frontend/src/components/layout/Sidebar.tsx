import { CategoryList } from '../category/CategoryList';
import { CategoryForm } from '../category/CategoryForm';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed left-0 top-16 z-40 flex h-[calc(100vh-4rem)] w-72 flex-col border-r border-gray-200 bg-white transition-transform duration-300 lg:static lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex-1 overflow-y-auto p-4">
          <div className="mb-6">
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
              分类
            </h2>
            <CategoryList onSelect={onClose} />
          </div>
          <div>
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
              新建分类
            </h2>
            <CategoryForm />
          </div>
        </div>
      </aside>
    </>
  );
}
