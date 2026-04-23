import { useEffect, useState } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { Plus, X, ExternalLink, Edit2, Trash2, Calendar, KanbanSquare } from 'lucide-react';

const COLUMNS = [
  { key: 'saved', label: 'Saved', color: 'border-slate-300' },
  { key: 'applied', label: 'Applied', color: 'border-blue-500' },
  { key: 'interview', label: 'Interview', color: 'border-amber-500' },
  { key: 'offer', label: 'Offer', color: 'border-emerald-500' },
  { key: 'rejected', label: 'Rejected', color: 'border-red-400' },
  { key: 'withdrawn', label: 'Withdrawn', color: 'border-slate-400' },
];

const PRIORITY_COLORS = {
  low: 'status-chip-neutral',
  medium: 'status-chip-warning',
  high: 'status-chip-danger',
};

const TYPE_COLORS = {
  'full-time': 'status-chip-neutral',
  internship: 'status-chip-neutral',
  'part-time': 'status-chip-neutral',
  contract: 'status-chip-neutral',
};

const emptyForm = {
  company: '',
  role: '',
  jobUrl: '',
  location: '',
  type: 'full-time',
  status: 'saved',
  appliedDate: '',
  salary: '',
  notes: '',
  priority: 'medium',
  source: '',
};

export default function ApplicationTracker() {
  const [grouped, setGrouped] = useState({ saved: [], applied: [], interview: [], offer: [], rejected: [], withdrawn: [] });
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editApp, setEditApp] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [dragging, setDragging] = useState(null);

  const fetchData = async () => {
    try {
      const [appRes, statRes] = await Promise.all([api.get('/applications'), api.get('/applications/stats')]);
      setGrouped(appRes.data.grouped || {});
      setStats(statRes.data.stats || null);
    } catch {
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editApp) {
        await api.put(`/applications/${editApp._id}`, form);
        toast.success('Application updated');
      } else {
        await api.post('/applications', form);
        toast.success('Application added');
      }
      setShowForm(false);
      setEditApp(null);
      setForm(emptyForm);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/applications/${id}`);
      toast.success('Application removed');
      fetchData();
    } catch {
      toast.error('Failed to delete');
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.put(`/applications/${id}`, { status: newStatus });
      fetchData();
    } catch {
      toast.error('Failed to update status');
    }
  };

  const openEdit = (app) => {
    setEditApp(app);
    setForm({
      company: app.company,
      role: app.role,
      jobUrl: app.jobUrl || '',
      location: app.location || '',
      type: app.type,
      status: app.status,
      appliedDate: app.appliedDate ? app.appliedDate.split('T')[0] : '',
      salary: app.salary || '',
      notes: app.notes || '',
      priority: app.priority,
      source: app.source || '',
    });
    setShowForm(true);
  };

  const set = (f) => (e) => setForm({ ...form, [f]: e.target.value });

  const onDragStart = (app) => setDragging(app);
  const onDrop = async (status) => {
    if (dragging && dragging.status !== status) await handleStatusChange(dragging._id, status);
    setDragging(null);
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 pb-24 lg:pb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="section-headline">Application tracker</h1>
          <p className="section-subtle">Track every opportunity from saved to final outcome.</p>
        </div>
        <button onClick={() => { setEditApp(null); setForm(emptyForm); setShowForm(true); }} className="btn-primary">
          <Plus size={15} /> Add application
        </button>
      </div>

      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 mb-6">
          {[
            { label: 'Total', value: stats.total },
            { label: 'Applied', value: stats.applied },
            { label: 'Interviews', value: stats.interview },
            { label: 'Offers', value: stats.offer },
            { label: 'Rejected', value: stats.rejected },
            { label: 'Response rate', value: `${stats.responseRate}%` },
          ].map(({ label, value }) => (
            <div key={label} className="card text-center py-3">
              <div className="text-lg font-semibold text-slate-900">{value}</div>
              <div className="text-xs text-slate-500">{label}</div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <div className="card w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-slate-900">{editApp ? 'Edit application' : 'Add application'}</h2>
              <button onClick={() => { setShowForm(false); setEditApp(null); }}><X size={18} className="text-slate-400" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2"><label className="block text-xs font-medium text-slate-600 mb-1">Company</label><input className="input" value={form.company} onChange={set('company')} required /></div>
                <div className="col-span-2"><label className="block text-xs font-medium text-slate-600 mb-1">Role</label><input className="input" value={form.role} onChange={set('role')} required /></div>
                <div><label className="block text-xs font-medium text-slate-600 mb-1">Type</label><select className="input" value={form.type} onChange={set('type')}>{['full-time', 'internship', 'part-time', 'contract'].map((t) => <option key={t}>{t}</option>)}</select></div>
                <div><label className="block text-xs font-medium text-slate-600 mb-1">Status</label><select className="input" value={form.status} onChange={set('status')}>{['saved', 'applied', 'interview', 'offer', 'rejected', 'withdrawn'].map((s) => <option key={s}>{s}</option>)}</select></div>
                <div><label className="block text-xs font-medium text-slate-600 mb-1">Priority</label><select className="input" value={form.priority} onChange={set('priority')}>{['low', 'medium', 'high'].map((p) => <option key={p}>{p}</option>)}</select></div>
                <div><label className="block text-xs font-medium text-slate-600 mb-1">Applied date</label><input type="date" className="input" value={form.appliedDate} onChange={set('appliedDate')} /></div>
                <div><label className="block text-xs font-medium text-slate-600 mb-1">Location</label><input className="input" value={form.location} onChange={set('location')} /></div>
                <div><label className="block text-xs font-medium text-slate-600 mb-1">Salary / stipend</label><input className="input" value={form.salary} onChange={set('salary')} placeholder="8 LPA" /></div>
                <div className="col-span-2"><label className="block text-xs font-medium text-slate-600 mb-1">Job URL</label><input className="input" value={form.jobUrl} onChange={set('jobUrl')} placeholder="https://..." /></div>
                <div className="col-span-2"><label className="block text-xs font-medium text-slate-600 mb-1">Source</label><input className="input" value={form.source} onChange={set('source')} placeholder="LinkedIn, Referral, Company Site" /></div>
                <div className="col-span-2"><label className="block text-xs font-medium text-slate-600 mb-1">Notes</label><textarea className="input resize-none" rows={3} value={form.notes} onChange={set('notes')} /></div>
              </div>
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => { setShowForm(false); setEditApp(null); }} className="btn-secondary flex-1">Cancel</button>
                <button type="submit" className="btn-primary flex-1" disabled={submitting}>{submitting ? 'Saving...' : editApp ? 'Update' : 'Add'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => <div key={i} className="card h-60 animate-pulse bg-slate-100" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6 gap-4">
          {COLUMNS.map(({ key, label, color }) => (
            <div
              key={key}
              className={`rounded-xl border-t-4 ${color} border bg-slate-50 p-3 min-h-[260px]`}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => onDrop(key)}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
                  <KanbanSquare size={14} />
                  {label}
                </h3>
                <span className="text-xs text-slate-500 bg-white px-2 py-0.5 rounded-full">{(grouped[key] || []).length}</span>
              </div>

              <div className="space-y-2">
                {(grouped[key] || []).map((app) => (
                  <div key={app._id} draggable onDragStart={() => onDragStart(app)} className="bg-white rounded-xl p-3 border border-slate-200">
                    <div className="flex items-start justify-between gap-1 mb-1">
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-900 text-xs truncate">{app.company}</p>
                        <p className="text-xs text-slate-500 truncate">{app.role}</p>
                      </div>
                      <div className="flex gap-1 flex-shrink-0">
                        <button onClick={() => openEdit(app)} className="text-slate-400 hover:text-blue-700"><Edit2 size={12} /></button>
                        <button onClick={() => handleDelete(app._id)} className="text-slate-400 hover:text-red-600"><Trash2 size={12} /></button>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1 mt-2">
                      <span className={TYPE_COLORS[app.type] || 'status-chip-neutral'}>{app.type}</span>
                      <span className={PRIORITY_COLORS[app.priority] || 'status-chip-neutral'}>{app.priority}</span>
                    </div>

                    {app.appliedDate && <p className="text-xs text-slate-500 mt-2 flex items-center gap-1"><Calendar size={10} /> {new Date(app.appliedDate).toLocaleDateString()}</p>}
                    {app.salary && <p className="text-xs text-emerald-700 font-medium mt-1">{app.salary}</p>}
                    {app.jobUrl && (
                      <a href={app.jobUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-700 hover:underline flex items-center gap-0.5 mt-1">
                        <ExternalLink size={10} /> View job
                      </a>
                    )}

                    <select
                      value={app.status}
                      onChange={(e) => handleStatusChange(app._id, e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      className="mt-2 w-full text-xs border border-slate-200 rounded-lg px-2 py-1 bg-slate-50 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      {['saved', 'applied', 'interview', 'offer', 'rejected', 'withdrawn'].map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                ))}
                {(grouped[key] || []).length === 0 && <div className="text-center py-6 text-slate-400 text-xs">Drop a card here</div>}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
