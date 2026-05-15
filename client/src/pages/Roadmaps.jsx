import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { Map, Clock, ArrowRight, Plus, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Roadmaps() {
  const { user } = useAuth();
  const [roadmaps, setRoadmaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    title: '',
    category: '',
    description: '',
    tags: '',
    stepsText: '',
  });

  const fetchRoadmaps = async () => {
    setLoading(true);
    try {
      const r = await api.get('/roadmaps');
      setRoadmaps(r.data.roadmaps);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load roadmaps');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoadmaps();
  }, []);

  const set = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleCreateRoadmap = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const parsedSteps = form.stepsText
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean)
        .map((title, idx) => ({
          order: idx + 1,
          title,
          description: '',
          estimatedWeeks: 0,
          resources: [],
          skills: [],
        }));

      await api.post('/roadmaps', {
        title: form.title,
        category: form.category,
        description: form.description,
        tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
        steps: parsedSteps,
      });

      toast.success('Roadmap added');
      setShowForm(false);
      setForm({ title: '', category: '', description: '', tags: '', stepsText: '' });
      fetchRoadmaps();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add roadmap');
    } finally {
      setSubmitting(false);
    }
  };

  const totalWeeks = (roadmap) => roadmap.steps?.reduce((acc, s) => acc + (s.estimatedWeeks || 0), 0) || 0;

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 md:pb-8">
      <div className="flex items-center justify-between mb-2">
        <h1 className="section-headline">Career Roadmaps</h1>
        {(user?.role === 'mentor' || user?.role === 'admin') && (
          <button onClick={() => setShowForm((v) => !v)} className="btn-primary flex items-center gap-1 text-sm">
            <Plus size={16} /> Add Roadmap
          </button>
        )}
      </div>
      <p className="text-slate-600 text-sm mb-8">Step-by-step paths curated by industry mentors</p>

      {showForm && (
        <div className="card mb-6 border-brand-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-slate-900">Create Roadmap</h2>
            <button onClick={() => setShowForm(false)}><X size={18} className="text-slate-500" /></button>
          </div>

          <form onSubmit={handleCreateRoadmap} className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Title *</label>
              <input className="input" value={form.title} onChange={set('title')} required />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Category *</label>
              <input className="input" value={form.category} onChange={set('category')} required />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-slate-700 mb-1">Description *</label>
              <textarea className="input resize-none" rows={3} value={form.description} onChange={set('description')} required />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-slate-700 mb-1">Tags (comma separated)</label>
              <input className="input" placeholder="Frontend, DSA, Interview" value={form.tags} onChange={set('tags')} />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-slate-700 mb-1">Steps (one per line)</label>
              <textarea className="input resize-none" rows={5} value={form.stepsText} onChange={set('stepsText')} placeholder="Learn basics&#10;Build projects&#10;Prepare for interviews" />
            </div>
            <div className="sm:col-span-2 flex justify-end">
              <button type="submit" className="btn-primary" disabled={submitting}>
                {submitting ? 'Adding...' : 'Add Roadmap'}
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card p-4 space-y-3">
              <div className="h-4 bg-gradient-to-r from-slate-100 via-slate-50 to-slate-100 animate-shimmer rounded w-3/4" />
              <div className="space-y-2">
                <div className="h-3 bg-gradient-to-r from-slate-100 via-slate-50 to-slate-100 animate-shimmer rounded" />
                <div className="h-3 bg-gradient-to-r from-slate-100 via-slate-50 to-slate-100 animate-shimmer rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      ) : roadmaps.length === 0 ? (
        <div className="text-center py-20 text-slate-500">
          <Map size={48} className="mx-auto mb-4 opacity-30" />
          <p>No roadmaps published yet. Check back soon!</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {roadmaps.map((rm) => (
            <div key={rm._id} className="card hover:shadow-md transition-shadow flex flex-col gap-3">
              <div className="w-10 h-10 bg-brand-100 rounded-lg flex items-center justify-center">
                <Map size={20} className="text-brand-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">{rm.title}</h3>
                <p className="text-sm text-slate-600 mt-0.5">{rm.category}</p>
              </div>
              {rm.description && <p className="text-sm text-slate-700 line-clamp-2">{rm.description}</p>}
              <div className="flex items-center gap-3 text-xs text-slate-500">
                <span>{rm.steps?.length || 0} steps</span>
                {totalWeeks(rm) > 0 && (
                  <span className="flex items-center gap-1"><Clock size={11} /> ~{totalWeeks(rm)} weeks</span>
                )}
              </div>
              {rm.tags?.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {rm.tags.slice(0, 3).map((t) => (
                    <span key={t} className="text-xs bg-brand-50 text-brand-600 px-2 py-0.5 rounded-full">{t}</span>
                  ))}
                </div>
              )}
              <Link to={`/roadmaps/${rm._id}`} className="btn-primary text-center text-sm mt-auto flex items-center justify-center gap-1">
                View Roadmap <ArrowRight size={14} />
              </Link>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}


