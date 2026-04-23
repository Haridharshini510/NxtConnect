import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { SocketProvider } from './context/SocketContext';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, ShieldCheck } from 'lucide-react';

// Phase 1 pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import MentorBrowse from './pages/Mentorbrowse';
import MentorProfile from './pages/MentorProfile';
import MyConnections from './pages/MyConnections';
import Jobs from './pages/Jobs';
import Roadmaps from './pages/Roadmaps';
import RoadmapDetail from './pages/RoadmapDetail';
import Chat from './pages/Chat';
import EditProfile from './pages/EditProfile';

// Phase 2 pages
import Feed from './pages/Feed';
import Workshops from './pages/Workshops';
import WorkshopDetail from './pages/WorkshopDetail';
import Notifications from './pages/Notifications';
import AdminDashboard from './pages/AdminDashboard';
import ApplicationTracker from './pages/ApplicationTracker';
import Referrals from './pages/Referrals';
import ResumeBuilder from './pages/ResumeBuilder';

import Sidebar from './components/layout/Sidebar';
import TopBar from './components/layout/TopBar';

const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="flex h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-3 text-gray-400">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <span className="text-sm">Loading...</span>
      </div>
    </div>
  );
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/dashboard" replace />;
  return children;
};

const ROUTE_LABELS = {
  dashboard: 'Dashboard',
  mentors: 'Mentors',
  'ai-matching': 'AI Match',
  connections: 'Connections',
  chat: 'Chat',
  jobs: 'Jobs',
  applications: 'Applications',
  referrals: 'Referrals',
  resume: 'Resume Builder',
  feed: 'Feed',
  workshops: 'Workshops',
  notifications: 'Notifications',
  roadmaps: 'Roadmaps',
  admin: 'Admin',
  profile: 'Profile',
  edit: 'Edit',
};

const Layout = ({ children }) => {
  const { user } = useAuth();
  const { pathname } = useLocation();
  const segments = pathname.split('/').filter(Boolean);
  const crumbs = [{ label: 'Dashboard', to: '/dashboard' }];
  let runningPath = '';

  segments.forEach((seg, index) => {
    runningPath += `/${seg}`;
    if (seg === 'dashboard') return;

    const isDynamic = seg.length > 20 || /^\d+$/.test(seg);
    const label = ROUTE_LABELS[seg] || (isDynamic ? 'Details' : seg.charAt(0).toUpperCase() + seg.slice(1));
    crumbs.push({
      label,
      to: runningPath,
      isLast: index === segments.length - 1,
    });
  });

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <div className="hidden lg:block">
        <Sidebar isOpen />
      </div>

      <div className="flex-1 min-w-0">
        <TopBar />
        <div className="page-shell">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
            <div className="card py-3 px-4 !rounded-xl !shadow-none bg-white/90 backdrop-blur-sm">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs sm:text-sm text-slate-500 overflow-x-auto">
                  {crumbs.map((crumb, idx) => (
                    <div key={`${crumb.label}-${idx}`} className="flex items-center gap-1.5 whitespace-nowrap">
                      {crumb.isLast ? (
                        <span className="font-semibold text-slate-700">{crumb.label}</span>
                      ) : (
                        <Link to={crumb.to} className="hover:text-blue-700">{crumb.label}</Link>
                      )}
                      {idx < crumbs.length - 1 && <ChevronRight size={14} className="text-slate-400" />}
                    </div>
                  ))}
                </nav>
                <div className="status-chip-neutral w-fit">
                  <ShieldCheck size={13} />
                  <span>{user?.role ? `${user.role} session` : 'Secure session'}</span>
                </div>
              </div>
            </div>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};

const AppRoutes = () => {
  const { user } = useAuth();
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3200,
          style: {
            borderRadius: '12px',
            border: '1px solid #dbe3ef',
            background: '#ffffff',
            color: '#0f172a',
            boxShadow: '0 8px 24px rgba(15, 23, 42, 0.08)',
            fontSize: '13px',
            fontWeight: 500,
          },
        }}
      />
      <Routes>
        {/* Public */}
        <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Landing />} />
        <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register />} />

        {/* Protected — Phase 1 */}
        <Route path="/dashboard" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
        <Route path="/mentors" element={<ProtectedRoute><Layout><MentorBrowse /></Layout></ProtectedRoute>} />
        <Route path="/mentors/:userId" element={<ProtectedRoute><Layout><MentorProfile /></Layout></ProtectedRoute>} />
        <Route path="/connections" element={<ProtectedRoute><Layout><MyConnections /></Layout></ProtectedRoute>} />
        <Route path="/chat/:roomId" element={<ProtectedRoute><Layout><Chat /></Layout></ProtectedRoute>} />
        <Route path="/jobs" element={<ProtectedRoute><Layout><Jobs /></Layout></ProtectedRoute>} />
        <Route path="/roadmaps" element={<ProtectedRoute><Layout><Roadmaps /></Layout></ProtectedRoute>} />
        <Route path="/roadmaps/:id" element={<ProtectedRoute><Layout><RoadmapDetail /></Layout></ProtectedRoute>} />
        <Route path="/profile/edit" element={<ProtectedRoute><Layout><EditProfile /></Layout></ProtectedRoute>} />

        {/* Protected — Phase 2 */}
        <Route path="/feed" element={<ProtectedRoute><Layout><Feed /></Layout></ProtectedRoute>} />
        <Route path="/workshops" element={<ProtectedRoute><Layout><Workshops /></Layout></ProtectedRoute>} />
        <Route path="/workshops/:id" element={<ProtectedRoute><Layout><WorkshopDetail /></Layout></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><Layout><Notifications /></Layout></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute roles={['admin']}><Layout><AdminDashboard /></Layout></ProtectedRoute>} />
        <Route path="/applications" element={<ProtectedRoute><Layout><ApplicationTracker /></Layout></ProtectedRoute>} />
        <Route path="/referrals" element={<ProtectedRoute><Layout><Referrals /></Layout></ProtectedRoute>} />
        <Route path="/resume" element={<ProtectedRoute><Layout><ResumeBuilder /></Layout></ProtectedRoute>} />
        <Route path="/ai-matching" element={<ProtectedRoute><Layout><MentorBrowse /></Layout></ProtectedRoute>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

export default function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AuthProvider>
        <SocketProvider>
          <NotificationProvider>
            <AppRoutes />
          </NotificationProvider>
        </SocketProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
