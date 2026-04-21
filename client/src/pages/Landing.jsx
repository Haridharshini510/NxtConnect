import { Link } from 'react-router-dom';
import { ArrowRight, Users, Map, Briefcase, MessageSquare } from 'lucide-react';

const features = [
  { icon: Users, title: 'Mentor Matching', desc: 'Get paired with alumni and professionals in your target industry.' },
  { icon: Map, title: 'Career Roadmaps', desc: 'Step-by-step paths for every role — from beginner to hired.' },
  { icon: Briefcase, title: 'Job Board', desc: 'Discover opportunities with built-in referrals from your mentor network.' },
  { icon: MessageSquare, title: 'Real-time Chat', desc: '1-on-1 conversations with your mentor, whenever you need guidance.' },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <span className="text-2xl font-bold text-blue-600">NextConnect</span>
        <div className="flex gap-3">
          <Link to="/login" className="btn-secondary text-sm">Log in</Link>
          <Link to="/register" className="btn-primary text-sm">Sign up free</Link>
        </div>
      </header>

      {/* Hero */}
      <section className="text-center px-6 py-24 max-w-4xl mx-auto">
        <span className="inline-block mb-4 text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full tracking-wide uppercase">
          For Students & Graduates
        </span>
        <h1 className="text-5xl font-extrabold text-gray-900 leading-tight mb-6">
          Bridge the gap between<br />
          <span className="text-blue-600">college and career</span>
        </h1>
        <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto">
          Connect with mentors who've been in your shoes. Get real guidance, referrals, and a clear path forward.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link to="/register" className="btn-primary flex items-center gap-2 text-base px-6 py-3">
            Get started free <ArrowRight size={18} />
          </Link>
          <Link to="/login" className="text-gray-500 hover:text-blue-600 text-sm transition-colors">
            Already have an account?
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="bg-gray-50 py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Everything you need to launch your career</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="card text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Icon size={22} className="text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-500">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to find your mentor?</h2>
        <p className="text-gray-500 mb-8">Join students already navigating their careers with NextConnect.</p>
        <Link to="/register" className="btn-primary text-base px-8 py-3 inline-block">Create your free account</Link>
      </section>

      <footer className="text-center py-6 text-sm text-gray-400 border-t border-gray-100">
        © {new Date().getFullYear()} NextConnect. Built for students, by students.
      </footer>
    </div>
  );
}