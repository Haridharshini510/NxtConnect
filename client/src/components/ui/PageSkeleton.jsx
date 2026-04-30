import Skeleton from './Skeleton';

/**
 * PageSkeleton — full-page loading states for each major page layout.
 * Usage: <PageSkeleton variant="mentorProfile" />
 */

// ─── Shared building blocks ───────────────────────────────────────────────────

const ShimmerBlock = ({ className = '' }) => (
  <div
    className={`bg-gradient-to-r from-slate-100 via-slate-50 to-slate-100 animate-shimmer rounded-lg ${className}`}
    style={{ backgroundSize: '200% 100%' }}
  />
);

const CardShell = ({ children, className = '' }) => (
  <div className={`card space-y-3 ${className}`}>{children}</div>
);

// ─── Variants ─────────────────────────────────────────────────────────────────

function DashboardSkeleton() {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 md:pb-8 space-y-8">
      {/* Heading */}
      <div className="space-y-2">
        <ShimmerBlock className="h-8 w-56" />
        <ShimmerBlock className="h-4 w-80" />
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <CardShell key={i} className="text-center py-4 items-center">
            <ShimmerBlock className="h-5 w-5 mx-auto rounded-full" />
            <ShimmerBlock className="h-8 w-16 mx-auto" />
            <ShimmerBlock className="h-3 w-24 mx-auto" />
          </CardShell>
        ))}
      </div>

      {/* Quick actions */}
      <div className="space-y-3">
        <ShimmerBlock className="h-5 w-32" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <CardShell key={i}>
              <ShimmerBlock className="h-10 w-10 rounded-lg" />
              <ShimmerBlock className="h-4 w-28" />
              <ShimmerBlock className="h-3 w-36" />
            </CardShell>
          ))}
        </div>
      </div>

      {/* Recent connections */}
      <div className="space-y-3">
        <ShimmerBlock className="h-5 w-40" />
        {[...Array(3)].map((_, i) => (
          <CardShell key={i} className="flex-row items-center gap-3 !space-y-0">
            <ShimmerBlock className="w-10 h-10 rounded-full flex-shrink-0" />
            <div className="flex-1 space-y-1.5">
              <ShimmerBlock className="h-4 w-32" />
              <ShimmerBlock className="h-3 w-20" />
            </div>
          </CardShell>
        ))}
      </div>
    </main>
  );
}

function MentorProfileSkeleton() {
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 pb-24 lg:pb-8 space-y-6">
      {/* Header card */}
      <CardShell>
        <div className="flex flex-col sm:flex-row gap-6">
          <ShimmerBlock className="w-24 h-24 rounded-full flex-shrink-0" />
          <div className="flex-1 space-y-3">
            <ShimmerBlock className="h-7 w-48" />
            <ShimmerBlock className="h-4 w-64" />
            <ShimmerBlock className="h-5 w-24 rounded-full" />
            <div className="flex gap-4 pt-1">
              <ShimmerBlock className="h-4 w-20" />
              <ShimmerBlock className="h-4 w-20" />
              <ShimmerBlock className="h-4 w-16" />
            </div>
          </div>
          <div className="space-y-2 sm:min-w-[140px]">
            <ShimmerBlock className="h-10 w-full rounded-xl" />
            <ShimmerBlock className="h-10 w-full rounded-xl" />
          </div>
        </div>
        <ShimmerBlock className="h-4 w-full mt-2" />
        <ShimmerBlock className="h-4 w-3/4" />
      </CardShell>

      {/* Skills + Expertise */}
      <div className="grid sm:grid-cols-2 gap-6">
        {[...Array(2)].map((_, i) => (
          <CardShell key={i}>
            <ShimmerBlock className="h-5 w-24" />
            <div className="flex flex-wrap gap-2">
              {[...Array(5)].map((_, j) => (
                <ShimmerBlock key={j} className="h-7 w-16 rounded-full" />
              ))}
            </div>
          </CardShell>
        ))}
      </div>

      {/* Career journey */}
      <CardShell>
        <ShimmerBlock className="h-5 w-36" />
        <div className="space-y-4 pt-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex gap-4">
              <ShimmerBlock className="w-3 h-3 rounded-full flex-shrink-0 mt-1" />
              <div className="flex-1 space-y-1.5 pb-4">
                <ShimmerBlock className="h-4 w-40" />
                <ShimmerBlock className="h-3 w-32" />
              </div>
            </div>
          ))}
        </div>
      </CardShell>
    </main>
  );
}

