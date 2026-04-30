import { MapPin, Clock, ExternalLink, Gift } from 'lucide-react';

const typeColors = {
  'full-time': 'bg-green-50 text-green-700',
  'part-time': 'bg-primary-50 text-primary-700',
  internship: 'bg-brand-50 text-brand-700',
  contract: 'bg-orange-50 text-orange-700',
};

export default function JobCard({ job }) {
  const poster = job.postedBy;

  return (
    <div className="card hover:shadow-md transition-shadow flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-semibold text-slate-900">{job.title}</h3>
          <p className="text-sm font-medium text-primary-600">{job.company}</p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${typeColors[job.type] || 'bg-slate-100 text-slate-700'}`}>
            {job.type}
          </span>
          {job.isReferralAvailable && (
            <span className="text-xs flex items-center gap-1 text-emerald-600 font-medium">
              <Gift size={11} /> Referral
            </span>
          )}
        </div>
      </div>

      {/* Meta */}
      <div className="flex items-center gap-3 text-xs text-slate-600">
        <span className="flex items-center gap-1"><MapPin size={12} /> {job.location}</span>
        {job.deadline && (
          <span className="flex items-center gap-1">
            <Clock size={12} /> Due {new Date(job.deadline).toLocaleDateString()}
          </span>
        )}
      </div>

      {/* Description */}
      <p className="text-sm text-slate-700 line-clamp-2">{job.description}</p>

      {/* Skills */}
      {job.skills?.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {job.skills.slice(0, 5).map((s) => (
            <span key={s} className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full">{s}</span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span>Posted by</span>
          <span className="font-medium text-slate-700">{poster?.name}</span>
        </div>
        {job.applicationUrl && (
          <a href={job.applicationUrl} target="_blank" rel="noopener noreferrer"
            className="btn-primary text-xs flex items-center gap-1">
            Apply <ExternalLink size={11} />
          </a>
        )}
      </div>
    </div>
  );
}


