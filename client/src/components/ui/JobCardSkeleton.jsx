import Skeleton from './Skeleton';

export default function JobCardSkeleton() {
  return (
    <div className="card p-4 space-y-3">
      {/* Company + role */}
      <div className="space-y-2">
        <Skeleton width="70%" height="16px" />
        <Skeleton width="90%" height="18px" />
      </div>

      {/* Location + type chips */}
      <div className="flex gap-2">
        <Skeleton width="80px" height="24px" />
        <Skeleton width="70px" height="24px" />
      </div>

      {/* Description */}
      <div className="space-y-1">
        <Skeleton width="100%" height="14px" />
        <Skeleton width="100%" height="14px" />
        <Skeleton width="70%" height="14px" />
      </div>

      {/* Salary */}
      <Skeleton width="80px" height="16px" />

      {/* Button */}
      <Skeleton width="100%" height="36px" />
    </div>
  );
}
