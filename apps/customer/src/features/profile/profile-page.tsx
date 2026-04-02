import { useQuery } from '@tanstack/react-query';
import { Card, SectionHeader, SkeletonCard } from '@saas/shared-ui';
import { useAuthStore } from '../../lib/stores/auth.store';
import { getMemberships } from '../../lib/api/club.api';
import { ProfileHeader } from './profile-header';

export function ProfilePage() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const { data: memberships, isLoading } = useQuery({
    queryKey: ['memberships'],
    queryFn: getMemberships,
  });

  // Derive member status from memberships list (no /members/me endpoint — AD from design)
  const isActiveMember = (memberships ?? []).some((m) => m.status === 'ACTIVE');

  if (!user) return null;

  return (
    <div className="px-4 pt-2 flex flex-col gap-4">
      {/* Profile Header */}
      <ProfileHeader
        name={user.name}
        email={user.email}
        isActiveMember={isActiveMember}
      />

      {/* Stats (placeholders — no backend data yet) */}
      <SectionHeader title="My Stats" />
      {isLoading ? (
        <SkeletonCard lines={3} />
      ) : (
        <Card className="grid grid-cols-3 gap-4 text-center">
          {[
            { label: 'Sessions', value: '--' },
            { label: 'Attendance', value: '--%' },
            { label: 'Streak', value: '--' },
          ].map(({ label, value }) => (
            <div key={label}>
              <p className="text-[#E5E7EB] text-xl font-bold">{value}</p>
              <p className="text-[#9CA3AF] text-xs mt-0.5">{label}</p>
            </div>
          ))}
        </Card>
      )}

      {/* Memberships count */}
      <SectionHeader title="Memberships" />
      <Card className="flex items-center justify-between">
        <p className="text-[#E5E7EB] text-sm">Total memberships</p>
        <p className="text-[#22C55E] font-bold">{memberships?.length ?? 0}</p>
      </Card>

      {/* Book Session (disabled — no backend) */}
      <Card>
        <p className="text-[#9CA3AF] text-sm text-center mb-3">
          Session Booking
        </p>
        <button
          disabled
          className="w-full py-3 rounded-xl bg-[#22C55E]/20 text-[#22C55E]/50 text-sm font-semibold cursor-not-allowed"
        >
          Book New Session (Coming Soon)
        </button>
      </Card>

      {/* Logout */}
      <button
        onClick={logout}
        className="w-full py-3 rounded-xl border border-red-500/30 text-red-400 text-sm font-medium mt-2 mb-6"
      >
        Sign Out
      </button>
    </div>
  );
}
