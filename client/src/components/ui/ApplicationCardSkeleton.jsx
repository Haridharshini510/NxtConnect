import Skeleton from './Skeleton';

export default function ApplicationCardSkeleton() {
  return (
    <div className="card p-4 space-y-3">
      {/* Company + role */}
      <div className="space-y-1">
        <Skeleton width="75%" height="14px" />
        <Skeleton width="60%" height="12px" />
      </div>

      {/* Type + priority chips */}
      <div className="flex gap-2">
        <Skeleton width="70px" height="20px" />
        <Skeleton width="60px" height="20px" />
      </div>

      {/* Date */}
      <Skeleton width="50%" height="12px" />

      {/* Salary */}
      <Skeleton width="60px" height="14px" />

      {/* Status select */}
      <Skeleton width="100%" height="32px" />
    </div>
  );
}
