import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { Send } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Chat() {
  const { roomId } = useParams();
  const { user } = useAuth();
  const { socket, isConnected } = useSocket();
  const [messages, setMessages] = useState([]);
  const [roomReady, setRoomReady] = useState(false);
  const [text, setText] = useState('');
  const [typing, setTyping] = useState(false);
  const [otherTyping, setOtherTyping] = useState(false);
  const bottomRef = useRef(null);
  const typingTimeout = useRef(null);

  useEffect(() => {
    if (!socket) return;

    const handleConnect = () => {
      socket.emit('join_room', roomId);
    };

    const handleMessageReceived = ({ message }) => {
      setMessages((prev) => [...prev, message]);
    };

    const handleUserTyping = ({ isTyping }) => {
      setOtherTyping(isTyping);
    };

    const handleSocketError = (payload) => {
      const message = typeof payload === 'string' ? payload : payload?.message;
      if (message) {
        toast.error(message);
      }
    };

    socket.on('connect', handleConnect);
    socket.on('message_received', handleMessageReceived);
    socket.on('user_typing', handleUserTyping);
    socket.on('error', handleSocketError);
    socket.on('connect_error', handleSocketError);

    if (socket.connected) {
      socket.emit('join_room', roomId);
    }

    return () => {
      socket.emit('leave_room', roomId);
      socket.off('connect', handleConnect);
      socket.off('message_received', handleMessageReceived);
      socket.off('user_typing', handleUserTyping);
      socket.off('error', handleSocketError);
      socket.off('connect_error', handleSocketError);
    };
  }, [socket, roomId]);

  // Fetch existing messages
  useEffect(() => {
    setRoomReady(false);
    api.get(`/chat/${roomId}`)
      .then((res) => {
        setMessages(res.data.messages);
        setRoomReady(true);
      })
      .catch((err) => {
        toast.error(err.response?.data?.message || 'Failed to load chat room');
        setMessages([]);
      });
  }, [roomId]);

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, otherTyping]);

  const handleSend = () => {
    if (!socket || !isConnected || !roomReady || !text.trim()) return;

    socket.emit('send_message', { roomId, content: text.trim() });
    setText('');
    clearTimeout(typingTimeout.current);
    setTyping(false);
    socket.emit('user_typing', { roomId, isTyping: false });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTyping = (e) => {
    setText(e.target.value);
    if (!socket) return;

    if (!typing) {
      setTyping(true);
      socket.emit('user_typing', { roomId, isTyping: true });
    }
    clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      setTyping(false);
      socket.emit('user_typing', { roomId, isTyping: false });
    }, 1500);
  };

  const formatTime = (date) =>
    new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const isMe = (msg) => {
    const senderId = msg.senderId?._id || msg.senderId;
    return senderId?.toString() === user._id?.toString();
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)]">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 pb-20 md:pb-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-400 py-10 text-sm">
            No messages yet. Say hello! 👋
          </div>
        )}

        {messages.map((msg, i) => {
          const mine = isMe(msg);
          return (
            <div key={msg._id || i} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs sm:max-w-md lg:max-w-lg rounded-2xl px-4 py-2.5 ${
                mine ? 'bg-blue-600 text-white rounded-br-sm' : 'bg-white border border-gray-200 text-gray-900 rounded-bl-sm shadow-sm'
              }`}>
                <p className="text-sm whitespace-pre-wrap break-words">{msg.content}</p>
                <p className={`text-xs mt-1 ${mine ? 'text-blue-200' : 'text-gray-400'}`}>
                  {formatTime(msg.sentAt)}
                </p>
              </div>
            </div>
          );
        })}

        {otherTyping && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
              <div className="flex gap-1 items-center">
                {[0, 1, 2].map((i) => (
                  <span key={i} className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }} />
                ))}
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div className="border-t border-gray-200 bg-white px-4 py-3 fixed bottom-0 md:bottom-0 left-0 right-0 md:relative">
        <div className="flex gap-2 max-w-4xl mx-auto">
          <textarea
            className="input resize-none flex-1"
            rows={1}
            placeholder="Type a message..."
            value={text}
            onChange={handleTyping}
            onKeyDown={handleKeyDown}
          />
          <button
            onClick={handleSend}
            disabled={!text.trim()}
            className="btn-primary px-4 flex-shrink-0 flex items-center justify-center"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
