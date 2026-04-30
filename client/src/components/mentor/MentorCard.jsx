import { Link } from 'react-router-dom';
import { Star, Briefcase, Users, UserPlus } from 'lucide-react';
import { Card, Badge, Avatar, Button } from '../ui';

/**
 * REFACTORED MENTOR CARD
 * Uses design system components for consistency
 */
export default function MentorCard({ mentor, matchScore }) {
  const user = mentor.userId || mentor;
  const profile = mentor.mentorProfile || (mentor.userId ? mentor : null);

  return (
    <Link to={`/mentors/${user._id}`}>
      <Card className="h-full hover:shadow-lg transition-all cursor-pointer group">
        <Card.Body className="flex flex-col gap-4 h-full">
          {/* Header with Avatar and Match Score */}
          <div className="flex items-start gap-3">
            <Avatar
              src={user.profilePhoto}
              initials={user.name?.[0]}
              size="lg"
            />
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-slate-900 group-hover:text-primary-600 transition-colors">
                {user.name}
              </h3>
              {profile && (
                <p className="text-sm text-slate-600 truncate">
                  {profile.jobTitle} at {profile.currentCompany}
                </p>
              )}
            </div>
            {matchScore !== undefined && (
              <div className="flex flex-col items-center flex-shrink-0">
                <div className="text-2xl font-bold text-primary-600">{matchScore}%</div>
                <div className="text-xs text-slate-500 font-medium">Match</div>
              </div>
            )}
          </div>

          {/* Industry Badge */}
          {user.industry && (
            <Badge variant="info" size="sm">
              {user.industry}
            </Badge>
          )}

          {/* Bio */}
          {user.bio && (
            <p className="text-sm text-slate-600 line-clamp-2">
              {user.bio}
            </p>
          )}

          {/* Skills */}
          {user.skills?.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {user.skills.slice(0, 3).map((skill) => (
                <Badge key={skill} variant="default" size="sm">
                  {skill}
                </Badge>
              ))}
              {user.skills.length > 3 && (
                <span className="text-xs text-slate-500 font-medium">
                  +{user.skills.length - 3}
                </span>
              )}
            </div>
          )}

          {/* Stats */}
          {profile && (
            <div className="flex items-center gap-3 text-xs text-slate-600 pt-3 mt-auto border-t border-slate-200">
              <span className="flex items-center gap-1">
                <Briefcase size={14} className="text-slate-400" />
                {profile.yearsOfExperience}y exp
              </span>
              {profile.rating > 0 && (
                <span className="flex items-center gap-1">
                  <Star size={14} className="text-warning-500" />
                  {profile.rating.toFixed(1)}
                </span>
              )}
              <span className="flex items-center gap-1 ml-auto">
                <Users size={14} className="text-slate-400" />
                {profile.currentMenteesCount}/{profile.maxMentees}
              </span>
            </div>
          )}

          {/* Connect Button */}
          <Button variant="primary" size="sm" className="w-full mt-4">
            <UserPlus size={16} />
            Connect
          </Button>
        </Card.Body>
      </Card>
    </Link>
  );
}
