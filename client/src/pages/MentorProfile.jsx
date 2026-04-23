import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Star, Users, Briefcase, LinkedinIcon, CheckCircle, Calendar } from 'lucide-react';

export default function MentorProfile() {
  const { userId } = useParams();
  const { user } = useAuth();
  const [mentor, setMentor] = useState(null);
  const [mentorUser, setMentorUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [requesting, setRequesting] = useState(false);
  const [requested, setRequested] = useState(false);
  const [message, setMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showCalendly, setShowCalendly] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get(`/mentors/${userId}`);
        setMentor(res.data.mentorProfile || {});
        setMentorUser(res.data);
      } catch {
        toast.error('Mentor not found');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [userId]);

  // Load Calendly widget script once
  useEffect(() => {
    if (showCalendly) {
      const script = document.createElement('script');
      script.src = 'https://assets.calendly.com/assets/external/widget.js';
      script.async = true;
      document.body.appendChild(script);
      return () => document.body.removeChild(script);
    }
  }, [showCalendly]);

  const handleConnect = async () => {
    setRequesting(true);
    try {
      await api.post('/connections/request', { mentorId: userId, requestMessage: message });
      toast.success('Connection request sent!');
      setRequested(true);
      setShowModal(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send request');
    } finally {
      setRequesting(false);
    }
  };

  if (loading) return <div className="flex h-96 items-center justify-center text-gray-400">Loading...</div>;
  if (!mentor) return <div className="text-center py-20 text-gray-400">Mentor not found</div>;

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 pb-24 lg:pb-8">
      {/* Header card */}
      <div className="card mb-6">
        <div className="flex flex-col sm:flex-row gap-6">
          {mentorUser?.profilePhoto ? (
            <img src={mentorUser.profilePhoto} className="w-24 h-24 rounded-full object-cover flex-shrink-0" alt={mentorUser.name} />
          ) : (
            <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
              <span className="text-4xl font-bold text-blue-600">{mentorUser?.name?.[0]}</span>
            </div>
          )}
          <div className="flex-1">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{mentorUser?.name}</h1>
                <p className="text-gray-500">{mentor.jobTitle} at {mentor.currentCompany}</p>
                {mentorUser?.industry && (
                  <span className="inline-block mt-2 text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">{mentorUser.industry}</span>
                )}
              </div>
              {user?.role === 'student' && (
                <div className="flex flex-col gap-2">
                  {requested ? (
                    <span className="flex items-center gap-1 text-green-600 font-medium text-sm">
                      <CheckCircle size={16} /> Request Sent
                    </span>
                  ) : (
                    <button onClick={() => setShowModal(true)} disabled={!mentor.isAvailable}
                      className="btn-primary disabled:opacity-50">
                      {mentor.isAvailable ? 'Request Mentorship' : 'Not Available'}
                    </button>
                  )}
                  {/* Calendly book session */}
                  {mentor.linkedinUrl?.includes('calendly') ? (
                    <button onClick={() => setShowCalendly(!showCalendly)}
                      className="btn-secondary flex items-center gap-1.5 text-sm">
                      <Calendar size={14} /> Book a Session
                    </button>
                  ) : mentor.linkedinUrl && (
                    <a href={mentor.linkedinUrl} target="_blank" rel="noopener noreferrer"
                      className="btn-secondary flex items-center gap-1.5 text-sm">
                      <LinkedinIcon size={14} /> LinkedIn
                    </a>
                  )}
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-500">
              <span className="flex items-center gap-1"><Briefcase size={14} /> {mentor.yearsOfExperience} yrs exp</span>
              <span className="flex items-center gap-1"><Users size={14} /> {mentor.currentMenteesCount}/{mentor.maxMentees} mentees</span>
              {mentor.rating > 0 && (
                <span className="flex items-center gap-1"><Star size={14} className="text-yellow-400" /> {mentor.rating.toFixed(1)}</span>
              )}
            </div>
          </div>
        </div>

        {mentorUser?.bio && (
          <p className="mt-4 text-gray-600 text-sm leading-relaxed border-t border-gray-50 pt-4">{mentorUser.bio}</p>
        )}
      </div>

      {/* Calendly embed */}
      {showCalendly && mentor.linkedinUrl?.includes('calendly') && (
        <div className="card mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2">
              <Calendar size={16} className="text-blue-500" /> Book a Session
            </h2>
            <button onClick={() => setShowCalendly(false)} className="text-xs text-gray-400 hover:text-gray-600">Close</button>
          </div>
          <div
            className="calendly-inline-widget rounded-xl overflow-hidden"
            data-url={mentor.linkedinUrl}
            style={{ minWidth: '320px', height: '630px' }}
          />
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-6">
        {mentorUser?.skills?.length > 0 && (
          <div className="card">
            <h2 className="font-semibold text-gray-900 mb-3">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {mentorUser.skills.map((s) => (
                <span key={s} className="text-sm bg-gray-100 text-gray-600 px-3 py-1 rounded-full">{s}</span>
              ))}
            </div>
          </div>
        )}
        {mentor.expertise?.length > 0 && (
          <div className="card">
            <h2 className="font-semibold text-gray-900 mb-3">Areas of Expertise</h2>
            <div className="flex flex-wrap gap-2">
              {mentor.expertise.map((e) => (
                <span key={e} className="text-sm bg-blue-50 text-blue-600 px-3 py-1 rounded-full">{e}</span>
              ))}
            </div>
          </div>
        )}
      </div>

      {Array.isArray(mentor.careerJourney) && mentor.careerJourney.length > 0 && (
        <div className="card mt-6">
          <h2 className="font-semibold text-gray-900 mb-4">Career Journey</h2>
          <div className="space-y-4">
            {mentor.careerJourney.map((item, i) => (
              <div key={i} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 rounded-full bg-blue-500 mt-1" />
                  {i < mentor.careerJourney.length - 1 && <div className="w-0.5 bg-gray-200 flex-1 mt-1" />}
                </div>
                <div className="pb-4">
                  <div className="text-sm font-medium text-gray-900">{item.role}</div>
                  <div className="text-sm text-gray-500">{item.company} · {item.year}</div>
                  {item.description && <p className="text-xs text-gray-400 mt-1">{item.description}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Connect modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h3 className="text-lg font-bold text-gray-900 mb-1">Send connection request</h3>
            <p className="text-sm text-gray-500 mb-4">Introduce yourself to {mentorUser?.name}</p>
            <textarea className="input resize-none" rows={4}
              placeholder="Hi! I'm a final-year CS student interested in backend development..."
              value={message} onChange={(e) => setMessage(e.target.value)} maxLength={500} />
            <p className="text-xs text-gray-400 mt-1 text-right">{message.length}/500</p>
            <div className="flex gap-3 mt-4">
              <button onClick={() => setShowModal(false)} className="btn-secondary flex-1">Cancel</button>
              <button onClick={handleConnect} className="btn-primary flex-1" disabled={requesting}>
                {requesting ? 'Sending...' : 'Send Request'}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
