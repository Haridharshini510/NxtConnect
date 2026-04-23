import { Link } from 'react-router-dom';
import { ArrowRight, Briefcase, ClipboardList, Gift, MessageSquare, ShieldCheck, Sparkles, UserCheck } from 'lucide-react';

const pillars = [
  {
    icon: UserCheck,
    title: 'Mentorship You Can Trust',
    desc: 'Connect students with vetted mentors and keep every interaction structured and accountable.',
  },
  {
    icon: Sparkles,
    title: 'AI-Assisted Career Decisions',
    desc: 'Use AI mentor matching and resume analysis to prioritize high-impact steps in your journey.',
  },
  {
    icon: Gift,
    title: 'Referral Workflow',
    desc: 'Request, review, and track referrals with clear statuses and communication history.',
  },
  {
    icon: ClipboardList,
    title: 'Application Tracking',
    desc: 'Manage applications across stages with kanban visibility and fast updates.',
  },
];

const modules = [
  'Auth and role-based onboarding',
  'Dashboard and recent activity',
  'Mentor discovery and AI matching',
  'Connections and real-time chat',
  'Jobs and referral-ready opportunities',
  'Roadmaps and workshop lifecycle',
  'Feed and notifications',
  'Resume builder with AI analysis',
  'Application tracker (kanban)',
  'Admin moderation and platform stats',
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-blue-700 text-white text-xs font-bold flex items-center justify-center">NC</div>
            <div>
              <div className="text-sm font-semibold text-slate-900">NxtConnect</div>
              <div className="text-xs text-slate-500">Mentorship and Career Platform</div>
            </div>
          </div>
          <div className="flex gap-3">
            <Link to="/login" className="btn-secondary text-sm">Log in</Link>
            <Link to="/register" className="btn-primary text-sm">Create account</Link>
          </div>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-6 py-16 md:py-20">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <div className="status-chip-neutral mb-5 w-fit">
              <ShieldCheck size={14} />
              <span>Built for students, mentors, and admins</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-semibold leading-tight text-slate-900">
              A reliable operating system for career growth.
            </h1>
            <p className="mt-5 text-base md:text-lg text-slate-600 max-w-xl leading-relaxed">
              NxtConnect combines mentorship, AI guidance, referrals, and application tracking into one secure workflow.
              Move from exploration to outcomes with confidence.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link to="/register" className="btn-primary">
                Get started
                <ArrowRight size={16} />
              </Link>
              <Link to="/login" className="btn-secondary">Access existing account</Link>
            </div>
          </div>

          <div className="card p-0 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-200 bg-slate-50">
              <h2 className="text-sm font-semibold text-slate-700">Platform Coverage</h2>
              <p className="text-xs text-slate-500 mt-1">Core workflows included in one system</p>
            </div>
            <div className="p-5 grid sm:grid-cols-2 gap-3">
              {modules.map((item) => (
                <div key={item} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {pillars.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="card">
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center mb-4">
                <Icon size={19} />
              </div>
              <h3 className="font-semibold text-slate-900">{title}</h3>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-16">
        <div className="card bg-slate-900 text-slate-100 !border-slate-800">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h2 className="text-2xl font-semibold">Ready to run your career journey with structure?</h2>
              <p className="text-sm text-slate-300 mt-2">
                Join NxtConnect to get mentor guidance, referral workflows, AI insights, and application discipline in one place.
              </p>
            </div>
            <div className="flex gap-3">
              <Link to="/register" className="btn-primary bg-blue-600 hover:bg-blue-700">Start free</Link>
              <Link to="/login" className="btn-secondary bg-white text-slate-900 border-slate-300">Log in</Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="text-center py-6 text-sm text-slate-500 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-center gap-2">
          <Briefcase size={15} />
          <MessageSquare size={15} />
          <span>{new Date().getFullYear()} NxtConnect</span>
        </div>
      </footer>
    </div>
  );
}
