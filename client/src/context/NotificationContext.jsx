import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { notificationAPI } from '../api';
import { useAuth } from './AuthContext';
import { useSocket } from './SocketContext';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const { user } = useAuth();
  const { socket } = useSocket();
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await notificationAPI.getAll();
      setNotifications(data.notifications);
      setUnreadCount(data.unreadCount);
    } catch {}
    finally { setLoading(false); }
  }, []);

  useEffect(() => {
    if (!user) return;

    notificationAPI.getUnreadCount()
      .then(({ data }) => setUnreadCount(data.count))
      .catch(() => {});
  }, [user]);

  useEffect(() => {
    if (!user) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    fetchNotifications();
  }, [user, fetchNotifications]);

  useEffect(() => {
    if (!socket) return;

    const handleNew = (notification) => {
      setUnreadCount((count) => count + 1);
      setNotifications((prev) => [notification, ...prev]);

      toast(notification.body || notification.title || 'New notification', {
        icon: 'Bell',
        duration: 5000,
        style: { maxWidth: '360px' },
      });
    };

    socket.on('notification:new', handleNew);
    return () => socket.off('notification:new', handleNew);
  }, [socket]);

  const markRead = useCallback(async (id) => {
    await notificationAPI.markRead(id);
    setNotifications((prev) =>
      prev.map((notification) => (
        notification._id === id ? { ...notification, isRead: true } : notification
      ))
    );
    setUnreadCount((count) => Math.max(0, count - 1));
  }, []);

  const markAllRead = useCallback(async () => {
    await notificationAPI.markAllRead();
    setNotifications((prev) => prev.map((notification) => ({ ...notification, isRead: true })));
    setUnreadCount(0);
  }, []);

  const deleteNotification = useCallback(async (id) => {
    await notificationAPI.delete(id);
    setNotifications((prev) => prev.filter((notification) => notification._id !== id));
  }, []);

  return (
    <NotificationContext.Provider
      value={{ unreadCount, notifications, loading, fetchNotifications, markRead, markAllRead, deleteNotification }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
