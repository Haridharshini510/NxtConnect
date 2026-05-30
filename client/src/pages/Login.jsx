import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, LockKeyhole } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import authLoginImg from '../assets/auth-login.png';
import logo from '../assets/logo.png';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      if (err.response?.data?.captchaRequired) {
        toast.error('Too many attempts. Please complete captcha and try again.');
      } else {
        toast.error(err.response?.data?.message || 'Invalid email or password.');
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
              src={authLoginImg}
              alt="Developers collaborating"
              className="w-full max-w-xs object-contain drop-shadow-md"
            />
          </div>

          <div>
            <h2 className="text-xl font-normal text-slate-900 leading-snug">Your career workspace, secured.</h2>
            <p className="text-sm text-slate-500 mt-1">Mentorship, referrals, and AI tools all in one place.</p>
            <div className="flex flex-wrap gap-2 mt-4">
              <div className="status-chip-neutral"><ShieldCheck size={13} /> Protected sessions</div>
              <div className="status-chip-neutral"><LockKeyhole size={13} /> Role-based access</div>
            </div>
          </div>
        </div>

        <div className="card max-w-md w-full mx-auto">
          <div className="mb-6">
            <Link to="/" className="inline-flex items-center gap-2 lg:hidden mb-4">
              <img src={logo} alt="NxtConnect logo" className="w-8 h-8 rounded-lg object-cover" />
              <span className="text-sm font-semibold text-slate-900">NxtConnect</span>
            </Link>
            <h2 className="text-xl font-normal text-slate-900">Welcome back</h2>
            <p className="text-slate-500 text-xs mt-1">Sign in to continue your progress.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
              <input
                type="email"
                className="input"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                autoComplete="email"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
              <input
                type="password"
                className="input"
                placeholder="Enter your password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                autoComplete="current-password"
                required
              />
            </div>
            <button type="submit" className="btn-primary w-full" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-5">
            New to NxtConnect?{' '}
            <Link to="/register" className="text-primary-700 hover:underline font-semibold">Create account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
