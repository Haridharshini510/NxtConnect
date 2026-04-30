import { useEffect, useState } from 'react';
import api from '../api/axios';
import JobCard from '../components/common/JobCard';
import { useAuth } from '../context/AuthContext';
import { Search, Plus, X, Gift } from 'lucide-react';
import { JobCardSkeleton } from '../components/ui';
import toast from 'react-hot-toast';

const JOB_TYPES = ['full-time', 'part-time', 'internship', 'contract'];

export default function Jobs() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [referralOnly, setReferralOnly] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ company: '', title: '', location: '', type: 'full-time', description: '', applicationUrl: '', isReferralAvailable: false, skills: '' });
  const [submitting, setSubmitting] = useState(false);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (typeFilter) params.type = typeFilter;
      if (referralOnly) params.referral = 'true';
      const res = await api.get('/jobs', { params });
      setJobs(res.data.jobs);
    } catch { } finally { setLoading(false); }
  };

  useEffect(() => { fetchJobs(); }, [search, typeFilter, referralOnly]);

  const handlePost = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/jobs', { ...form, skills: form.skills.split(',').map(s => s.trim()).filter(Boolean) });
      toast.success('Job posted!');
      setShowForm(false);
      setForm({ company: '', title: '', location: '', type: 'full-time', description: '', applicationUrl: '', isReferralAvailable: false, skills: '' });
      fetchJobs();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to post job');
    } finally { setSubmitting(false); }
  };

  const set = (f) => (e) => setForm({ ...form, [f]: e.target.value });

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 pb-20 md:pb-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Job Board</h1>
          <p className="text-slate-600 text-sm mt-1">{jobs.length} opportunities</p>
        </div>
        {user?.role === 'mentor' && (
          <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center gap-1 text-sm">
            <Plus size={16} /> Post Job
          </button>
        )}
      </div>

      {/* Post job form */}
      {showForm && (
        <div className="card mb-6 border-primary-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-slate-900">Post a New Job</h2>
            <button onClick={() => setShowForm(false)}><X size={18} className="text-slate-500" /></button>
          </div>
          <form onSubmit={handlePost} className="grid sm:grid-cols-2 gap-4">
            <div><label className="block text-xs font-medium text-slate-700 mb-1">Job Title *</label><input className="input" value={form.title} onChange={set('title')} required /></div>
            <div><label className="block text-xs font-medium text-slate-700 mb-1">Company *</label><input className="input" value={form.company} onChange={set('company')} required /></div>
            <div><label className="block text-xs font-medium text-slate-700 mb-1">Location</label><input className="input" placeholder="Remote / Chennai" value={form.location} onChange={set('location')} /></div>
            <div><label className="block text-xs font-medium text-slate-700 mb-1">Type</label>
              <select className="input" value={form.type} onChange={set('type')}>
                {JOB_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div className="sm:col-span-2"><label className="block text-xs font-medium text-slate-700 mb-1">Description *</label><textarea className="input resize-none" rows={3} value={form.description} onChange={set('description')} required /></div>
            <div><label className="block text-xs font-medium text-slate-700 mb-1">Application URL</label><input className="input" placeholder="https://..." value={form.applicationUrl} onChange={set('applicationUrl')} /></div>
            <div><label className="block text-xs font-medium text-slate-700 mb-1">Skills (comma separated)</label><input className="input" placeholder="React, Node.js" value={form.skills} onChange={set('skills')} /></div>
            <div className="sm:col-span-2 flex items-center gap-2">
              <input type="checkbox" id="referral" checked={form.isReferralAvailable} onChange={(e) => setForm({ ...form, isReferralAvailable: e.target.checked })} className="rounded" />
              <label htmlFor="referral" className="text-sm text-slate-700">I can provide a referral for this role</label>
            </div>
            <div className="sm:col-span-2 flex justify-end">
              <button type="submit" className="btn-primary" disabled={submitting}>{submitting ? 'Posting...' : 'Post Job'}</button>
            </div>
          </form>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input className="input pl-9" placeholder="Search jobs..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-2 flex-wrap">
          {JOB_TYPES.map((t) => (
            <button key={t} onClick={() => setTypeFilter(typeFilter === t ? '' : t)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium capitalize transition-colors ${typeFilter === t ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-700'}`}>
              {t}
            </button>
          ))}
          <button onClick={() => setReferralOnly(!referralOnly)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${referralOnly ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-700'}`}>
            <Gift size={14} className="inline mr-1" /> Referral only
          </button>
        </div>
      </div>

      {/* Jobs grid */}
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(6)].map((_, i) => <JobCardSkeleton key={i} />)}
        </div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-20 text-slate-500">No jobs found</div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {jobs.map((job) => <JobCard key={job._id} job={job} />)}
        </div>
      )}
    </main>
  );
}


