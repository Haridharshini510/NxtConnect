import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Gift, Plus, X, CheckCircle, XCircle, Clock, Send, ExternalLink } from 'lucide-react';

const STATUS_CONFIG = {
  pending: { label: 'Pending', chip: 'status-chip-warning', icon: Clock },
  approved: { label: 'Approved', chip: 'status-chip-neutral', icon: CheckCircle },
  declined: { label: 'Declined', chip: 'status-chip-danger', icon: XCircle },
  referred: { label: 'Referred', chip: 'status-chip-success', icon: CheckCircle },
};

export default function Referrals() {
  const { user } = useAuth();
  const [referrals, setReferrals] = useState([]);
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [responding, setResponding] = useState(null);
  const [mentorNote, setMentorNote] = useState({});
  const [form, setForm] = useState({ mentorId: '', jobTitle: '', company: '', jobUrl: '', message: '' });

  const fetchData = async () => {
    try {
      const [refRes, connRes] = await Promise.all([api.get('/referrals'), api.get('/connections/my')]);
      setReferrals(refRes.data.referrals || []);
      if (user.role === 'student') {
        setConnections((connRes.data.connections || []).filter((c) => c.status === 'active'));
      }
    } catch {
      toast.error('Failed to load referrals');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRequest = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/referrals', form);
      toast.success('Referral request sent');
      setShowForm(false);
      setForm({ mentorId: '', jobTitle: '', company: '', jobUrl: '', message: '' });
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send request');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRespond = async (id, status) => {
    setResponding(id);
    try {
      await api.put(`/referrals/${id}/respond`, { status, mentorNote: mentorNote[id] || '' });
      toast.success(`Referral ${status}`);
      fetchData();
    } catch {
      toast.error('Failed to update referral');
    } finally {
      setResponding(null);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/referrals/${id}`);
      setReferrals((prev) => prev.filter((r) => r._id !== id));
      toast.success('Referral request withdrawn');
    } catch {
      toast.error('Failed to delete request');
    }
  };

  const set = (f) => (e) => setForm({ ...form, [f]: e.target.value });

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 pb-24 lg:pb-8">
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="section-headline">Referral requests</h1>
          <p className="section-subtle">
            {user.role === 'student'
              ? 'Request referrals from active mentors and track decisions.'
              : 'Review referral requests from your mentees.'}
          </p>
        </div>
        {user.role === 'student' && (
          <button onClick={() => setShowForm(!showForm)} className="btn-primary">
            <Plus size={15} /> Request referral
          </button>
        )}
      </div>

      {showForm && user.role === 'student' && (
        <div className="card mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-slate-900">New referral request</h2>
            <button onClick={() => setShowForm(false)}><X size={18} className="text-slate-400" /></button>
          </div>
          {connections.length === 0 ? (
            <div className="text-center py-8 text-sm text-slate-500">
              You need an active mentorship connection first.
              <a href="/mentors" className="text-blue-700 hover:underline ml-1">Browse mentors</a>
            </div>
          ) : (
            <form onSubmit={handleRequest} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Select mentor</label>
                <select className="input" value={form.mentorId} onChange={set('mentorId')} required>
                  <option value="">Choose a mentor...</option>
                  {connections.map((c) => {
                    const mentor = c.mentorId;
                    return (
                      <option key={mentor._id} value={mentor._id}>
                        {mentor.name} - {mentor.industry || 'Mentor'}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Job title</label>
                  <input className="input" value={form.jobTitle} onChange={set('jobTitle')} placeholder="Software Engineer Intern" required />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Company</label>
                  <input className="input" value={form.company} onChange={set('company')} placeholder="Google" required />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Job posting URL</label>
                <input className="input" value={form.jobUrl} onChange={set('jobUrl')} placeholder="https://..." />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Message to mentor</label>
                <textarea className="input resize-none" rows={3} maxLength={1000} value={form.message} onChange={set('message')} />
              </div>
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary" disabled={submitting}>
                  <Send size={14} /> {submitting ? 'Sending...' : 'Send request'}
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {loading ? (
        <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="card h-32 animate-pulse bg-slate-100" />)}</div>
      ) : referrals.length === 0 ? (
        <div className="card text-center py-16">
          <Gift size={40} className="mx-auto mb-3 text-slate-300" />
          <p className="text-lg font-medium text-slate-700">No referral requests yet</p>
          <p className="text-sm mt-1 text-slate-500">
            {user.role === 'student'
              ? 'Ask a mentor to refer you for your target role.'
              : 'Referral requests from mentees will appear here.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {referrals.map((ref) => {
            const statusCfg = STATUS_CONFIG[ref.status] || STATUS_CONFIG.pending;
            const StatusIcon = statusCfg.icon;
            const isMentor = user.role === 'mentor';
            const other = isMentor ? ref.studentId : ref.mentorId;

            return (
              <div key={ref._id} className="card">
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  <div className="w-11 h-11 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    {other?.profilePhoto ? (
                      <img src={other.profilePhoto} className="w-11 h-11 rounded-full object-cover" alt="" />
                    ) : (
                      <span className="text-blue-700 font-bold">{other?.name?.[0]}</span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="font-semibold text-slate-900">{other?.name}</span>
                      <span className={statusCfg.chip}>
                        <StatusIcon size={11} /> {statusCfg.label}
                      </span>
                    </div>
                    <p className="text-sm text-slate-800 font-medium">
                      {ref.jobTitle} at <span className="text-blue-700">{ref.company}</span>
                    </p>
                    {ref.jobUrl && (
                      <a href={ref.jobUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-slate-500 hover:text-blue-700 inline-flex items-center gap-1 mt-1">
                        <ExternalLink size={11} /> View job posting
                      </a>
                    )}
                    {ref.message && <p className="text-sm text-slate-600 mt-2 italic">"{ref.message}"</p>}
                    {ref.mentorNote && (
                      <p className="text-sm text-slate-600 mt-2 bg-slate-50 px-3 py-2 rounded-lg">
                        <span className="font-semibold">Mentor note:</span> {ref.mentorNote}
                      </p>
                    )}
                    <p className="text-xs text-slate-500 mt-2">Requested on {new Date(ref.createdAt).toLocaleDateString()}</p>
                  </div>

                  <div className="flex flex-col gap-2 sm:min-w-[180px]">
                    {isMentor && ref.status === 'pending' && (
                      <div className="space-y-2">
                        <textarea
                          className="input text-xs resize-none w-full"
                          rows={2}
                          placeholder="Add a note (optional)"
                          value={mentorNote[ref._id] || ''}
                          onChange={(e) => setMentorNote({ ...mentorNote, [ref._id]: e.target.value })}
                        />
                        <div className="flex gap-2">
                          <button onClick={() => handleRespond(ref._id, 'approved')} disabled={responding === ref._id} className="btn-primary flex-1 !px-2 !py-1.5 !text-xs">Approve</button>
                          <button onClick={() => handleRespond(ref._id, 'declined')} disabled={responding === ref._id} className="btn-secondary flex-1 !px-2 !py-1.5 !text-xs">Decline</button>
                        </div>
                      </div>
                    )}
                    {isMentor && ref.status === 'approved' && (
                      <button onClick={() => handleRespond(ref._id, 'referred')} disabled={responding === ref._id} className="btn-primary !text-xs !py-1.5">
                        Mark as referred
                      </button>
                    )}
                    {!isMentor && ref.status === 'pending' && (
                      <button onClick={() => handleDelete(ref._id)} className="btn-secondary !text-xs !py-1.5 text-red-600">
                        Withdraw request
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
