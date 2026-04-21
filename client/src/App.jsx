import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { SocketProvider } from './context/SocketContext';

// Phase 1 pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import MentorBrowse from './pages/MentorBrowse';
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

import Navbar from './components/layout/Navbar';

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

const Layout = ({ children }) => (
  <>
    <Navbar />
    {children}
  </>
);

const AppRoutes = () => {
  const { user } = useAuth();
  return (
    <>
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
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
