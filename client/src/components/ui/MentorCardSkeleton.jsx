import Skeleton from './Skeleton';

export default function MentorCardSkeleton() {
  return (
    <div className="card p-4 space-y-3">
      {/* Avatar + header */}
      <div className="flex gap-3">
        <Skeleton variant="circle" width="48px" height="48px" />
        <div className="flex-1 space-y-2">
          <Skeleton width="80%" height="16px" />
          <Skeleton width="60%" height="14px" />
        </div>
      </div>

      {/* Badge */}
      <Skeleton width="40%" height="20px" />

      {/* Bio */}
      <div className="space-y-1">
        <Skeleton width="100%" height="14px" />
        <Skeleton width="85%" height="14px" />
      </div>

      {/* Skills */}
      <div className="flex gap-2">
        <Skeleton width="60px" height="24px" />
        <Skeleton width="50px" height="24px" />
        <Skeleton width="55px" height="24px" />
      </div>

      {/* Stats */}
      <div className="flex gap-2 pt-2">
        <Skeleton width="60px" height="14px" />
        <Skeleton width="50px" height="14px" />
        <Skeleton width="50px" height="14px" />
      </div>

      {/* Button */}
      <Skeleton width="100%" height="36px" />
    </div>
  );
}
