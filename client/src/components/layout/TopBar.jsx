import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Menu, X } from 'lucide-react';
import NotificationBell from '../notifications/NotificationBell';
import Avatar from '../ui/Avatar';
import Sidebar from './Sidebar';

const TopBar = () => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
        <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
          {/* Mobile menu button */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden flex items-center justify-center w-10 h-10 rounded-lg hover:bg-slate-100 transition-colors"
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? (
              <X size={20} className="text-slate-600" />
            ) : (
              <Menu size={20} className="text-slate-600" />
            )}
          </button>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Right section */}
          <div className="flex items-center gap-3">
            <NotificationBell />
            <div className="w-px h-6 bg-slate-200" />
            <div className="flex items-center gap-2">
              <Avatar
                src={user?.profilePhoto}
                initials={user?.name?.charAt(0)}
                size="sm"
              />
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-slate-900">
                  {user?.name}
                </p>
                <p className="text-xs text-slate-500">{user?.role || 'User'}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar (mobile only) */}
      <div className="lg:hidden">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      </div>
    </>
  );
};

export default TopBar;
