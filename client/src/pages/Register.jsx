import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserRound, GraduationCap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import authRegisterImg from '../assets/auth-register.png';
import logo from '../assets/logo.png';
import { authAPI } from '../api';

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


  const goNext = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      toast.error('Name, email, and password are required');
      return;
    }

    setLoading(true);
    try {
      await authAPI.checkEmail(form.email);
      setStep(2);
    } catch (err) {
      const apiMessage = err.response?.data?.message;
      if (err.response?.data?.captchaRequired) {
        toast.error('Too many attempts. Please complete captcha and try again.');
      } else {
        toast.error(apiMessage || "We couldn't continue. Try signing in if you already have an account.");
      }
    } finally {
      setLoading(false);
    }
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
      toast.success('Account created. Verification link sent to your email.');
      navigate(`/login?email=${encodeURIComponent(form.email)}`);
    } catch (err) {
      const apiMessage = err.response?.data?.message;
      if (err.response?.data?.captchaRequired) {
        toast.error('Too many attempts. Please complete captcha and try again.');
      } else {
        toast.error(apiMessage || "We couldn't continue. Try signing in if you already have an account.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 flex items-center justify-center">
      <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-6">
        {/* Left panel */}
        <div className="card hidden lg:flex flex-col justify-between overflow-hidden">
          <Link to="/" className="inline-flex items-center gap-2">
            <img src={logo} alt="NxtConnect logo" className="w-8 h-8 rounded-lg object-cover" />
            <span className="text-sm font-semibold text-slate-900">NxtConnect</span>
          </Link>

          <div className="flex-1 flex items-center justify-center py-6">
            <img
              src={authRegisterImg}
              alt="Students learning online"
              className="w-full max-w-xs object-contain drop-shadow-md"
            />
          </div>

          <div>
            <h2 className="text-xl font-normal text-slate-900 leading-snug">Built for students and mentors.</h2>
            <p className="text-xs text-slate-500 mt-1">One profile powers matching, referrals, resume AI, and more.</p>
          </div>
        </div>

        <div className="card max-w-md w-full mx-auto">
          <div className="mb-6">
            <Link to="/" className="inline-flex items-center gap-2 lg:hidden mb-4">
              <img src={logo} alt="NxtConnect logo" className="w-8 h-8 rounded-lg object-cover" />
              <span className="text-sm font-normal text-slate-900">NxtConnect</span>
            </Link>
            <h2 className="text-xl font-light text-slate-900">Create your account</h2>
            <p className="text-slate-500 text-xs mt-1">Step {step} of 2</p>
          </div>

          <div className="w-full bg-slate-100 rounded-full h-2 mb-6" role="progressbar" aria-valuenow={step} aria-valuemin={1} aria-valuemax={2}>
            <div className={`bg-primary-700 h-2 rounded-full transition-all duration-200 ${step === 1 ? 'w-1/2' : 'w-full'}`} />
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
                          form.role === key ? 'border-primary-200 bg-primary-50 text-primary-700' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
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
                <button type="submit" className="btn-primary w-full" disabled={loading}>
                  {loading ? 'Checking...' : 'Create account'}
                </button>
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
            <Link to="/login" className="text-primary-700 hover:underline font-semibold">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