function RoadmapDetailSkeleton() {
  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 pb-20 md:pb-8 space-y-6">
      {/* Back link */}
      <ShimmerBlock className="h-4 w-32" />

      {/* Header */}
      <CardShell>
        <ShimmerBlock className="h-5 w-20 rounded-full" />
        <ShimmerBlock className="h-8 w-64" />
        <ShimmerBlock className="h-4 w-full" />
        <ShimmerBlock className="h-4 w-3/4" />
        {/* Progress bar */}
        <div className="space-y-2 pt-2">
          <div className="flex justify-between">
            <ShimmerBlock className="h-3 w-24" />
            <ShimmerBlock className="h-3 w-10" />
          </div>
          <ShimmerBlock className="h-2 w-full rounded-full" />
        </div>
      </CardShell>

      {/* Steps */}
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <CardShell key={i} className="border-l-4 border-l-slate-200">
            <div className="flex gap-4">
              <ShimmerBlock className="w-6 h-6 rounded-full flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="flex gap-2">
                  <ShimmerBlock className="h-3 w-14" />
                  <ShimmerBlock className="h-3 w-16" />
                </div>
                <ShimmerBlock className="h-5 w-48" />
                <ShimmerBlock className="h-3 w-full" />
                <ShimmerBlock className="h-3 w-2/3" />
                <div className="flex gap-1 pt-1">
                  {[...Array(3)].map((_, j) => (
                    <ShimmerBlock key={j} className="h-5 w-14 rounded-full" />
                  ))}
                </div>
              </div>
            </div>
          </CardShell>
        ))}
      </div>
    </main>
  );
}

function WorkshopDetailSkeleton() {
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 pb-24 lg:pb-8 space-y-6">
      {/* Back link */}
      <ShimmerBlock className="h-4 w-32" />

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main */}
        <div className="lg:col-span-2 space-y-6">
          <CardShell>
            <div className="flex gap-2">
              <ShimmerBlock className="h-6 w-14 rounded-full" />
              <ShimmerBlock className="h-6 w-20 rounded-full" />
            </div>
            <ShimmerBlock className="h-8 w-3/4" />
            <ShimmerBlock className="h-4 w-full" />
            <ShimmerBlock className="h-4 w-full" />
            <ShimmerBlock className="h-4 w-2/3" />
            <div className="flex gap-2 pt-1">
              {[...Array(3)].map((_, i) => (
                <ShimmerBlock key={i} className="h-6 w-16 rounded-full" />
              ))}
            </div>
          </CardShell>

          <CardShell>
            <ShimmerBlock className="h-5 w-32" />
            <div className="flex gap-2">
              {[...Array(6)].map((_, i) => (
                <ShimmerBlock key={i} className="w-9 h-9 rounded-full" />
              ))}
            </div>
          </CardShell>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <CardShell>
            <ShimmerBlock className="h-5 w-28" />
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex gap-3">
                  <ShimmerBlock className="w-4 h-4 rounded flex-shrink-0" />
                  <div className="flex-1 space-y-1">
                    <ShimmerBlock className="h-4 w-full" />
                    <ShimmerBlock className="h-3 w-2/3" />
                  </div>
                </div>
              ))}
            </div>
            <ShimmerBlock className="h-10 w-full rounded-xl mt-2" />
          </CardShell>

          <CardShell>
            <ShimmerBlock className="h-3 w-16" />
            <div className="flex gap-3">
              <ShimmerBlock className="w-12 h-12 rounded-full flex-shrink-0" />
              <div className="flex-1 space-y-1.5">
                <ShimmerBlock className="h-4 w-28" />
                <ShimmerBlock className="h-3 w-20" />
              </div>
            </div>
            <ShimmerBlock className="h-3 w-full" />
            <ShimmerBlock className="h-3 w-3/4" />
          </CardShell>
        </div>
      </div>
    </main>
  );
}

