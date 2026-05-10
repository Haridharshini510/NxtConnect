import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LogOut,
  User,
  LayoutDashboard,
  Users,
  Briefcase,
  Map,
  MessageSquare,
  Rss,
  Calendar,
  ShieldCheck,
  Sparkles,
  FileText,
  ClipboardList,
  Gift,
  Lock,
} from 'lucide-react';
import NotificationBell from '../notifications/NotificationBell';
import logo from '../../assets/logo.png';

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
  if (role === 'admin') links.push({ to: '/admin', label: 'Admin', icon: ShieldCheck });
  return links;
};

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const navLinks = getNavLinks(user?.role);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (to) => (to === '/dashboard' ? location.pathname === to : location.pathname.startsWith(to));

  return (
    <nav className="bg-white/95 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          <Link to="/dashboard" className="flex items-center gap-2 flex-shrink-0">
            <img src={logo} alt="NxtConnect logo" className="w-8 h-8 rounded-lg object-cover" />
            <div className="hidden sm:block">
              <div className="text-sm font-semibold text-slate-900 leading-tight">NxtConnect</div>
              <div className="text-[11px] text-slate-500 leading-tight">Mentorship and Career Platform</div>
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-1 overflow-x-auto">
            {navLinks.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium whitespace-nowrap ${
                  isActive(to)
                    ? 'bg-primary-50 text-primary-700 ring-1 ring-primary-100'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Icon size={15} />
                {label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden xl:flex status-chip-neutral">
              <Lock size={12} />
              <span>Secure</span>
            </div>
            <NotificationBell />

            <Link
              to="/profile/edit"
              className="flex items-center gap-2 text-sm text-slate-600 hover:text-primary-700 transition-colors px-2 py-1 rounded-lg hover:bg-slate-100"
            >
              {user?.profilePhoto ? (
                <img src={user.profilePhoto} className="w-8 h-8 rounded-full object-cover" alt="avatar" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                  <User size={15} className="text-primary-700" />
                </div>
              )}
              <span className="hidden sm:block font-medium text-sm">{user?.name?.split(' ')[0]}</span>
            </Link>

            <button onClick={handleLogout} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg" title="Logout">
              <LogOut size={17} />
            </button>
          </div>
        </div>
      </div>

      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-slate-200 flex overflow-x-auto py-1.5 z-50">
        {navLinks.map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            className={`flex min-w-[84px] flex-col items-center gap-0.5 px-2 py-1.5 text-[11px] ${
              isActive(to) ? 'text-primary-700' : 'text-slate-500'
            }`}
          >
            <Icon size={18} />
            {label}
          </Link>
        ))}
      </div>
    </nav>
  );
}


