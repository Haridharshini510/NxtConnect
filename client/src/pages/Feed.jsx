import { useEffect, useState, useRef, useCallback } from 'react';
import React from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import FeedPost from '../components/feed/FeedPost';
import { PostCardSkeleton } from '../components/ui';
import toast from 'react-hot-toast';
import { Rss, Send, BookOpen, Lightbulb, Target, Trophy, HelpCircle } from 'lucide-react';

const POST_TYPES = ['story', 'tip', 'opportunity', 'achievement', 'question'];

const typeLabels = {
  story: 'Story',
  tip: 'Tip',
  opportunity: 'Opportunity',
  achievement: 'Achievement',
  question: 'Question',
};

const typeIcons = {
  story: BookOpen,
  tip: Lightbulb,
  opportunity: Target,
  achievement: Trophy,
  question: HelpCircle,
};

export default function Feed() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [content, setContent] = useState('');
  const [postType, setPostType] = useState('story');
  const [tags, setTags] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [filterType, setFilterType] = useState('');
  const loaderRef = useRef(null);

  const fetchPosts = async (pg = 1, reset = false) => {
    try {
      if (pg === 1) setLoading(true); else setLoadingMore(true);
      const params = { page: pg, limit: 10 };
      if (filterType) params.type = filterType;
      const res = await api.get('/feed', { params });
      const newPosts = res.data.posts;
      setPosts((prev) => reset ? newPosts : [...prev, ...newPosts]);
      setHasMore(pg < res.data.pages);
      setPage(pg);
    } catch { toast.error('Failed to load feed'); }
    finally { setLoading(false); setLoadingMore(false); }
  };

  useEffect(() => { fetchPosts(1, true); }, [filterType]);

  // Infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting && hasMore && !loadingMore) fetchPosts(page + 1); },
      { threshold: 0.1 }
    );
    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [hasMore, loadingMore, page]);

  const handlePost = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    setSubmitting(true);
    try {
      const res = await api.post('/feed', {
        content: content.trim(),
        type: postType,
        tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
      });
      setPosts((prev) => [res.data.post, ...prev]);
      setContent('');
      setTags('');
      toast.success('Posted!');
    } catch { toast.error('Failed to post'); }
    finally { setSubmitting(false); }
  };

  const handleLike = async (postId) => {
    try {
      const res = await api.put(`/feed/${postId}/like`);
      setPosts((prev) => prev.map((p) =>
        p._id === postId
          ? { ...p, likes: res.data.liked
              ? [...(p.likes || []), user._id]
              : (p.likes || []).filter((l) => (l._id || l)?.toString() !== user._id?.toString()) }
          : p
      ));
    } catch { toast.error('Failed to like'); }
  };

  const handleComment = async (postId, commentText) => {
    try {
      const res = await api.post(`/feed/${postId}/comment`, { content: commentText });
      setPosts((prev) => prev.map((p) => p._id === postId ? res.data.post : p));
    } catch { toast.error('Failed to comment'); }
  };

  const handleDelete = async (postId) => {
    try {
      await api.delete(`/feed/${postId}`);
      setPosts((prev) => prev.filter((p) => p._id !== postId));
      toast.success('Post deleted');
    } catch { toast.error('Failed to delete'); }
  };

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 pb-24 lg:pb-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Alumni Feed</h1>
        <p className="text-slate-600 text-sm mt-1">Stories, tips, and opportunities from the community</p>
      </div>

      {/* Create post */}
      <div className="card mb-6">
        <form onSubmit={handlePost} className="space-y-3">
          <div className="flex gap-3">
            <div className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
              {user?.profilePhoto ? (
                <img src={user.profilePhoto} className="w-9 h-9 rounded-full object-cover" alt="" />
              ) : (
                <span className="text-primary-600 font-bold">{user?.name?.[0]}</span>
              )}
            </div>
            <textarea
              className="input flex-1 resize-none text-sm"
              rows={3}
              placeholder="Share a career tip, story, or opportunity with the community..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              maxLength={2000}
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 pl-12">
            {/* Type selector */}
            <div className="flex gap-1 flex-wrap">
              {POST_TYPES.map((t) => (
                <button
                  type="button"
                  key={t}
                  onClick={() => setPostType(t)}
                  className={`text-xs px-2.5 py-1 rounded-full font-medium transition-colors flex items-center gap-1 ${
                    postType === t ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {React.createElement(typeIcons[t], { size: 12 })}
                  {typeLabels[t]}
                </button>
              ))}
            </div>

            <input
              className="input text-xs flex-1 min-w-32"
              placeholder="Tags (comma separated)"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />

            <button type="submit" className="btn-primary text-sm flex items-center gap-1.5" disabled={!content.trim() || submitting}>
              <Send size={14} /> {submitting ? 'Posting...' : 'Post'}
            </button>
          </div>
        </form>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
        <button onClick={() => setFilterType('')}
          className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${!filterType ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-700'}`}>
          All
        </button>
        {POST_TYPES.map((t) => (
          <button key={t} onClick={() => setFilterType(filterType === t ? '' : t)}
            className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium transition-colors flex items-center gap-1 ${filterType === t ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
            {React.createElement(typeIcons[t], { size: 12 })}
            {typeLabels[t]}
          </button>
        ))}
      </div>

      {/* Posts */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => <PostCardSkeleton key={i} />)}
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-24 text-slate-500">
          <Rss size={48} className="mx-auto mb-4 opacity-20" />
          <p className="text-lg font-medium">Nothing here yet</p>
          <p className="text-sm mt-1">Be the first to post in the community!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <FeedPost
              key={post._id}
              post={post}
              onLike={handleLike}
              onComment={handleComment}
              onDelete={handleDelete}
            />
          ))}
          {/* Infinite scroll trigger */}
          <div ref={loaderRef} className="py-4 text-center">
            {loadingMore && <span className="text-sm text-slate-500">Loading more...</span>}
            {!hasMore && posts.length > 0 && <span className="text-sm text-slate-400">You've reached the end</span>}
          </div>
        </div>
      )}
    </main>
  );
}


