import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { PageSkeleton } from '../components/ui';

const INDUSTRIES = ['Technology', 'Finance', 'Healthcare', 'Design', 'Marketing', 'Data Science', 'Product Management', 'Consulting', 'Other'];

export default function EditProfile() {
  const { user, updateUser } = useAuth();
  const [saving, setSaving] = useState(false);
  const [loading] = useState(false); // profile data comes from auth context

  const [form, setForm] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    college: user?.college || '',
    graduationYear: user?.graduationYear || '',
    industry: user?.industry || '',
    skills: user?.skills?.join(', ') || '',
    careerGoals: user?.careerGoals?.join(', ') || '',
  });

  const [mentorForm, setMentorForm] = useState({
    currentCompany: '',
    jobTitle: '',
    yearsOfExperience: '',
    maxMentees: 3,
    isAvailable: true,
    expertise: '',
    linkedinUrl: '',
  });

  const set = (f) => (e) => setForm({ ...form, [f]: e.target.value });
  const setMentor = (f) => (e) => setMentorForm({ ...mentorForm, [f]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        graduationYear: form.graduationYear ? Number(form.graduationYear) : undefined,
        skills: form.skills.split(',').map((s) => s.trim()).filter(Boolean),
        careerGoals: form.careerGoals.split(',').map((s) => s.trim()).filter(Boolean),
      };
      const res = await api.put('/users/me', payload);
      updateUser(res.data.user);

      if (user?.role === 'mentor' && mentorForm.currentCompany) {
        await api.put('/users/me/mentor-profile', {
          ...mentorForm,
          yearsOfExperience: Number(mentorForm.yearsOfExperience),
          maxMentees: Number(mentorForm.maxMentees),
          expertise: mentorForm.expertise.split(',').map((s) => s.trim()).filter(Boolean),
        });
      }

      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  if (!user || loading) return <PageSkeleton variant="editProfile" />;

  return (
    <main className="max-w-2xl mr-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 md:pb-8">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Edit Profile</h1>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Basic Info */}
        <div className="card space-y-4">
          <h2 className="font-semibold text-slate-900 border-b border-slate-100 pb-2">Basic Information</h2>
          <div>
            <label className="block text-sm font-medium text-slate-800 mb-1">Full Name</label>
            <input className="input" value={form.name} onChange={set('name')} required />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-800 mb-1">Bio <span className="text-slate-500 font-normal">(max 500 chars)</span></label>
            <textarea className="input resize-none" rows={3} value={form.bio} onChange={set('bio')} maxLength={500} placeholder="Tell mentors and students about yourself..." />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-800 mb-1">College / University</label>
              <input className="input" value={form.college} onChange={set('college')} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-800 mb-1">Graduation Year</label>
              <input type="number" className="input" value={form.graduationYear} onChange={set('graduationYear')} min="1990" max="2035" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-800 mb-1">Industry</label>
            <select className="input" value={form.industry} onChange={set('industry')}>
              <option value="">Select industry</option>
              {INDUSTRIES.map((i) => <option key={i}>{i}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-800 mb-1">Skills <span className="text-slate-500 font-normal">(comma separated)</span></label>
            <input className="input" value={form.skills} onChange={set('skills')} placeholder="React, Node.js, Python..." />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-800 mb-1">
              {user?.role === 'student' ? 'Career Goals' : 'Areas of Expertise'} <span className="text-slate-500 font-normal">(comma separated)</span>
            </label>
            <input className="input" value={form.careerGoals} onChange={set('careerGoals')} placeholder="Full-Stack Dev, UI/UX Design..." />
          </div>
        </div>

        {/* Mentor-specific */}
        {user?.role === 'mentor' && (
          <div className="card space-y-4">
            <h2 className="font-semibold text-slate-900 border-b border-slate-100 pb-2">Mentor Details</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-800 mb-1">Current Company</label>
                <input className="input" value={mentorForm.currentCompany} onChange={setMentor('currentCompany')} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-800 mb-1">Job Title</label>
                <input className="input" value={mentorForm.jobTitle} onChange={setMentor('jobTitle')} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-800 mb-1">Years of Experience</label>
                <input type="number" className="input" value={mentorForm.yearsOfExperience} onChange={setMentor('yearsOfExperience')} min="0" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-800 mb-1">Max Mentees</label>
                <input type="number" className="input" value={mentorForm.maxMentees} onChange={setMentor('maxMentees')} min="1" max="10" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-800 mb-1">LinkedIn URL</label>
              <input className="input" placeholder="https://linkedin.com/in/yourname" value={mentorForm.linkedinUrl} onChange={setMentor('linkedinUrl')} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-800 mb-1">Areas of Expertise <span className="text-slate-500 font-normal">(comma separated)</span></label>
              <input className="input" value={mentorForm.expertise} onChange={setMentor('expertise')} placeholder="System Design, React, Career Switching..." />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="available" checked={mentorForm.isAvailable} onChange={setMentor('isAvailable')} className="rounded" />
              <label htmlFor="available" className="text-sm text-slate-800">I'm currently available to accept mentees</label>
            </div>
          </div>
        )}

        <button type="submit" className="btn-primary w-full py-3 text-base" disabled={saving}>
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </main>
  );
}   



