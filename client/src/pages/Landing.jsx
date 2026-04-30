import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BadgeCheck,
  Briefcase,
  ClipboardList,
  Gift,
  MessageSquare,
  Sparkles,
  UserCheck,
  Users,
} from 'lucide-react';
import logo from '../assets/logo.png';
import brand from '../assets/brand.png';
import landingImg from '../assets/landing-img.png';

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
  const trustChips = [
    { icon: UserCheck, text: 'Find Mentors.' },
    { icon: Users, text: 'Get Guidance.' },
    { icon: Sparkles, text: 'Land Opportunities' },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/85 backdrop-blur-md shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-0.5">
            <img src={logo} alt="NxtConnect logo" className="w-9 h-9 rounded-lg object-cover" />
            <img src={brand} alt="NxtConnect" className="h-10 w-auto object-contain" />
          </div>
        </div>
      </header>

      <div className="relative overflow-hidden bg-gradient-to-b from-white via-blue-50/60 to-slate-50">
        <div className="pointer-events-none absolute -top-24 -left-24 w-72 h-72 rounded-full bg-primary-200/30 blur-3xl" />
        <div className="pointer-events-none absolute top-1/3 -right-20 w-80 h-80 rounded-full bg-indigo-200/25 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 left-1/3 w-72 h-72 rounded-full bg-sky-200/30 blur-3xl" />

        <section>
          <div className="max-w-7xl mx-auto px-6 py-10 md:py-14 lg:py-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
              <div className="lg:pl-8 xl:pl-12">
                <h1 className="text-[clamp(2rem,4.5vw,3.6rem)] font-medium leading-[1.1] text-slate-900 text-center lg:text-left max-w-xl">
                  Connecting Your Future, <br />Step by Step.
                </h1>

                <p className="mt-4 text-xs  md:text-base text-slate-700 leading-relaxed text-center lg:text-left max-w-xl">
                  Mentorship, AI guidance, and referrals &mdash; all in one place.
                  <br />
                  Build your career with clarity and confidence.
                </p>

                <div className="mt-7 flex flex-wrap items-center gap-3 justify-center lg:justify-start">
                  <Link
                    to="/register"
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 px-6 py-3 text-white font-normal shadow-lg shadow-primary-200/60 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary-200/70"
                  >
                    Get Started Free
                    <ArrowRight size={16} />
                  </Link>
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white/80 px-6 py-3 text-slate-700 font-normal transition-colors duration-200 hover:bg-slate-100"
                  >
                    Watch Demo
                  </Link>
                </div>

                <div className="mt-5">
                  <p className="text-sm text-slate-600 text-center lg:text-left inline-flex items-center gap-1.5">
                    <BadgeCheck size={14} className="text-primary-700" />
                    Trusted by students, mentors, and career builders
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2.5 justify-center lg:justify-start">
                    {trustChips.map(({ icon: Icon, text }) => (
                      <span
                        key={text}
                        className="inline-flex items-center gap-1.5 rounded-full border border-blue-100 bg-white/90 px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm"
                      >
                        <Icon size={14} className="text-primary-700" />
                        {text}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="relative flex justify-center lg:justify-end">
                <div className="absolute inset-0 m-auto h-56 w-56 md:h-72 md:w-72 rounded-full bg-primary-200/30 blur-2xl" />
                <img
                  src={landingImg}
                  alt="NxtConnect hero"
                  className="relative w-full max-w-sm md:max-w-md lg:max-w-xl h-auto drop-shadow-xl"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-6 pb-16">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {pillars.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="card">
                <div className="w-10 h-10 rounded-lg bg-primary-50 text-primary-700 flex items-center justify-center mb-4">
                  <Icon size={19} />
                </div>
                <h3 className="font-semibold text-slate-900">{title}</h3>
                <p className="text-sm text-slate-600 mt-2 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="max-w-7xl mx-auto px-6 pb-16">
        <div className="card bg-slate-900 text-slate-100 !border-slate-800">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h2 className="text-lg font-normal">Ready to run your career journey with structure?</h2>
              <p className="text-xs text-slate-300 mt-2">
                Join NxtConnect to get mentor guidance, referral workflows, AI insights, and application discipline in one place.
              </p>
            </div>
            <div className="flex gap-3">
              <Link to="/register" className="btn-primary bg-primary-600 hover:bg-primary-700">Start free</Link>
              <Link to="/login" className="btn-secondary bg-white text-slate-900 border-slate-300">Log in</Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="text-center py-6 text-sm text-slate-500 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center gap-2">
          <div className="flex items-center justify-center gap-2">
            <Briefcase size={15} />
            <MessageSquare size={15} />
            <span>{new Date().getFullYear()} NxtConnect</span>
          </div>
          <div className="w-full max-w-md">
            <p className="mb-2 text-center text-[10px] tracking-[0.18em] text-slate-500">DEVELOPED BY</p>
            <div className="rounded-2xl border border-slate-300 bg-transparent px-4 py-3 text-left shadow-sm">
              <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-700">Haridharshini J</p>
                  <p className="text-xs text-slate-500">Full Stack Dev</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href="https://www.linkedin.com/in/haridharshini-jayaraj-45a704306/"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="LinkedIn profile"
                  title="LinkedIn profile"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-600 transition hover:bg-slate-100 hover:text-slate-800"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
                    <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.11 1 2.48 1 4.98 2.12 4.98 3.5zM.5 8h4V24h-4zM8 8h3.8v2.2h.05c.53-1 1.82-2.2 3.75-2.2C19.5 8 24 10.5 24 16.2V24h-4v-6.8c0-1.62-.03-3.7-2.25-3.7-2.26 0-2.6 1.76-2.6 3.58V24H11.1V8z" />
                  </svg>
                </a>
                <a
                  href="https://github.com/Haridharshini510"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="GitHub profile"
                  title="GitHub profile"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-600 transition hover:bg-slate-100 hover:text-slate-800"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
                    <path d="M12 .5C5.65.5.5 5.66.5 12.03c0 5.1 3.3 9.42 7.88 10.95.58.1.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.88-1.55-3.88-1.55-.52-1.33-1.28-1.68-1.28-1.68-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.2 1.77 1.2 1.03 1.77 2.7 1.26 3.35.96.1-.75.4-1.26.73-1.55-2.55-.3-5.24-1.28-5.24-5.7 0-1.26.45-2.28 1.19-3.08-.12-.3-.51-1.5.12-3.12 0 0 .97-.31 3.17 1.18a10.9 10.9 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.62.24 2.82.12 3.12.74.8 1.19 1.82 1.19 3.08 0 4.43-2.69 5.4-5.26 5.69.41.35.78 1.04.78 2.1 0 1.52-.01 2.74-.01 3.11 0 .31.21.67.8.56 4.57-1.54 7.86-5.86 7.86-10.95C23.5 5.66 18.35.5 12 .5z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
