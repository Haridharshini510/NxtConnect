import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import WorkshopCard from '../components/events/WorkshopCard';
import toast from 'react-hot-toast';
import { Plus, X, Calendar, CalendarClock, LayoutGrid } from 'lucide-react';

const CATEGORIES = ['Resume Review', 'Mock Interview', 'Industry Talk', 'Technical Workshop', 'Career Planning', 'Networking', 'Other'];

export default function Workshops() {
  const { user } = useAuth();
  const [workshops, setWorkshops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [registeredIds, setRegisteredIds] = useState(new Set());
  const [filter, setFilter] = useState('upcoming');
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    title: '', description: '', type: 'live', category: '',
    scheduledAt: '', durationMinutes: 60, meetingLink: '',
    maxCapacity: 100, tags: '', isPaid: false, price: 0,
  });

  const fetchWorkshops = async () => {
    setLoading(true);
    try {
      const params = filter === 'upcoming' ? { upcoming: 'true' } : {};
      const res = await api.get('/workshops', { params });
      setWorkshops(res.data.workshops);

      // Track which ones the user is registered for
      const ids = new Set(
        res.data.workshops
          .filter((w) => w.attendees?.some((a) => (a._id || a) === user._id || (a._id || a)?.toString() === user._id?.toString()))
          .map((w) => w._id)
      );
      setRegisteredIds(ids);
    } catch { toast.error('Failed to load workshops'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchWorkshops(); }, [filter]);

  const handleRegister = async (id) => {
    try {
      await api.post(`/workshops/${id}/register`);
      toast.success('Registered! Check your email for confirmation.');
      setRegisteredIds((prev) => new Set([...prev, id]));
      fetchWorkshops();
    } catch (err) { toast.error(err.response?.data?.message || 'Registration failed'); }
  };

  const handleUnregister = async (id) => {
    try {
      await api.delete(`/workshops/${id}/register`);
      toast.success('Unregistered successfully');
      setRegisteredIds((prev) => { const s = new Set(prev); s.delete(id); return s; });
      fetchWorkshops();
    } catch { toast.error('Failed to unregister'); }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/workshops', {
        ...form,
        durationMinutes: Number(form.durationMinutes),
        maxCapacity: Number(form.maxCapacity),
        price: Number(form.price),
        tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
      });
      toast.success('Workshop created!');
      setShowForm(false);
      setForm({ title: '', description: '', type: 'live', category: '', scheduledAt: '', durationMinutes: 60, meetingLink: '', maxCapacity: 100, tags: '', isPaid: false, price: 0 });
      fetchWorkshops();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to create'); }
    finally { setSubmitting(false); }
  };

  const set = (f) => (e) => setForm({ ...form, [f]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 lg:pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="section-headline">Workshops & Events</h1>
          <p className="text-slate-600 text-sm mt-1">Live sessions, mock interviews, and industry talks</p>
        </div>
        {(user?.role === 'mentor' || user?.role === 'admin') && (
          <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center gap-1.5 text-sm">
            <Plus size={16} /> Host Event
          </button>
        )}
      </div>

      {/* Create form */}
      {showForm && (
        <div className="card mb-8 border-brand-100">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-slate-900">Create a Workshop</h2>
            <button onClick={() => setShowForm(false)}><X size={18} className="text-slate-500" /></button>
          </div>
          <form onSubmit={handleCreate} className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-slate-700 mb-1">Title *</label>
              <input className="input" value={form.title} onChange={set('title')} required placeholder="e.g. Mock Interview Bootcamp" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-slate-700 mb-1">Description *</label>
              <textarea className="input resize-none" rows={3} value={form.description} onChange={set('description')} required />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Type</label>
              <select className="input" value={form.type} onChange={set('type')}>
                <option value="live">Live</option>
                <option value="recorded">Recorded</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Category</label>
              <select className="input" value={form.category} onChange={set('category')}>
                <option value="">Select…</option>
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Date & Time *</label>
              <input type="datetime-local" className="input" value={form.scheduledAt} onChange={set('scheduledAt')} required />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Duration (minutes)</label>
              <input type="number" className="input" value={form.durationMinutes} onChange={set('durationMinutes')} min="15" max="480" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Meeting Link</label>
              <input className="input" placeholder="https://meet.google.com/..." value={form.meetingLink} onChange={set('meetingLink')} />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Max Capacity</label>
              <input type="number" className="input" value={form.maxCapacity} onChange={set('maxCapacity')} min="1" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-slate-700 mb-1">Tags (comma separated)</label>
              <input className="input" placeholder="React, Backend, Interview Tips" value={form.tags} onChange={set('tags')} />
            </div>
            <div className="flex items-center gap-3">
              <input type="checkbox" id="isPaid" checked={form.isPaid} onChange={set('isPaid')} className="rounded" />
              <label htmlFor="isPaid" className="text-sm text-slate-800">Paid workshop</label>
            </div>
            {form.isPaid && (
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Price (₹)</label>
                <input type="number" className="input" value={form.price} onChange={set('price')} min="0" />
              </div>
            )}
            <div className="sm:col-span-2 flex justify-end">
              <button type="submit" className="btn-primary px-8" disabled={submitting}>
                {submitting ? 'Creating...' : 'Create Workshop'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6">
        {['upcoming', 'all'].map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-colors ${
              filter === f ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}>
                        <span className="inline-flex items-center gap-1.5">
              {f === 'upcoming' ? <CalendarClock size={14} /> : <LayoutGrid size={14} />}
              {f === 'upcoming' ? 'Upcoming' : 'All'}
            </span>
          </button>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="card p-4 space-y-3">
              <div className="h-32 bg-gradient-to-r from-slate-100 via-slate-50 to-slate-100 animate-shimmer rounded-lg" />
              <div className="space-y-2">
                <div className="h-4 bg-gradient-to-r from-slate-100 via-slate-50 to-slate-100 animate-shimmer rounded" />
                <div className="h-3 bg-gradient-to-r from-slate-100 via-slate-50 to-slate-100 animate-shimmer rounded w-3/4" />
              </div>
            </div>
          ))}
        </div>
      ) : workshops.length === 0 ? (
        <div className="text-center py-24 text-slate-500">
          <Calendar size={48} className="mx-auto mb-4 opacity-20" />
          <p className="text-lg font-medium">No workshops yet</p>
          <p className="text-sm mt-1">{user?.role === 'mentor' ? 'Host your first workshop above.' : 'Check back soon!'}</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {workshops.map((w) => (
            <WorkshopCard
              key={w._id}
              workshop={w}
              isRegistered={registeredIds.has(w._id)}
              onRegister={handleRegister}
              onUnregister={handleUnregister}
            />
          ))}
        </div>
      )}
    </main>
  );
}