function NotificationsSkeleton() {
  return (
    <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8 pb-20 lg:pb-8 space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <ShimmerBlock className="h-8 w-40" />
          <ShimmerBlock className="h-4 w-24" />
        </div>
        <ShimmerBlock className="h-9 w-32 rounded-xl" />
      </div>

      <div className="space-y-2">
        {[...Array(6)].map((_, i) => (
          <CardShell key={i} className="flex-row items-start gap-4 !space-y-0">
            <ShimmerBlock className="w-8 h-8 rounded-full flex-shrink-0" />
            <div className="flex-1 space-y-1.5">
              <ShimmerBlock className="h-4 w-48" />
              <ShimmerBlock className="h-3 w-full" />
              <ShimmerBlock className="h-3 w-16" />
            </div>
          </CardShell>
        ))}
      </div>
    </main>
  );
}

function EditProfileSkeleton() {
  return (
    <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8 pb-20 md:pb-8 space-y-6">
      <ShimmerBlock className="h-8 w-36" />

      <CardShell>
        <ShimmerBlock className="h-5 w-40 border-b border-slate-100 pb-2" />
        {[...Array(5)].map((_, i) => (
          <div key={i} className="space-y-1.5">
            <ShimmerBlock className="h-3 w-24" />
            <ShimmerBlock className="h-10 w-full rounded-xl" />
          </div>
        ))}
      </CardShell>

      <ShimmerBlock className="h-12 w-full rounded-xl" />
    </main>
  );
}

function ChatSkeleton() {
  return (
    <div className="flex flex-col h-[calc(100vh-64px)]">
      <div className="flex-1 overflow-hidden px-4 py-4 space-y-3">
        {/* Incoming */}
        <div className="flex justify-start">
          <ShimmerBlock className="h-12 w-48 rounded-2xl rounded-bl-sm" />
        </div>
        {/* Outgoing */}
        <div className="flex justify-end">
          <ShimmerBlock className="h-10 w-56 rounded-2xl rounded-br-sm" />
        </div>
        <div className="flex justify-start">
          <ShimmerBlock className="h-16 w-64 rounded-2xl rounded-bl-sm" />
        </div>
        <div className="flex justify-end">
          <ShimmerBlock className="h-10 w-40 rounded-2xl rounded-br-sm" />
        </div>
        <div className="flex justify-start">
          <ShimmerBlock className="h-10 w-52 rounded-2xl rounded-bl-sm" />
        </div>
        <div className="flex justify-end">
          <ShimmerBlock className="h-14 w-60 rounded-2xl rounded-br-sm" />
        </div>
      </div>

      {/* Input bar placeholder */}
      <div className="border-t border-slate-200 bg-white px-4 py-3">
        <div className="flex gap-2 max-w-4xl mx-auto">
          <ShimmerBlock className="flex-1 h-10 rounded-xl" />
          <ShimmerBlock className="w-12 h-10 rounded-xl flex-shrink-0" />
        </div>
      </div>
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

const VARIANTS = {
  dashboard: DashboardSkeleton,
  mentorProfile: MentorProfileSkeleton,
  roadmapDetail: RoadmapDetailSkeleton,
  workshopDetail: WorkshopDetailSkeleton,
  notifications: NotificationsSkeleton,
  editProfile: EditProfileSkeleton,
  chat: ChatSkeleton,
};

export default function PageSkeleton({ variant = 'dashboard' }) {
  const Component = VARIANTS[variant];
  if (!Component) return null;
  return <Component />;
}

