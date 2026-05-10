import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Calendar, Clock, Users, Video, PlayCircle, ExternalLink, ArrowLeft, CheckCircle } from 'lucide-react';
import { PageSkeleton } from '../components/ui';

export default function WorkshopDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [workshop, setWorkshop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  const [registering, setRegistering] = useState(false);

  const fetchWorkshop = async () => {
    try {
      const res = await api.get(`/workshops/${id}`);
      setWorkshop(res.data.workshop);
      const reg = res.data.workshop.attendees?.some(
        (a) => (a._id || a)?.toString() === user._id?.toString()
      );
      setIsRegistered(reg);
    } catch { toast.error('Workshop not found'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchWorkshop(); }, [id]);

  const handleRegister = async () => {
    setRegistering(true);
    try {
      await api.post(`/workshops/${id}/register`);
      toast.success('Registered! Check your email for details.');
      setIsRegistered(true);
      fetchWorkshop();
    } catch (err) { toast.error(err.response?.data?.message || 'Registration failed'); }
    finally { setRegistering(false); }
  };

  const handleUnregister = async () => {
    setRegistering(true);
    try {
      await api.delete(`/workshops/${id}/register`);
      toast.success('Unregistered');
      setIsRegistered(false);
      fetchWorkshop();
    } catch { toast.error('Failed'); }
    finally { setRegistering(false); }
  };

  if (loading) return <PageSkeleton variant="workshopDetail" />;
  if (!workshop) return <div className="text-center py-20 text-slate-500">Workshop not found</div>;

  const isPast = new Date(workshop.scheduledAt) < new Date();
  const isFull = workshop.attendees?.length >= workshop.maxCapacity;
  const host = workshop.hostId;

  return (
    <main className="max-w-4xl mr-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 lg:pb-8">
      <Link to="/workshops" className="flex items-center gap-1 text-sm text-slate-600 hover:text-primary-600 mb-6 transition-colors">
        <ArrowLeft size={14} /> Back to Workshops
      </Link>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header card */}
          <div className="card">
            <div className="flex items-start gap-3 mb-4">
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1 ${
                workshop.type === 'live' ? 'bg-red-50 text-red-600' : 'bg-brand-50 text-brand-600'
              }`}>
                {workshop.type === 'live' ? <Video size={11} /> : <PlayCircle size={11} />}
                {workshop.type === 'live' ? 'Live' : 'Recorded'}
              </span>
              {workshop.category && (
                <span className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full">{workshop.category}</span>
              )}
            </div>

            <h1 className="text-2xl font-bold text-slate-900 mb-3">{workshop.title}</h1>
            <p className="text-slate-700 leading-relaxed">{workshop.description}</p>

            {workshop.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {workshop.tags.map((t) => (
                  <span key={t} className="text-xs bg-primary-50 text-primary-600 px-2.5 py-1 rounded-full">{t}</span>
                ))}
              </div>
            )}
          </div>

          {/* Attendees */}
          {workshop.attendees?.length > 0 && (
            <div className="card">
              <h2 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <Users size={16} /> {workshop.attendees.length} Registered
              </h2>
              <div className="flex flex-wrap gap-2">
                {workshop.attendees.slice(0, 12).map((a) => (
                  <div key={a._id || a} className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center" title={a.name}>
                    {a.profilePhoto ? (
                      <img src={a.profilePhoto} className="w-9 h-9 rounded-full object-cover" alt={a.name} />
                    ) : (
                      <span className="text-primary-600 text-sm font-bold">{a.name?.[0] || '?'}</span>
                    )}
                  </div>
                ))}
                {workshop.attendees.length > 12 && (
                  <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center">
                    <span className="text-slate-600 text-xs font-medium">+{workshop.attendees.length - 12}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Meeting link (only for registered users) */}
          {isRegistered && workshop.meetingLink && !isPast && (
            <div className="card border-green-100 bg-green-50/30">
              <h2 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                <CheckCircle size={16} className="text-green-500" /> You're registered
              </h2>
              <p className="text-sm text-slate-700 mb-3">Here's your meeting link:</p>
              <a href={workshop.meetingLink} target="_blank" rel="noopener noreferrer"
                className="btn-primary flex items-center gap-2 w-fit text-sm">
                <ExternalLink size={14} /> Join Meeting
              </a>
            </div>
          )}

          {/* Recording (past workshops) */}
          {isPast && workshop.recordingUrl && (
            <div className="card">
              <h2 className="font-semibold text-slate-900 mb-2">Recording Available</h2>
              <a href={workshop.recordingUrl} target="_blank" rel="noopener noreferrer"
                className="btn-primary flex items-center gap-2 w-fit text-sm">
                <PlayCircle size={14} /> Watch Recording
              </a>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Date/time card */}
          <div className="card">
            <h2 className="font-semibold text-slate-900 mb-4">Event Details</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <Calendar size={16} className="text-primary-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-slate-900">
                    {new Date(workshop.scheduledAt).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                  <p className="text-slate-600">
                    {new Date(workshop.scheduledAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })} IST
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock size={16} className="text-primary-500 flex-shrink-0" />
                <span className="text-slate-800">{workshop.durationMinutes} minutes</span>
              </div>
              <div className="flex items-center gap-3">
                <Users size={16} className="text-primary-500 flex-shrink-0" />
                <span className="text-slate-800">
                  {workshop.attendees?.length || 0} / {workshop.maxCapacity} spots
                </span>
              </div>
            </div>

            <div className="mt-5">
              {isPast ? (
                <div className="text-center py-2 text-sm text-slate-500 bg-slate-50 rounded-lg">Event ended</div>
              ) : isRegistered ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 justify-center text-green-600 text-sm font-medium py-2">
                    <CheckCircle size={16} /> You're registered
                  </div>
                  <button onClick={handleUnregister} disabled={registering} className="btn-secondary w-full text-sm">
                    Cancel Registration
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleRegister}
                  disabled={registering || isFull}
                  className="btn-primary w-full disabled:opacity-50"
                >
                  {registering ? 'Registering...' : isFull ? 'Workshop Full' : workshop.isPaid ? `Register · ₹${workshop.price}` : 'Register Free'}
                </button>
              )}
            </div>
          </div>

          {/* Host card */}
          {host && (
            <div className="card">
              <p className="text-xs text-slate-500 uppercase font-medium mb-3">Hosted by</p>
              <div className="flex items-center gap-3">
                {host.profilePhoto ? (
                  <img src={host.profilePhoto} className="w-12 h-12 rounded-full object-cover" alt={host.name} />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                    <span className="text-primary-600 font-bold text-lg">{host.name?.[0]}</span>
                  </div>
                )}
                <div>
                  <p className="font-semibold text-slate-900">{host.name}</p>
                  <p className="text-sm text-slate-600">{host.industry}</p>
                </div>
              </div>
              {host.bio && <p className="text-sm text-slate-700 mt-3 line-clamp-3">{host.bio}</p>}
              <Link to={`/mentors/${host._id}`} className="block mt-3 text-sm text-primary-600 hover:underline">
                View profile →
              </Link>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}





