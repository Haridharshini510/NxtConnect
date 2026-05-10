import { useState } from 'react';
import {
  Heart,
  MessageCircle,
  Trash2,
  Send,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Lightbulb,
  Target,
  Trophy,
  CircleHelp,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const typeColors = {
  story: 'bg-blue-50 text-blue-700',
  tip: 'bg-emerald-50 text-emerald-700',
  opportunity: 'bg-indigo-50 text-indigo-700',
  achievement: 'bg-amber-50 text-amber-700',
  question: 'bg-rose-50 text-rose-700',
};

const typeMeta = {
  story: { label: 'Story', Icon: BookOpen },
  tip: { label: 'Tip', Icon: Lightbulb },
  opportunity: { label: 'Opportunity', Icon: Target },
  achievement: { label: 'Achievement', Icon: Trophy },
  question: { label: 'Question', Icon: CircleHelp },
};

export default function FeedPost({ post, onLike, onComment, onDelete }) {
  const { user } = useAuth();
  const [comment, setComment] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const author = post.authorId;
  const isLiked = post.likes?.includes(user._id)
    || post.likes?.some((l) => (l._id || l)?.toString() === user._id?.toString());
  const isOwn = author?._id?.toString() === user._id?.toString();

  const timeAgo = (date) => {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h`;
    return `${Math.floor(hrs / 24)}d`;
  };

  const handleComment = async () => {
    if (!comment.trim()) return;
    setSubmitting(true);
    await onComment(post._id, comment);
    setComment('');
    setShowComments(true);
    setSubmitting(false);
  };

  const TypeIcon = typeMeta[post.type]?.Icon;

  return (
    <article className="card flex flex-col gap-4 border-blue-100">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          {author?.profilePhoto ? (
            <img src={author.profilePhoto} className="w-10 h-10 rounded-full object-cover" alt={author.name} />
          ) : (
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
              <span className="text-blue-700 font-bold">{author?.name?.[0]}</span>
            </div>
          )}
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-slate-900 text-sm">{author?.name}</span>
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${
                  author?.role === 'mentor' ? 'bg-blue-50 text-blue-700' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {author?.role}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
              <span>{author?.industry || author?.college}</span>
              <span>&middot;</span>
              <span>{timeAgo(post.createdAt)}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {post.type && (
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${typeColors[post.type] || 'bg-slate-100 text-slate-600'}`}>
              <span className="inline-flex items-center gap-1">
                {TypeIcon ? <TypeIcon size={12} /> : null}
                {typeMeta[post.type]?.label || post.type}
              </span>
            </span>
          )}
          {isOwn && (
            <button onClick={() => onDelete(post._id)} className="p-1 text-slate-400 hover:text-red-400 transition-colors">
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>

      <p className="text-slate-800 leading-relaxed whitespace-pre-wrap text-[0.95rem]">{post.content}</p>

      {post.tags?.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {post.tags.map((t) => (
            <span key={t} className="text-xs text-blue-600 hover:text-blue-800 hover:underline cursor-pointer">#{t}</span>
          ))}
        </div>
      )}

      <div className="flex items-center gap-4 pt-2 border-t border-blue-100">
        <button
          onClick={() => onLike(post._id)}
          className={`flex items-center gap-1.5 text-sm transition-colors ${
            isLiked ? 'text-red-500' : 'text-slate-500 hover:text-red-400'
          }`}
        >
          <Heart size={16} fill={isLiked ? 'currentColor' : 'none'} />
          <span>{post.likes?.length || 0}</span>
        </button>

        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-blue-600 transition-colors"
        >
          <MessageCircle size={16} />
          <span>{post.comments?.length || 0}</span>
          {showComments ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
        </button>
      </div>

      {showComments && (
        <div className="space-y-3 pt-1">
          {post.comments?.map((c) => (
            <div key={c._id} className="flex gap-2">
              <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
                {c.authorId?.profilePhoto ? (
                  <img src={c.authorId.profilePhoto} className="w-7 h-7 rounded-full object-cover" alt="" />
                ) : (
                  <span className="text-slate-600 text-xs font-bold">{c.authorId?.name?.[0]}</span>
                )}
              </div>
              <div className="bg-slate-50 rounded-xl px-3 py-2 flex-1">
                <span className="text-xs font-semibold text-slate-900">{c.authorId?.name} </span>
                <span className="text-xs text-slate-700">{c.content}</span>
              </div>
            </div>
          ))}

          <div className="flex gap-2 mt-2">
            <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
              <span className="text-blue-700 text-xs font-bold">{user?.name?.[0]}</span>
            </div>
            <div className="flex gap-2 flex-1">
              <input
                className="input text-sm flex-1"
                placeholder="Write a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleComment(); }}
                maxLength={500}
              />
              <button
                onClick={handleComment}
                disabled={!comment.trim() || submitting}
                className="btn-primary px-3 py-1.5 flex-shrink-0"
              >
                <Send size={14} />
              </button>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}
