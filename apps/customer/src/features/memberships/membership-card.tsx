import { Card, BadgeStatus } from '@saas/shared-ui';
import type { Membership } from '@saas/shared-types';

interface MembershipCardProps {
  membership: Membership;
}

// Map MembershipStatus to BadgeStatus variant
function toStatusVariant(
  status: string,
): 'active' | 'expired' | 'cancelled' | 'pending' {
  const map: Record<string, 'active' | 'expired' | 'cancelled' | 'pending'> = {
    ACTIVE: 'active',
    EXPIRED: 'expired',
    CANCELLED: 'cancelled',
    PENDING: 'pending',
  };
  return map[status] ?? 'pending';
}

export function MembershipCard({ membership }: MembershipCardProps) {
  const startDate = new Date(membership.startDate).toLocaleDateString();
  const endDate = membership.endDate
    ? new Date(membership.endDate).toLocaleDateString()
    : 'No end date';

  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="text-[#E5E7EB] font-semibold">Membership</p>
        <BadgeStatus status={toStatusVariant(membership.status)} />
      </div>
      <div className="flex flex-col gap-1">
        <div className="flex justify-between text-sm">
          <span className="text-[#9CA3AF]">Start</span>
          <span className="text-[#E5E7EB]">{startDate}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-[#9CA3AF]">End</span>
          <span className="text-[#E5E7EB]">{endDate}</span>
        </div>
      </div>
      {membership.status === 'EXPIRED' && (
        <button
          className="w-full mt-1 py-2 rounded-xl bg-[#22C55E] text-black text-sm font-semibold"
          disabled
        >
          Renew Now (Coming Soon)
        </button>
      )}
    </Card>
  );
}
