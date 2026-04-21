import { useEffect, useState } from 'react';
import api from '../api/axios';
import MentorCard from '../components/mentor/MentorCard';
import { Search, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const INDUSTRIES = ['All', 'Technology', 'Finance', 'Healthcare', 'Design', 'Marketing', 'Data Science', 'Consulting'];

export default function MentorBrowse() {
  const { user } = useAuth();
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [matchMode, setMatchMode] = useState(false);
  const [industry, setIndustry] = useState('All');
  const [search, setSearch] = useState('');

  const fetchMentors = async (matched = false) => {
    setLoading(true);
    try {
      const endpoint = matched ? '/mentors/matched' : '/mentors';
      const params = !matched && industry !== 'All' ? { industry } : {};
      const res = await api.get(endpoint, { params });
      setMentors(matched ? res.data.mentors : res.data.mentors);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMentors(matchMode);
  }, [matchMode, industry]);

  const filtered = search
    ? mentors.filter((m) => {
        const u = m.userId || m;
        return u.name?.toLowerCase().includes(search.toLowerCase()) ||
          u.industry?.toLowerCase().includes(search.toLowerCase());
      })
    : mentors;

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 md:pb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Find a Mentor</h1>
          <p className="text-gray-500 text-sm mt-1">{mentors.length} mentors available</p>
        </div>
        {user?.role === 'student' && (
          <button
            onClick={() => setMatchMode(!matchMode)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
              matchMode ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
            }`}
          >
            <Sparkles size={16} />
            {matchMode ? 'Showing Matched' : 'Show Best Matches'}
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            className="input pl-9"
            placeholder="Search by name or industry..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        {!matchMode && (
          <div className="flex gap-2 overflow-x-auto pb-1">
            {INDUSTRIES.map((ind) => (
              <button
                key={ind}
                onClick={() => setIndustry(ind)}
                className={`whitespace-nowrap px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  industry === ind ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {ind}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Results */}
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="card h-64 animate-pulse bg-gray-100" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-lg font-medium">No mentors found</p>
          <p className="text-sm mt-1">Try adjusting your filters</p>
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