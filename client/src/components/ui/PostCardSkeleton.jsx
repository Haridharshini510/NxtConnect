import Skeleton from './Skeleton';

export default function PostCardSkeleton() {
  return (
    <div className="card p-4 space-y-3">
      {/* Author header */}
      <div className="flex gap-3">
        <Skeleton variant="circle" width="40px" height="40px" />
        <div className="flex-1 space-y-1">
          <Skeleton width="60%" height="14px" />
          <Skeleton width="40%" height="12px" />
        </div>
      </div>

      {/* Type badge */}
      <Skeleton width="50px" height="20px" />

      {/* Content */}
      <div className="space-y-2">
        <Skeleton width="100%" height="14px" />
        <Skeleton width="100%" height="14px" />
        <Skeleton width="80%" height="14px" />
      </div>

      {/* Tags */}
      <div className="flex gap-2">
        <Skeleton width="60px" height="20px" />
        <Skeleton width="70px" height="20px" />
      </div>

      {/* Engagement footer */}
      <div className="flex gap-4 pt-2">
        <Skeleton width="50px" height="14px" />
        <Skeleton width="50px" height="14px" />
        <Skeleton width="50px" height="14px" />
      </div>
    </div>
  );
}
