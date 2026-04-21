import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogOut, User, LayoutDashboard, Users, Briefcase, Map, MessageSquare, Rss, Calendar, ShieldCheck } from 'lucide-react';
import NotificationBell from '../notifications/NotificationBell';

const getNavLinks = (role) => {
  const links = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/mentors', label: 'Mentors', icon: Users },
    { to: '/connections', label: 'Connections', icon: MessageSquare },
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

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/dashboard" className="text-xl font-bold text-blue-600 flex-shrink-0">
            NextConnect
          </Link>

          {/* Desktop nav links */}
          <div className="hidden lg:flex items-center gap-0.5 overflow-x-auto">
            {navLinks.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                  location.pathname.startsWith(to) && to !== '/dashboard'
                    ? 'bg-blue-50 text-blue-600'
                    : location.pathname === to
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon size={15} />
                {label}
              </Link>
            ))}
          </div>

          {/* Right side: notification bell + user */}
          <div className="flex items-center gap-2">
            <NotificationBell />

            <Link
              to="/profile/edit"
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
            >
              {user?.profilePhoto ? (
                <img src={user.profilePhoto} className="w-8 h-8 rounded-full object-cover" alt="avatar" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <User size={15} className="text-blue-600" />
                </div>
              )}
              <span className="hidden sm:block font-medium text-sm">{user?.name?.split(' ')[0]}</span>
            </Link>

            <button onClick={handleLogout} className="p-2 text-gray-400 hover:text-red-500 transition-colors" title="Logout">
              <LogOut size={17} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile bottom nav — show first 5 links */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around py-1.5 z-50">
        {navLinks.slice(0, 5).map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            className={`flex flex-col items-center gap-0.5 px-2 py-1 text-xs ${
              location.pathname === to ? 'text-blue-600' : 'text-gray-500'
            }`}
          >
            <Icon size={19} />
            {label}
          </Link>
        ))}
      </div>
    </nav>
  );
}