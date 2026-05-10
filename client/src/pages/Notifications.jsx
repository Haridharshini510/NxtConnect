import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  Trash2,
  CheckCheck,
  Handshake,
  PartyPopper,
  XCircle,
  MessageCircle,
  CalendarCheck,
  GraduationCap,
  Heart,
} from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';
import { PageSkeleton } from '../components/ui';

const typeIcons = {
  connection_request: Handshake,
  connection_accepted: PartyPopper,
  connection_declined: XCircle,
  new_message: MessageCircle,
  session_booked: CalendarCheck,
  event_registered: GraduationCap,
  feed_like: Heart,
  feed_comment: MessageCircle,
  default: Bell,
};

export default function Notifications() {
  const { notifications, unreadCount, loading, fetchNotifications, markRead, markAllRead, deleteNotification } = useNotifications();
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  if (loading) return <PageSkeleton variant="notifications" />;

  const timeAgo = (date) => {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  const handleClick = async (notif) => {
    if (!notif.isRead) await markRead(notif._id);
    if (notif.link) navigate(notif.link);
  };

  return (
    <main className="max-w-2xl mr-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 lg:pb-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="section-headline">Notifications</h1>
          {unreadCount > 0 && (
            <p className="text-sm text-slate-600 mt-0.5">{unreadCount} unread</p>
          )}
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllRead} className="btn-secondary flex items-center gap-1.5 text-sm">
            <CheckCheck size={15} /> Mark all read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="text-center py-24 text-slate-500">
          <Bell size={48} className="mx-auto mb-4 opacity-20" />
          <p className="text-lg font-medium">No notifications yet</p>
          <p className="text-sm mt-1">We'll let you know when something happens.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((notif) => {
            const TypeIcon = typeIcons[notif.type] || typeIcons.default;
            return (
              <div
                key={notif._id}
                onClick={() => handleClick(notif)}
                className={`card flex items-start gap-4 cursor-pointer hover:shadow-md transition-all ${
                  !notif.isRead ? 'border-l-4 border-l-blue-500 bg-primary-50/20' : ''
                }`}
              >
                <span className="text-primary-600 flex-shrink-0 mt-0.5">
                  <TypeIcon size={18} />
                </span>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-semibold text-slate-900 text-sm">{notif.title}</p>
                    {!notif.isRead && <span className="w-2 h-2 rounded-full bg-primary-500 flex-shrink-0 mt-1.5" />}
                  </div>
                  <p className="text-sm text-slate-700 mt-0.5">{notif.body}</p>
                  <p className="text-xs text-slate-500 mt-1.5">{timeAgo(notif.createdAt)}</p>
                </div>

                <button
                  onClick={(e) => { e.stopPropagation(); deleteNotification(notif._id); }}
                  className="flex-shrink-0 p-1 text-slate-400 hover:text-red-400 transition-colors"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}


