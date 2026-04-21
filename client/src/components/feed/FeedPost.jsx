import { useState } from 'react';
import { Heart, MessageCircle, Trash2, Send, ChevronDown, ChevronUp } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const typeColors = {
  story: 'bg-blue-50 text-blue-600',
  tip: 'bg-green-50 text-green-600',
  opportunity: 'bg-purple-50 text-purple-600',
  achievement: 'bg-yellow-50 text-yellow-600',
  question: 'bg-red-50 text-red-600',
};

const typeLabels = {
  story: '📖 Story',
  tip: '💡 Tip',
  opportunity: '🎯 Opportunity',
  achievement: '🏆 Achievement',
  question: '❓ Question',
};

export default function FeedPost({ post, onLike, onComment, onDelete }) {
  const { user } = useAuth();
  const [comment, setComment] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const author = post.authorId;
  const isLiked = post.likes?.includes(user._id) ||
    post.likes?.some((l) => (l._id || l)?.toString() === user._id?.toString());
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

  return (
    <div className="card flex flex-col gap-4">
      {/* Author row */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          {author?.profilePhoto ? (
            <img src={author.profilePhoto} className="w-10 h-10 rounded-full object-cover" alt={author.name} />
          ) : (
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
              <span className="text-blue-600 font-bold">{author?.name?.[0]}</span>
            </div>
          )}
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-gray-900 text-sm">{author?.name}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${
                author?.role === 'mentor' ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-500'
              }`}>{author?.role}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-400 mt-0.5">
              <span>{author?.industry || author?.college}</span>
              <span>·</span>
              <span>{timeAgo(post.createdAt)}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {post.type && (
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${typeColors[post.type] || 'bg-gray-100 text-gray-500'}`}>
              {typeLabels[post.type] || post.type}
            </span>
          )}
          {isOwn && (
            <button onClick={() => onDelete(post._id)} className="p-1 text-gray-300 hover:text-red-400 transition-colors">
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <p className="text-gray-800 leading-relaxed whitespace-pre-wrap text-sm">{post.content}</p>

      {/* Tags */}
      {post.tags?.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {post.tags.map((t) => (
            <span key={t} className="text-xs text-blue-500 hover:underline cursor-pointer">#{t}</span>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-4 pt-1 border-t border-gray-50">
        <button
          onClick={() => onLike(post._id)}
          className={`flex items-center gap-1.5 text-sm transition-colors ${
            isLiked ? 'text-red-500' : 'text-gray-400 hover:text-red-400'
          }`}
        >
          <Heart size={16} fill={isLiked ? 'currentColor' : 'none'} />
          <span>{post.likes?.length || 0}</span>
        </button>

        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-blue-500 transition-colors"
        >
          <MessageCircle size={16} />
          <span>{post.comments?.length || 0}</span>
          {showComments ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
        </button>
      </div>

      {/* Comments section */}
      {showComments && (
        <div className="space-y-3 pt-1">
          {post.comments?.map((c) => (
            <div key={c._id} className="flex gap-2">
              <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                {c.authorId?.profilePhoto ? (
                  <img src={c.authorId.profilePhoto} className="w-7 h-7 rounded-full object-cover" alt="" />
                ) : (
                  <span className="text-gray-500 text-xs font-bold">{c.authorId?.name?.[0]}</span>
                )}
              </div>
              <div className="bg-gray-50 rounded-xl px-3 py-2 flex-1">
                <span className="text-xs font-semibold text-gray-800">{c.authorId?.name} </span>
                <span className="text-xs text-gray-600">{c.content}</span>
              </div>
            </div>
          ))}

          {/* Comment input */}
          <div className="flex gap-2 mt-2">
            <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
              <span className="text-blue-600 text-xs font-bold">{user?.name?.[0]}</span>
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
    </div>
  );
}