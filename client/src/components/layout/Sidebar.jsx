import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  Sparkles,
  MessageSquare,
  ClipboardList,
  Gift,
  FileText,
  Rss,
  Calendar,
  Briefcase,
  BellRing,
  Map,
  ShieldCheck,
  LogOut,
  Settings,
  ChevronDown,
} from 'lucide-react';
import Avatar from '../ui/Avatar';
import { useState } from 'react';

const getNavLinks = (role) => {
  const links = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/mentors', label: 'Mentors', icon: Users },
    { to: '/ai-matching', label: 'AI Match', icon: Sparkles },
    { to: '/connections', label: 'Connections', icon: MessageSquare },
    { to: '/applications', label: 'Applications', icon: ClipboardList },
    { to: '/referrals', label: 'Referrals', icon: Gift },
    { to: '/resume', label: 'Resume', icon: FileText },
    { to: '/feed', label: 'Feed', icon: Rss },
    { to: '/workshops', label: 'Events', icon: Calendar },
    { to: '/jobs', label: 'Jobs', icon: Briefcase },
    { to: '/notifications', label: 'Notifications', icon: BellRing },
    { to: '/roadmaps', label: 'Roadmaps', icon: Map },
  ];
  if (role === 'admin') {
    links.push({ to: '/admin', label: 'Admin', icon: ShieldCheck });
  }
  return links;
};

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navLinks = getNavLinks(user?.role);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const isActive = (to) => {
    if (to === '/dashboard') return location.pathname === to;
    return location.pathname.startsWith(to);
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed left-0 top-0 h-screen w-64 bg-white border-r border-slate-200
          transition-transform duration-300 z-50 lg:static lg:z-auto
          flex flex-col
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Logo */}
        <Link
          to="/dashboard"
          className="flex items-center gap-3 px-4 py-4 border-b border-slate-200 hover:bg-slate-50 transition-colors"
        >
          <div className="w-8 h-8 rounded-lg bg-primary-600 text-white font-bold flex items-center justify-center text-sm">
            NC
          </div>
          <div className="hidden sm:block">
            <div className="text-sm font-bold text-slate-900">NxtConnect</div>
            <div className="text-xs text-slate-500">Mentorship Platform</div>
          </div>
        </Link>

        {/* Nav Links */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {navLinks.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                transition-colors whitespace-nowrap
                ${
                  isActive(to)
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }
              `}
            >
              <Icon size={18} className="flex-shrink-0" />
              <span>{label}</span>
            </Link>
          ))}
        </nav>

        {/* User Section */}
        <div className="border-t border-slate-200 p-3">
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors text-left"
            >
              <Avatar
                src={user?.profilePhoto}
                initials={user?.name?.charAt(0)}
                size="sm"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 truncate">
                  {user?.name}
                </p>
                <p className="text-xs text-slate-500 truncate">
                  {user?.role || 'User'}
                </p>
              </div>
              <ChevronDown size={16} className="flex-shrink-0" />
            </button>

            {/* User dropdown menu */}
            {showUserMenu && (
              <div className="absolute bottom-full left-0 right-0 mb-2 bg-white border border-slate-200 rounded-lg shadow-lg overflow-hidden z-10">
                <Link
                  to="/profile/edit"
                  className="block px-4 py-2.5 text-sm text-slate-900 hover:bg-slate-50 transition-colors"
                  onClick={() => setShowUserMenu(false)}
                >
                  <Settings size={16} className="inline mr-2" />
                  Settings
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setShowUserMenu(false);
                  }}
                  className="w-full text-left px-4 py-2.5 text-sm text-error-600 hover:bg-error-50 transition-colors"
                >
                  <LogOut size={16} className="inline mr-2" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
