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
  Map,
  ShieldCheck,
  ChevronDown,
  X,
} from 'lucide-react';
import Avatar from '../ui/Avatar';
import logo from '../../assets/logo.png';
import brand from '../../assets/brand.png';

const getNavLinks = (role) => {
  const links = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/mentors', label: 'Mentors', icon: Users },
    { to: '/connections', label: 'Connections', icon: MessageSquare },
    { to: '/applications', label: 'Applications', icon: ClipboardList },
    { to: '/referrals', label: 'Referrals', icon: Gift },
    { to: '/resume', label: 'Resume', icon: FileText },
    { to: '/feed', label: 'Feed', icon: Rss },
    { to: '/workshops', label: 'Events', icon: Calendar },
    { to: '/jobs', label: 'Jobs', icon: Briefcase },
    { to: '/roadmaps', label: 'Roadmaps', icon: Map },
  ];
  if (role === 'admin') {
    links.push({ to: '/admin', label: 'Admin', icon: ShieldCheck });
  }
  return links;
};

const Sidebar = ({ isOpen, onClose, collapsed = false }) => {
  const { user } = useAuth();
  const location = useLocation();
  const navLinks = getNavLinks(user?.role);
  const isMobileDrawer = typeof onClose === 'function';

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
          fixed left-0 top-0 h-screen ${collapsed ? 'w-20' : isMobileDrawer ? 'w-72' : 'w-64'} bg-white/95 backdrop-blur-md border-r border-blue-100
          transition-transform duration-300 z-50 lg:sticky lg:top-0 lg:z-30
          flex flex-col
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {isMobileDrawer && (
          <div className="flex items-center justify-between px-4 py-4 border-b border-slate-200">
            <Link
              to="/dashboard"
              onClick={onClose}
              className="flex items-center gap-2 hover:opacity-90 transition-opacity"
            >
              <img src={logo} alt="NxtConnect logo" className="w-8 h-8 rounded-lg object-cover" />
              <img src={brand} alt="NxtConnect brand" className="h-9 w-auto object-contain" />
            </Link>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-lg hover:bg-slate-100 flex items-center justify-center"
              aria-label="Close menu"
            >
              <X size={18} className="text-slate-600" />
            </button>
          </div>
        )}

        {/* Logo */}
        {!isMobileDrawer && (
          <Link
            to="/dashboard"
            className={`flex items-center gap-0 px-4 py-4 border-b border-blue-100 hover:bg-blue-50/60 transition-colors ${collapsed ? 'justify-center' : ''}`}
          >
            <img src={logo} alt="NxtConnect logo" className="w-8 h-8 rounded-lg object-cover" />
            <div className={`${collapsed ? 'hidden' : 'hidden sm:block'}`}>
              <img src={brand} alt="NxtConnect brand" className="h-8 w-auto object-contain" />
            </div>
          </Link>
        )}
        
        {/* Nav Links */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5">
          {navLinks.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              onClick={isMobileDrawer ? onClose : undefined}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                transition-colors whitespace-nowrap
                ${collapsed ? 'justify-center' : ''}
                ${
                  isActive(to)
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-blue-50/70 hover:text-slate-900'
                }
              `}
            >
              <Icon size={18} className="flex-shrink-0" />
              <span className={collapsed ? 'hidden' : ''}>{label}</span>
            </Link>
          ))}
        </nav>

        {/* Bottom Profile */}
        <div className="border-t border-blue-100 p-3">
          <button
            type="button"
            className={`w-full flex items-center rounded-xl hover:bg-blue-50/60 transition-colors ${collapsed ? 'justify-center px-2 py-2' : 'gap-3 px-3 py-2 text-left'}`}
          >
            <Avatar src={user?.profilePhoto} initials={user?.name?.charAt(0)} size="sm" />
            {!collapsed && (
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-slate-900 truncate">{user?.name}</p>
                <p className="text-xs text-slate-500 truncate">{user?.role || 'User'}</p>
              </div>
            )}
            <ChevronDown size={16} className={`text-slate-500 ${collapsed ? 'ml-2' : ''}`} />
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
