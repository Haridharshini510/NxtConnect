import { Link } from 'react-router-dom';
import { MessageSquare, Clock, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const statusConfig = {
  pending: { label: 'Pending', color: 'text-yellow-600 bg-yellow-50', icon: Clock },
  active: { label: 'Active', color: 'text-green-600 bg-green-50', icon: CheckCircle },
  declined: { label: 'Declined', color: 'text-red-600 bg-red-50', icon: XCircle },
  closed: { label: 'Closed', color: 'text-gray-600 bg-gray-100', icon: XCircle },
};

export default function ConnectionCard({ connection, onAccept, onDecline }) {
  const { user } = useAuth();
  const isMentor = user.role === 'mentor';
  const other = isMentor ? connection.studentId : connection.mentorId;
  const chatRoomId = connection.chatRoomId?._id || connection.chatRoomId;
  const status = statusConfig[connection.status] || statusConfig.pending;
  const StatusIcon = status.icon;

  return (
    <div className="card flex flex-col sm:flex-row items-start sm:items-center gap-4">
      {/* Avatar */}
      {other?.profilePhoto ? (
        <img src={other.profilePhoto} className="w-12 h-12 rounded-full object-cover flex-shrink-0" alt={other.name} />
      ) : (
        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
          <span className="text-blue-600 font-bold">{other?.name?.[0]}</span>
        </div>
      )}

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="font-semibold text-gray-900">{other?.name}</h3>
          <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${status.color}`}>
            <StatusIcon size={11} /> {status.label}
          </span>
        </div>
        <p className="text-sm text-gray-500">{other?.industry || other?.college}</p>
        {connection.requestMessage && (
          <p className="text-sm text-gray-600 mt-1 italic line-clamp-1">"{connection.requestMessage}"</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2 flex-shrink-0">
        {connection.status === 'active' && chatRoomId && (
          <Link to={`/chat/${chatRoomId}`} className="btn-primary flex items-center gap-1 text-sm">
            <MessageSquare size={14} /> Chat
          </Link>
        )}
        {isMentor && connection.status === 'pending' && (
          <>
            <button onClick={() => onAccept(connection._id)} className="btn-primary text-sm">Accept</button>
            <button onClick={() => onDecline(connection._id)} className="btn-secondary text-sm">Decline</button>
          </>
        )}
      </div>
    </div>
  );
}
