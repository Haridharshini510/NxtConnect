import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogOut, Menu, PanelLeftClose, PanelLeftOpen, Settings, X } from 'lucide-react';
import NotificationBell from '../notifications/NotificationBell';
import Avatar from '../ui/Avatar';
import Sidebar from './Sidebar';
import logo from '../../assets/logo.png';

const TopBar = ({ desktopSidebarCollapsed, onToggleDesktopSidebar }) => {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-40 shrink-0 bg-white/90 backdrop-blur-md border-b border-blue-100 shadow-sm">
        <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-2">
          <div className="flex items-center gap-2">
            {/* Mobile menu button */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden flex items-center justify-center w-10 h-10 rounded-xl hover:bg-blue-50 transition-colors"
              aria-label="Toggle sidebar"
            >
              {sidebarOpen ? (
                <X size={20} className="text-slate-600" />
              ) : (
                <Menu size={20} className="text-slate-600" />
              )}
            </button>

            {/* Desktop sidebar collapse button */}
            <button
              onClick={onToggleDesktopSidebar}
              className="hidden lg:flex items-center justify-center w-10 h-10 rounded-xl hover:bg-blue-50 transition-colors"
              aria-label="Toggle sidebar width"
            >
              {desktopSidebarCollapsed ? (
                <PanelLeftOpen size={20} className="text-slate-600" />
              ) : (
                <PanelLeftClose size={20} className="text-slate-600" />
              )}
            </button>

            <Link to="/dashboard" className="lg:hidden flex items-center gap-2 ml-1">
              <img src={logo} alt="NxtConnect logo" className="w-7 h-7 rounded-md object-cover" />
              <span className="text-lg font-semibold text-slate-900">NxtConnect</span>
            </Link>
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Right section */}
          <div className="flex items-center gap-3">
            <NotificationBell />
            <div className="w-px h-6 bg-slate-200" />
            <div className="relative" ref={profileMenuRef}>
              <button
                onClick={() => setShowProfileMenu((prev) => !prev)}
                className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-blue-50 transition-colors"
                aria-label="Open profile menu"
              >
                <Avatar
                  src={user?.profilePhoto}
                  initials={user?.name?.charAt(0)}
                  size="sm"
                />
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium text-slate-900">{user?.name}</p>
                  <p className="text-xs text-slate-500">{user?.role || 'User'}</p>
                </div>
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-72 bg-white/95 backdrop-blur-md border border-blue-100 rounded-xl shadow-lg z-50 overflow-hidden">
                  <div className="px-3 py-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <Avatar
                        src={user?.profilePhoto}
                        initials={user?.name?.charAt(0)}
                        size="sm"
                      />
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-900 truncate">{user?.name}</p>
                        <p className="text-xs text-slate-500 truncate">{user?.role || 'User'}</p>
                      </div>
                    </div>
                    <button
                      onClick={logout}
                      className="inline-flex items-center justify-center w-9 h-9 rounded-md text-error-600 hover:bg-error-50 transition-colors"
                      aria-label="Logout"
                      title="Logout"
                    >
                      <LogOut size={16} />
                    </button>
                  </div>
                  <div className="border-t border-slate-200 p-2">
                    <Link
                      to="/profile/edit"
                      onClick={() => setShowProfileMenu(false)}
                      className="flex items-center gap-2 px-2 py-2 rounded-md text-sm text-slate-700 hover:bg-slate-100"
                    >
                      <Settings size={16} />
                      Edit profile
                    </Link>
                  </div>
                </div>
              )}

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
