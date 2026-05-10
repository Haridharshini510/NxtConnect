import { useEffect, useState } from 'react';
import api from '../api/axios';
import ConnectionCard from '../components/student/ConnectionCard';
import toast from 'react-hot-toast';

export default function MyConnections() {
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const fetchConnections = async () => {
    try {
      const res = await api.get('/connections/my');
      setConnections(res.data.connections);
    } catch {
      toast.error('Failed to load connections');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchConnections(); }, []);

  const handleAccept = async (id) => {
    try {
      await api.put(`/connections/${id}/accept`);
      toast.success('Connection accepted!');
      fetchConnections();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to accept');
    }
  };

  const handleDecline = async (id) => {
    try {
      await api.put(`/connections/${id}/decline`);
      toast.success('Connection declined');
      fetchConnections();
    } catch {
      toast.error('Failed to decline');
    }
  };

  const filters = ['all', 'pending', 'active', 'declined'];
  const filtered = filter === 'all' ? connections : connections.filter((c) => c.status === filter);

  return (
    <main className="max-w-4xl mr-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 md:pb-8">
      <h1 className="section-headline mb-2">My Connections</h1>
      <p className="text-slate-600 text-sm mb-6">{connections.length} total connections</p>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-colors ${
              filter === f ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {f} {f === 'all' ? `(${connections.length})` : `(${connections.filter((c) => c.status === f).length})`}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="card p-4 space-y-2">
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-slate-100 via-slate-50 to-slate-100 animate-shimmer" />
                <div className="flex-1 space-y-1">
                  <div className="h-4 bg-gradient-to-r from-slate-100 via-slate-50 to-slate-100 animate-shimmer rounded w-3/4" />
                  <div className="h-3 bg-gradient-to-r from-slate-100 via-slate-50 to-slate-100 animate-shimmer rounded w-1/2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-slate-500">
          <p className="text-lg font-medium">No connections yet</p>
          <p className="text-sm mt-1">Browse mentors and send a connection request to get started.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((conn) => (
            <ConnectionCard key={conn._id} connection={conn} onAccept={handleAccept} onDecline={handleDecline} />
          ))}
        </div>
      )}
    </main>
  );
}




