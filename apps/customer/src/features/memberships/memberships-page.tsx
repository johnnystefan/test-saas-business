import { SectionHeader, SkeletonCard } from '@saas/shared-ui';
import { useMemberships } from './use-memberships';
import { MembershipCard } from './membership-card';

export function MembershipsPage() {
  const { memberships, isLoading, isError } = useMemberships();

  return (
    <div className="px-4 pt-6 flex flex-col gap-4">
      <SectionHeader title="My Memberships" />

      {isLoading && (
        <>
          <SkeletonCard lines={3} />
          <SkeletonCard lines={3} />
        </>
      )}

      {isError && (
        <p className="text-red-400 text-sm text-center py-8">
          Failed to load memberships. Please try again.
        </p>
      )}

      {!isLoading && !isError && memberships.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <span className="text-4xl">🎫</span>
          <p className="text-[#9CA3AF] text-sm text-center">
            No memberships found. Contact your academy.
          </p>
        </div>
      )}

      {!isLoading &&
        !isError &&
        memberships.map((m) => <MembershipCard key={m.id} membership={m} />)}
    </div>
  );
}
