import { useAuth } from '../../hooks/useAuth';
import { Button } from '../ui/Button';

interface HeaderProps {
  onToggleSidebar: () => void;
}

export function Header({ onToggleSidebar }: HeaderProps) {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white/80 px-4 backdrop-blur-md sm:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 lg:hidden cursor-pointer"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-500 text-white font-bold text-sm">
            T
          </div>
          <h1 className="text-xl font-bold text-gray-900">
            Todo<span className="text-primary-500">Master</span>
          </h1>
        </div>
      </div>

      {user && (
        <div className="flex items-center gap-4">
          <div className="hidden items-center gap-2 sm:flex">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-primary-700 text-sm font-semibold">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <span className="text-sm font-medium text-gray-700">{user.name}</span>
          </div>
          <Button variant="ghost" size="sm" onClick={logout}>
            退出
          </Button>
        </div>
      )}
    </header>
  );
}
