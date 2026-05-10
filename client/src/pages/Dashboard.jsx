import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { Users, Briefcase, Map, ArrowRight, MessageSquare, Rss } from 'lucide-react';
import { OnboardingModal, PageSkeleton } from '../components/ui';

export default function Dashboard() {
  const { user } = useAuth();
  const [feedPreview, setFeedPreview] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(() => {
    // Only show if not already dismissed and not completed on the account
    if (user?.onboardingCompleted) return false;
    return !localStorage.getItem(`onboarding_dismissed_${user?._id}`);
  });

  const handleOnboardingClose = () => {
    localStorage.setItem(`onboarding_dismissed_${user?._id}`, 'true');
    setShowOnboarding(false);
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const feedRes = await api.get('/feed', { params: { page: 1, limit: 4 } });
        setFeedPreview(feedRes.data.posts || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) return <PageSkeleton variant="dashboard" />;

  const quickLinks = [
    { to: '/mentors', icon: Users, label: 'Find mentors', color: 'bg-primary-700', desc: 'Browse and connect with mentors' },
    { to: '/jobs', icon: Briefcase, label: 'Job board', color: 'bg-emerald-600', desc: 'Explore opportunities' },
    { to: '/roadmaps', icon: Map, label: 'Career roadmaps', color: 'bg-brand-600', desc: 'Plan your path' },
    { to: '/connections', icon: MessageSquare, label: 'My connections', color: 'bg-amber-600', desc: 'Manage your network' },
  ];

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 md:pb-8">
      <div className="mb-8">
        <h1 className="section-headline">Welcome back, {user?.name?.split(' ')[0]}</h1>
        <p className="section-subtle">
          {user?.role === 'mentor'
            ? 'Review incoming requests and continue active mentorship relationships.'
            : 'Track your progress and focus on the next highest-impact action.'}
        </p>
      </div>

      <div className="mb-8">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Quick actions</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickLinks.map(({ to, icon: Icon, label, color, desc }) => (
            <Link key={to} to={to} className="card flex flex-col gap-3 group">
              <div className={`w-10 h-10 ${color} rounded-lg flex items-center justify-center`}>
                <Icon size={20} className="text-white" />
              </div>
              <div>
                <div className="font-semibold text-slate-900 group-hover:text-primary-700 transition-colors flex items-center gap-1">
                  {label} <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="text-xs text-slate-500 mt-0.5">{desc}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-900">Community feed</h2>
          <Link to="/feed" className="text-sm text-primary-700 hover:underline">View all</Link>
        </div>
        {feedPreview.length > 0 ? (
          <div className="space-y-3">
            {feedPreview.map((post) => {
              const author = post.authorId;
              return (
                <Link key={post._id} to="/feed" className="card block hover:border-blue-200 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-700 font-bold">{author?.name?.[0]}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-semibold text-slate-900 truncate">{author?.name || 'Community member'}</p>
                        {post.type && (
                          <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 capitalize">
                            {post.type}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-slate-700 line-clamp-2">{post.content}</p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="card text-center py-10">
            <Rss size={28} className="mx-auto text-slate-300 mb-2" />
            <p className="font-medium text-slate-700">No feed posts yet</p>
            <p className="text-sm text-slate-500 mt-1">Be the first to share something with the community.</p>
            <Link to="/feed" className="btn-primary mt-4">Open feed</Link>
          </div>
        )}
      </div>

      {!user?.bio && (
        <div className="mt-6 p-4 bg-primary-50 border border-primary-100 rounded-xl flex items-center justify-between gap-3">
          <div>
            <div className="font-medium text-primary-800 text-sm">Complete your profile</div>
            <div className="text-xs text-primary-700/80 mt-0.5">A complete profile improves matching quality and connection acceptance.</div>
          </div>
          <Link to="/profile/edit" className="btn-primary text-sm whitespace-nowrap">Edit profile</Link>
        </div>
      )}

      <OnboardingModal
        isOpen={showOnboarding}
        onClose={handleOnboardingClose}
      />
    </main>
  );
}



