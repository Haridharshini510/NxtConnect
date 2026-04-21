import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { Map, Clock, ArrowRight } from 'lucide-react';

export default function Roadmaps() {
  const [roadmaps, setRoadmaps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/roadmaps').then((r) => setRoadmaps(r.data.roadmaps)).catch(console.error).finally(() => setLoading(false));
  }, []);

  const totalWeeks = (roadmap) => roadmap.steps?.reduce((acc, s) => acc + (s.estimatedWeeks || 0), 0) || 0;

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 pb-20 md:pb-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Career Roadmaps</h1>
      <p className="text-gray-500 text-sm mb-8">Step-by-step paths curated by industry mentors</p>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(4)].map((_, i) => <div key={i} className="card h-40 animate-pulse bg-gray-100" />)}
        </div>
      ) : roadmaps.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <Map size={48} className="mx-auto mb-4 opacity-30" />
          <p>No roadmaps published yet. Check back soon!</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {roadmaps.map((rm) => (
            <div key={rm._id} className="card hover:shadow-md transition-shadow flex flex-col gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Map size={20} className="text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{rm.title}</h3>
                <p className="text-sm text-gray-500 mt-0.5">{rm.category}</p>
              </div>
              {rm.description && <p className="text-sm text-gray-600 line-clamp-2">{rm.description}</p>}
              <div className="flex items-center gap-3 text-xs text-gray-400">
                <span>{rm.steps?.length || 0} steps</span>
                {totalWeeks(rm) > 0 && (
                  <span className="flex items-center gap-1"><Clock size={11} /> ~{totalWeeks(rm)} weeks</span>
                )}
              </div>
              {rm.tags?.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {rm.tags.slice(0, 3).map((t) => (
                    <span key={t} className="text-xs bg-purple-50 text-purple-600 px-2 py-0.5 rounded-full">{t}</span>
                  ))}
                </div>
              )}
              <Link to={`/roadmaps/${rm._id}`} className="btn-primary text-center text-sm mt-auto flex items-center justify-center gap-1">
                View Roadmap <ArrowRight size={14} />
              </Link>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}