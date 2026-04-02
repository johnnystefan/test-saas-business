import { Card, BadgeStatus, SectionHeader } from '@saas/shared-ui';
import type { Membership } from '@saas/shared-types';

interface MembershipsSummaryProps {
  memberships: Membership[];
}

export function MembershipsSummary({ memberships }: MembershipsSummaryProps) {
  const active = memberships.filter((m) => m.status === 'ACTIVE');

  return (
    <div>
      <SectionHeader title="My Memberships" />
      <div className="flex flex-col gap-3 mt-3">
        {active.length === 0 ? (
          <Card>
            <p className="text-[#9CA3AF] text-sm text-center">
              No active memberships
            </p>
          </Card>
        ) : (
          active.slice(0, 2).map((membership) => (
            <Card
              key={membership.id}
              className="flex items-center justify-between"
            >
              <div>
                <p className="text-[#E5E7EB] font-medium text-sm">Membership</p>
                <p className="text-[#9CA3AF] text-xs mt-0.5">
                  Until{' '}
                  {new Date(membership.endDate ?? '').toLocaleDateString()}
                </p>
              </div>
              <BadgeStatus status="active" />
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
