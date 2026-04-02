import { SkeletonCard } from '@saas/shared-ui';
import { useHomeData } from './use-home-data';
import { SessionWidget } from './session-widget';
import { MembershipsSummary } from './memberships-summary';
import { AcademiesScroll } from './academies-scroll';
import { useAuthStore } from '../../lib/stores/auth.store';

export function HomePage() {
  const { memberships, academies, isLoading, isEmpty } = useHomeData();
  const user = useAuthStore((state) => state.user);

  // Loading state
  if (isLoading) {
    return (
      <div className="px-4 pt-6 flex flex-col gap-4">
        <p className="text-[#9CA3AF] text-sm">Loading...</p>
        <SkeletonCard lines={3} />
        <SkeletonCard lines={2} />
        <SkeletonCard lines={2} />
      </div>
    );
  }

  // Empty state (new user)
  if (isEmpty) {
    return (
      <div className="px-4 pt-6 flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <span className="text-6xl">🏟️</span>
        <h2 className="text-[#E5E7EB] text-xl font-bold text-center">
          Welcome to The Stadium!
        </h2>
        <p className="text-[#9CA3AF] text-sm text-center">
          You don't have any memberships yet. Contact your academy to get
          started.
        </p>
      </div>
    );
  }

  // Loaded state
  return (
    <div className="px-4 pt-6 flex flex-col gap-6 pb-4">
      <div>
        <h1 className="text-[#E5E7EB] text-2xl font-bold">
          Hey, {user?.name?.split(' ')[0] ?? 'Athlete'} 👋
        </h1>
        <p className="text-[#9CA3AF] text-sm mt-1">Here's your summary</p>
      </div>
      <SessionWidget />
      <MembershipsSummary memberships={memberships} />
      <AcademiesScroll academies={academies} />
    </div>
  );
}
