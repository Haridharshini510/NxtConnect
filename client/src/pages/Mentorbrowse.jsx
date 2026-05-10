import { useEffect, useState } from 'react';
import api from '../api/axios';
import MentorCard from '../components/mentor/MentorCard';
import { MentorCardSkeleton } from '../components/ui';
import { Search, Filter, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const INDUSTRIES = ['All', 'Technology', 'Finance', 'Healthcare', 'Design', 'Marketing', 'Data Science', 'Consulting'];

export default function MentorBrowse() {
  const { user } = useAuth();
  const [mentors, setMentors] = useState([]);
  const [connectedMentorIds, setConnectedMentorIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [matchMode, setMatchMode] = useState(false);
  const [industry, setIndustry] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchConnections = async () => {
      if (user?.role !== 'student') {
        setConnectedMentorIds(new Set());
        return;
      }

      try {
        const res = await api.get('/connections/my');
        const ids = (res.data.connections || [])
          .filter((conn) => conn.status !== 'declined')
          .map((conn) => conn.mentorId?._id || conn.mentorId)
          .filter(Boolean)
          .map((id) => id.toString());
        setConnectedMentorIds(new Set(ids));
      } catch (e) {
        console.error('Failed to load connections for mentor filtering', e);
        setConnectedMentorIds(new Set());
      }
    };

    fetchConnections();
  }, [user?.role]);

  const fetchMentors = async (matched = false) => {
    setLoading(true);
    try {
      const endpoint = matched ? '/ai/matched-mentors' : '/mentors';
      const params = !matched && industry !== 'All' ? { industry } : {};
      const res = await api.get(endpoint, { params });
      setMentors(res.data.mentors || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMentors(matchMode);
  }, [matchMode, industry]);

  const visibleMentors = mentors.filter((m) => {
    if (user?.role !== 'student') return true;
    const mentorUser = m.userId || m;
    const mentorId = mentorUser?._id?.toString();
    return mentorId ? !connectedMentorIds.has(mentorId) : true;
  });

  const filtered = search
    ? visibleMentors.filter((m) => {
        const u = m.userId || m;
        return (
          u.name?.toLowerCase().includes(search.toLowerCase()) ||
          u.industry?.toLowerCase().includes(search.toLowerCase())
        );
      })
    : visibleMentors;

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 md:pb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="section-headline">{matchMode ? 'AI mentor matching' : 'Find a mentor'}</h1>
          <p className="section-subtle">
            {matchMode
              ? `Showing mentor recommendations ranked for your profile (${filtered.length} results)`
              : `${filtered.length} mentors available`}
          </p>
        </div>
        {user?.role === 'student' && (
          <button
            onClick={() => setMatchMode(!matchMode)}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm ${
              matchMode ? 'bg-primary-700 text-white' : 'bg-primary-50 text-primary-700 hover:bg-primary-100'
            }`}
          >
            <Sparkles size={16} />
            {matchMode ? 'Switch to standard view' : 'Use AI match'}
          </button>
        )}
      </div>

      <div className="card mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              className="input pl-9"
              placeholder="Search mentors by name or industry"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          {!matchMode && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <span className="status-chip-neutral whitespace-nowrap"><Filter size={12} />Industry</span>
              {INDUSTRIES.map((ind) => (
                <button
                  key={ind}
                  onClick={() => setIndustry(ind)}
                  className={`whitespace-nowrap px-3 py-1.5 rounded-full text-sm font-medium ${
                    industry === ind ? 'bg-primary-700 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {ind}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(6)].map((_, i) => (
            <MentorCardSkeleton key={i} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="card text-center py-16">
          <p className="text-lg font-medium text-slate-700">No mentors found</p>
          <p className="text-sm mt-1 text-slate-500">Try changing filters or search terms.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((mentor) => (
            <MentorCard
              key={mentor._id}
              mentor={mentor}
              matchScore={matchMode ? mentor.matchScore : undefined}
            />
          ))}
        </div>
      )}
    </main>
  );
}

