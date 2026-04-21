import { Link } from 'react-router-dom';
import { Star, Building2, Briefcase, Users } from 'lucide-react';

export default function MentorCard({ mentor, matchScore }) {
  const user = mentor.userId || mentor;
  const profile = mentor.mentorProfile || (mentor.userId ? mentor : null);

  return (
    <div className="card hover:shadow-md transition-shadow flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-start gap-3">
        {user.profilePhoto ? (
          <img src={user.profilePhoto} className="w-14 h-14 rounded-full object-cover flex-shrink-0" alt={user.name} />
        ) : (
          <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
            <span className="text-blue-600 text-xl font-bold">{user.name?.[0]}</span>
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate">{user.name}</h3>
          {profile && (
            <p className="text-sm text-gray-500 truncate">{profile.jobTitle} at {profile.currentCompany}</p>
          )}
          {user.industry && (
            <span className="inline-block mt-1 text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
              {user.industry}
            </span>
          )}
        </div>
        {matchScore !== undefined && (
          <div className="flex-shrink-0 text-center">
            <div className="text-lg font-bold text-blue-600">{matchScore}%</div>
            <div className="text-xs text-gray-400">match</div>
          </div>
        )}
      </div>

      {/* Bio */}
      {user.bio && (
        <p className="text-sm text-gray-600 line-clamp-2">{user.bio}</p>
      )}

      {/* Skills */}
      {user.skills?.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {user.skills.slice(0, 4).map((s) => (
            <span key={s} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{s}</span>
          ))}
          {user.skills.length > 4 && (
            <span className="text-xs text-gray-400">+{user.skills.length - 4} more</span>
          )}
        </div>
      )}

      {/* Stats row */}
      {profile && (
        <div className="flex items-center gap-4 text-xs text-gray-500 pt-1 border-t border-gray-50">
          {profile.yearsOfExperience > 0 && (
            <span className="flex items-center gap-1">
              <Briefcase size={12} /> {profile.yearsOfExperience} yrs exp
            </span>
          )}
          {profile.rating > 0 && (
            <span className="flex items-center gap-1">
              <Star size={12} className="text-yellow-400" /> {profile.rating.toFixed(1)}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Users size={12} />
            {profile.currentMenteesCount}/{profile.maxMentees} mentees
          </span>
        </div>
      )}

      <Link
        to={`/mentors/${user._id}`}
        className="btn-primary text-center text-sm mt-auto"
      >
        View Profile
      </Link>
    </div>
  );
}   
