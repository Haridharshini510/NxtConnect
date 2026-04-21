import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { Users, Briefcase, Map, ArrowRight, MessageSquare } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ connections: 0, jobs: 0, roadmaps: 0 });
  const [recentConnections, setRecentConnections] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [connRes, jobRes, roadmapRes] = await Promise.all([
          api.get('/connections/my'),
          api.get('/jobs?limit=1'),
          api.get('/roadmaps'),
        ]);
        setStats({
          connections: connRes.data.connections.length,
          jobs: jobRes.data.total,
          roadmaps: roadmapRes.data.roadmaps.length,
        });
        setRecentConnections(connRes.data.connections.slice(0, 3));
      } catch (e) {
        console.error(e);
      }
    };
    fetchStats();
  }, []);

  const quickLinks = [
    { to: '/mentors', icon: Users, label: 'Find Mentors', color: 'bg-blue-500', desc: 'Browse and connect with mentors' },
    { to: '/jobs', icon: Briefcase, label: 'Job Board', color: 'bg-emerald-500', desc: 'Explore opportunities' },
    { to: '/roadmaps', icon: Map, label: 'Career Roadmaps', color: 'bg-purple-500', desc: 'Plan your path' },
    { to: '/connections', icon: MessageSquare, label: 'My Connections', color: 'bg-orange-500', desc: 'View your network' },
  ];

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 md:pb-8">
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p className="text-gray-500 mt-1">
          {user?.role === 'mentor'
            ? 'See who wants to connect with you and manage your mentorship.'
            : 'Continue your career journey. Your next opportunity is one connection away.'}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Connections', value: stats.connections, icon: Users },
          { label: 'Jobs Available', value: stats.jobs, icon: Briefcase },
          { label: 'Roadmaps', value: stats.roadmaps, icon: Map },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="card text-center">
            <Icon size={20} className="text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{value}</div>
            <div className="text-xs text-gray-500">{label}</div>
          </div>
        ))}
      </div>

      {/* Quick links */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick actions</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickLinks.map(({ to, icon: Icon, label, color, desc }) => (
            <Link key={to} to={to} className="card hover:shadow-md transition-shadow flex flex-col gap-3 group">
              <div className={`w-10 h-10 ${color} rounded-lg flex items-center justify-center`}>
                <Icon size={20} className="text-white" />
              </div>
              <div>
                <div className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors flex items-center gap-1">
                  {label} <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="text-xs text-gray-500 mt-0.5">{desc}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent connections */}
      {recentConnections.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent connections</h2>
            <Link to="/connections" className="text-sm text-blue-600 hover:underline">View all</Link>
          </div>
          <div className="space-y-3">
            {recentConnections.map((conn) => {
              const other = user.role === 'mentor' ? conn.studentId : conn.mentorId;
              const chatRoomId = conn.chatRoomId?._id || conn.chatRoomId;
              return (
                <div key={conn._id} className="card flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 font-bold">{other?.name?.[0]}</span>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm text-gray-900">{other?.name}</div>
                    <div className="text-xs text-gray-400 capitalize">{conn.status}</div>
                  </div>
                  {conn.status === 'active' && chatRoomId && (
                    <Link to={`/chat/${chatRoomId}`} className="text-blue-600 hover:text-blue-700">
                      <MessageSquare size={18} />
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Profile completion nudge */}
      {!user?.bio && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-between">
          <div>
            <div className="font-medium text-blue-800 text-sm">Complete your profile</div>
            <div className="text-xs text-blue-600 mt-0.5">A complete profile gets 3x more connection requests.</div>
          </div>
          <Link to="/profile/edit" className="btn-primary text-sm whitespace-nowrap">Edit Profile</Link>
        </div>
      )}
    </main>
  );
}
