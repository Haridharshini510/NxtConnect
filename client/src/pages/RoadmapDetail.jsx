import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import { CheckCircle, Clock, ArrowLeft, ExternalLink } from 'lucide-react';
import { PageSkeleton } from '../components/ui';

export default function RoadmapDetail() {
  const { id } = useParams();
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(new Set());

  useEffect(() => {
    api.get(`/roadmaps/${id}`).then((r) => setRoadmap(r.data.roadmap)).catch(console.error).finally(() => setLoading(false));
    // Load local progress
    const saved = localStorage.getItem(`roadmap_progress_${id}`);
    if (saved) setCompleted(new Set(JSON.parse(saved)));
  }, [id]);

  const toggleStep = (order) => {
    setCompleted((prev) => {
      const next = new Set(prev);
      next.has(order) ? next.delete(order) : next.add(order);
      localStorage.setItem(`roadmap_progress_${id}`, JSON.stringify([...next]));
      return next;
    });
  };

  if (loading) return <PageSkeleton variant="roadmapDetail" />;
  if (!roadmap) return <div className="text-center py-20 text-slate-500">Roadmap not found</div>;

  const progress = roadmap.steps?.length > 0 ? Math.round((completed.size / roadmap.steps.length) * 100) : 0;

  return (
    <main className="max-w-3xl mr-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 md:pb-8">
      <Link to="/roadmaps" className="flex items-center gap-1 text-sm text-slate-600 hover:text-primary-600 mb-6 transition-colors">
        <ArrowLeft size={14} /> Back to Roadmaps
      </Link>

      {/* Header */}
      <div className="card mb-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="text-xs text-brand-600 font-medium bg-brand-50 px-2 py-0.5 rounded-full">{roadmap.category}</span>
            <h1 className="text-2xl font-bold text-slate-900 mt-2">{roadmap.title}</h1>
            {roadmap.description && <p className="text-slate-600 text-sm mt-2">{roadmap.description}</p>}
          </div>
        </div>

        {/* Progress */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-slate-600">Your progress</span>
            <span className="font-semibold text-primary-600">{progress}%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2">
            <div className="bg-primary-600 h-2 rounded-full transition-all" style={{ width: `${progress}%` }} />
          </div>
          <p className="text-xs text-slate-500 mt-1">{completed.size} of {roadmap.steps?.length} steps completed</p>
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-4">
        {roadmap.steps?.sort((a, b) => a.order - b.order).map((step, i) => {
          const done = completed.has(step.order);
          return (
            <div key={i} className={`card border-l-4 transition-all ${done ? 'border-l-green-500 bg-green-50/30' : 'border-l-blue-200'}`}>
              <div className="flex items-start gap-4">
                <button onClick={() => toggleStep(step.order)} className="flex-shrink-0 mt-0.5">
                  <CheckCircle size={22} className={done ? 'text-green-500' : 'text-slate-400'} />
                </button>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-slate-500">STEP {step.order}</span>
                    {step.estimatedWeeks > 0 && (
                      <span className="text-xs flex items-center gap-1 text-slate-500">
                        <Clock size={11} /> {step.estimatedWeeks} week{step.estimatedWeeks > 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                  <h3 className={`font-semibold mt-0.5 ${done ? 'text-green-700 line-through' : 'text-slate-900'}`}>
                    {step.title}
                  </h3>
                  {step.description && <p className="text-sm text-slate-700 mt-1">{step.description}</p>}

                  {/* Skills */}
                  {step.skills?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {step.skills.map((s) => (
                        <span key={s} className="text-xs bg-primary-50 text-primary-600 px-2 py-0.5 rounded-full">{s}</span>
                      ))}
                    </div>
                  )}

                  {/* Resources */}
                  {step.resources?.length > 0 && (
                    <div className="mt-3 space-y-1">
                      <p className="text-xs font-medium text-slate-600 uppercase tracking-wide">Resources</p>
                      {step.resources.map((r, j) => (
                        <a key={j} href={r.url} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-1 text-sm text-primary-600 hover:underline">
                          {r.title} <ExternalLink size={11} />
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}




