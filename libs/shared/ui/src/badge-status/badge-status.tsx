import { clsx } from 'clsx';

export type BadgeStatusVariant =
  | 'active'
  | 'expired'
  | 'cancelled'
  | 'pending'
  | 'inactive'
  | 'suspended'
  | 'trial';

interface BadgeStatusProps {
  status: BadgeStatusVariant;
  label?: string;
}

const VARIANT_CLASSES: Record<BadgeStatusVariant, string> = {
  active: 'bg-[#22C55E]/20 text-[#22C55E]',
  expired: 'bg-red-500/20 text-red-400',
  cancelled: 'bg-red-500/20 text-red-400',
  pending: 'bg-yellow-500/20 text-yellow-400',
  trial: 'bg-yellow-500/20 text-yellow-400',
  inactive: 'bg-gray-500/20 text-gray-400',
  suspended: 'bg-gray-500/20 text-gray-400',
};

export function BadgeStatus({ status, label }: BadgeStatusProps) {
  return (
    <span
      className={clsx(
        'rounded-full px-3 py-1 text-xs font-semibold uppercase',
        VARIANT_CLASSES[status],
      )}
    >
      {label ?? status}
    </span>
  );
}
