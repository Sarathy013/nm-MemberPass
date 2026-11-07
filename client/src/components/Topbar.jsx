import { Menu, Bell } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Topbar({ onMenuClick, title }) {
  const { isDemo } = useAuth();

  return (
    <header className="sticky top-0 z-20 bg-white border-b border-gray-100 px-4 md:px-6 py-3 flex items-center gap-4">
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition"
      >
        <Menu size={20} />
      </button>

      <div className="flex-1">
        <h1 className="font-semibold text-gray-900 text-lg">{title}</h1>
      </div>

      {isDemo && (
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
          Demo Mode
        </div>
      )}

      <button className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition relative">
        <Bell size={18} />
        <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-500" />
      </button>
    </header>
  );
}
