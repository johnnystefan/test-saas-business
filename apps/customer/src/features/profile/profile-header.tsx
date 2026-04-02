import { BadgeStatus } from '@saas/shared-ui';

interface ProfileHeaderProps {
  name: string;
  email: string;
  isActiveMember: boolean;
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

export function ProfileHeader({
  name,
  email,
  isActiveMember,
}: ProfileHeaderProps) {
  const initials = getInitials(name);

  return (
    <div className="flex flex-col items-center gap-3 py-6">
      {/* Avatar with initials */}
      <div className="w-20 h-20 rounded-full bg-[#22C55E]/20 border-2 border-[#22C55E] flex items-center justify-center">
        <span className="text-[#22C55E] text-2xl font-bold">{initials}</span>
      </div>

      {/* Name + status */}
      <div className="flex flex-col items-center gap-1">
        <h1 className="text-[#E5E7EB] text-xl font-bold">{name}</h1>
        <p className="text-[#9CA3AF] text-sm">{email}</p>
        <div className="mt-1">
          <BadgeStatus
            status={isActiveMember ? 'active' : 'inactive'}
            label={isActiveMember ? 'Active Member' : 'Inactive'}
          />
        </div>
      </div>
    </div>
  );
}
