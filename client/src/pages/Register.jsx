import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle2, UserRound, GraduationCap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const INDUSTRIES = [
  'Technology',
  'Finance',
  'Healthcare',
  'Design',
  'Marketing',
  'Data Science',
  'Product Management',
  'Consulting',
  'Other',
];

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
    college: '',
    graduationYear: '',
    industry: '',
    skills: '',
    careerGoals: '',
  });

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const goNext = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      toast.error('Name, email, and password are required');
      return;
    }
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register({
        ...form,
        graduationYear: form.graduationYear ? Number(form.graduationYear) : undefined,
        skills: form.skills ? form.skills.split(',').map((s) => s.trim()).filter(Boolean) : [],
        careerGoals: form.careerGoals ? form.careerGoals.split(',').map((s) => s.trim()).filter(Boolean) : [],
      });
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 flex items-center justify-center">
      <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-6">
        <div className="card hidden lg:block">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-lg bg-blue-700 text-white text-xs font-bold flex items-center justify-center">NC</div>
            <span className="text-sm font-semibold text-slate-900">NxtConnect</span>
          </Link>

          <h1 className="text-3xl font-semibold text-slate-900 leading-tight">Structured onboarding for real career outcomes.</h1>
          <p className="text-sm text-slate-600 mt-4 leading-relaxed">
            Build your profile once, then use it across mentorship matching, referrals, resume analysis, and application tracking.
          </p>

          <div className="mt-8 space-y-3 text-sm text-slate-600">
            <div className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-600" /> Role-based access by student, mentor, and admin</div>
            <div className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-600" /> AI matching and resume intelligence from profile context</div>
            <div className="flex items-center gap-2"><CheckCircle2 size={16} className="text-emerald-600" /> Data flows into referrals and application tracker</div>
          </div>
        </div>

        <div className="card max-w-md w-full mx-auto">
          <div className="mb-6">
            <Link to="/" className="inline-flex items-center gap-2 lg:hidden mb-4">
              <div className="w-8 h-8 rounded-lg bg-blue-700 text-white text-xs font-bold flex items-center justify-center">NC</div>
              <span className="text-sm font-semibold text-slate-900">NxtConnect</span>
            </Link>
            <h2 className="text-2xl font-semibold text-slate-900">Create your account</h2>
            <p className="text-slate-500 text-sm mt-1">Step {step} of 2</p>
          </div>

          <div className="w-full bg-slate-100 rounded-full h-2 mb-6" role="progressbar" aria-valuenow={step} aria-valuemin={1} aria-valuemax={2}>
            <div className={`bg-blue-700 h-2 rounded-full transition-all duration-200 ${step === 1 ? 'w-1/2' : 'w-full'}`} />
          </div>

          <form onSubmit={step === 1 ? goNext : handleSubmit} className="space-y-4">
            {step === 1 ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">I am a</label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { key: 'student', label: 'Student', icon: GraduationCap },
                      { key: 'mentor', label: 'Mentor', icon: UserRound },
                    ].map(({ key, label, icon: Icon }) => (
                      <button
                        type="button"
                        key={key}
                        onClick={() => setForm({ ...form, role: key })}
                        className={`rounded-xl border px-3 py-3 text-sm font-semibold flex items-center justify-center gap-2 ${
                          form.role === key ? 'border-blue-200 bg-blue-50 text-blue-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <Icon size={15} />
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Full name</label>
                  <input className="input" placeholder="Jane Doe" value={form.name} onChange={set('name')} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
                  <input type="email" className="input" placeholder="you@example.com" value={form.email} onChange={set('email')} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
                  <input type="password" className="input" placeholder="Minimum 6 characters" value={form.password} onChange={set('password')} required minLength={6} />
                </div>
                <button type="submit" className="btn-primary w-full">Continue</button>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">College or university</label>
                  <input className="input" placeholder="IIT Madras" value={form.college} onChange={set('college')} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Graduation year</label>
                  <input type="number" className="input" placeholder="2026" value={form.graduationYear} onChange={set('graduationYear')} min="1990" max="2038" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Industry</label>
                  <select className="input" value={form.industry} onChange={set('industry')}>
                    <option value="">Select industry</option>
                    {INDUSTRIES.map((i) => <option key={i}>{i}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Skills <span className="text-slate-400 font-normal">(comma separated)</span>
                  </label>
                  <input className="input" placeholder="React, Node.js, Python" value={form.skills} onChange={set('skills')} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    {form.role === 'student' ? 'Career goals' : 'Areas of expertise'} <span className="text-slate-400 font-normal">(comma separated)</span>
                  </label>
                  <input className="input" placeholder="Backend engineering, product analytics" value={form.careerGoals} onChange={set('careerGoals')} />
                </div>
                <div className="flex gap-3 pt-1">
                  <button type="button" onClick={() => setStep(1)} className="btn-secondary flex-1">Back</button>
                  <button type="submit" className="btn-primary flex-1" disabled={loading}>
                    {loading ? 'Creating...' : 'Create account'}
                  </button>
                </div>
              </>
            )}
          </form>

          <p className="text-center text-sm text-slate-500 mt-5">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-700 hover:underline font-semibold">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
