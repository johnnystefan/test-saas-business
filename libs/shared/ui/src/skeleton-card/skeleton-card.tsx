import { clsx } from 'clsx';

interface SkeletonCardProps {
  lines?: number;
  className?: string;
}

export function SkeletonCard({ lines = 3, className }: SkeletonCardProps) {
  return (
    <div
      className={clsx('animate-pulse bg-[#111827] rounded-2xl p-4', className)}
    >
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className={clsx(
            'bg-[#9CA3AF]/20 rounded h-4 mb-2',
            index === lines - 1 && 'mb-0',
          )}
        />
      ))}
    </div>
  );
}
