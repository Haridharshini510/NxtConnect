import { Calendar, Clock, Users, Video, PlayCircle, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function WorkshopCard({
  workshop,
  onRegister,
  onUnregister,
  isRegistered,
  currentUserId,
  canDelete = false,
  onDelete,
  deleting = false,
}) {
  const host = workshop.hostId;
  const isPast = new Date(workshop.scheduledAt) < new Date();
  const isFull = workshop.attendees?.length >= workshop.maxCapacity;
  const hostId = host?._id || host;
  const isHost = Boolean(hostId && currentUserId && hostId.toString() === currentUserId.toString());

  return (
    <div className="card hover:shadow-md transition-shadow flex flex-col gap-4">
      {/* Type badge */}
      <div className="flex items-center justify-between">
        <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${
          workshop.type === 'live'
            ? 'bg-red-50 text-red-600'
            : 'bg-brand-50 text-brand-600'
        }`}>
          {workshop.type === 'live' ? <Video size={11} /> : <PlayCircle size={11} />}
          {workshop.type === 'live' ? 'Live Session' : 'Recorded'}
        </span>
        {workshop.isPaid && workshop.price > 0 ? (
          <span className="text-sm font-bold text-slate-900">₹{workshop.price}</span>
        ) : (
          <span className="text-xs text-green-600 font-medium">Free</span>
        )}
      </div>

      {/* Title & host */}
      <div>
        <h3 className="font-semibold text-slate-900 text-base leading-snug">{workshop.title}</h3>
        {host && (
          <div className="flex items-center gap-2 mt-2">
            {host.profilePhoto ? (
              <img src={host.profilePhoto} className="w-6 h-6 rounded-full object-cover" alt={host.name} />
            ) : (
              <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center">
                <span className="text-primary-600 text-xs font-bold">{host.name?.[0]}</span>
              </div>
            )}
            <span className="text-sm text-slate-600">{host.name}</span>
          </div>
        )}
      </div>

      <p className="text-sm text-slate-700 line-clamp-2">{workshop.description}</p>

      {/* Meta */}
      <div className="flex flex-wrap gap-3 text-xs text-slate-600">
        <span className="flex items-center gap-1">
          <Calendar size={12} />
          {new Date(workshop.scheduledAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
        </span>
        <span className="flex items-center gap-1">
          <Clock size={12} />
          {new Date(workshop.scheduledAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
          {workshop.durationMinutes && ` · ${workshop.durationMinutes}min`}
        </span>
        <span className="flex items-center gap-1">
          <Users size={12} />
          {workshop.attendees?.length || 0}/{workshop.maxCapacity}
        </span>
      </div>

      {/* Tags */}
      {workshop.tags?.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {workshop.tags.slice(0, 3).map((t) => (
            <span key={t} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{t}</span>
          ))}
        </div>
      )}

      {/* Action */}
      <div className="mt-auto pt-2">
        {isPast ? (
          <Link to={`/workshops/${workshop._id}`} className="btn-secondary w-full text-center text-sm block">
            View Details
          </Link>
        ) : isHost ? (
          <div className="flex gap-2">
            <Link to={`/workshops/${workshop._id}`} className="btn-primary flex-1 text-center text-sm">
              View Details
            </Link>
            {canDelete && (
              <button
                type="button"
                onClick={() => onDelete?.(workshop._id)}
                disabled={deleting}
                className="px-3 rounded-lg text-sm border border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center gap-1"
              >
                <Trash2 size={13} />
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            )}
          </div>
        ) : isRegistered ? (
          <div className="flex gap-2">
            <Link to={`/workshops/${workshop._id}`} className="btn-primary flex-1 text-center text-sm">
              View Details
            </Link>
            <button onClick={() => onUnregister(workshop._id)} className="btn-secondary text-sm px-3">
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => onRegister(workshop._id)}
            disabled={isFull}
            className="btn-primary w-full text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isFull ? 'Full' : 'Register'}
          </button>
        )}
      </div>
    </div>
  );
}


