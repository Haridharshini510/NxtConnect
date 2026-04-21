import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const INDUSTRIES = ['Technology', 'Finance', 'Healthcare', 'Design', 'Marketing', 'Data Science', 'Product Management', 'Consulting', 'Other'];

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '', email: '', password: '', role: 'student',
    college: '', graduationYear: '', industry: '',
    skills: '', careerGoals: '',
  });

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-10">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="text-2xl font-bold text-blue-600">NextConnect</Link>
          <h2 className="mt-4 text-2xl font-bold text-gray-900">Create your account</h2>
          <p className="text-gray-500 text-sm mt-1">Step {step} of 2</p>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-1.5 mb-6">
          <div className={`bg-blue-600 h-1.5 rounded-full transition-all ${step === 1 ? 'w-1/2' : 'w-full'}`} />
        </div>

        <div className="card">
          <form onSubmit={step === 1 ? (e) => { e.preventDefault(); setStep(2); } : handleSubmit} className="space-y-4">
            {step === 1 ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">I am a…</label>
                  <div className="grid grid-cols-2 gap-3">
                    {['student', 'mentor'].map((r) => (
                      <button type="button" key={r} onClick={() => setForm({ ...form, role: r })}
                        className={`py-3 rounded-lg border-2 font-medium capitalize transition-colors ${
                          form.role === r ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-gray-200 text-gray-600'
                        }`}>
                        {r === 'student' ? '🎓 Student / Graduate' : '💼 Mentor / Alumni'}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input className="input" placeholder="Jane Doe" value={form.name} onChange={set('name')} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input type="email" className="input" placeholder="you@example.com" value={form.email} onChange={set('email')} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <input type="password" className="input" placeholder="Min. 6 characters" value={form.password} onChange={set('password')} required minLength={6} />
                </div>
                <button type="submit" className="btn-primary w-full py-2.5">Continue →</button>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">College / University</label>
                  <input className="input" placeholder="IIT Madras" value={form.college} onChange={set('college')} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Graduation Year</label>
                  <input type="number" className="input" placeholder="2025" value={form.graduationYear} onChange={set('graduationYear')} min="1990" max="2035" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
                  <select className="input" value={form.industry} onChange={set('industry')}>
                    <option value="">Select industry</option>
                    {INDUSTRIES.map((i) => <option key={i}>{i}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Skills <span className="text-gray-400 font-normal">(comma separated)</span></label>
                  <input className="input" placeholder="React, Node.js, Python" value={form.skills} onChange={set('skills')} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {form.role === 'student' ? 'Career Goals' : 'Areas of Expertise'} <span className="text-gray-400 font-normal">(comma separated)</span>
                  </label>
                  <input className="input" placeholder="Full-Stack Dev, Product Management" value={form.careerGoals} onChange={set('careerGoals')} />
                </div>
                <div className="flex gap-3">
                  <button type="button" onClick={() => setStep(1)} className="btn-secondary flex-1">← Back</button>
                  <button type="submit" className="btn-primary flex-1 py-2.5" disabled={loading}>
                    {loading ? 'Creating...' : 'Create Account'}
                  </button>
                </div>
              </>
            )}
          </form>
        </div>

        <p className="text-center text-sm text-gray-500 mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:underline font-medium">Log in</Link>
        </p>
      </div>
    </div>
  );
}