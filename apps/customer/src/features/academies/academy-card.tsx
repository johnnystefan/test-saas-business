import { Card } from '@saas/shared-ui';
import type { BusinessUnitPrimitives } from '@saas/shared-types';

interface AcademyCardProps {
  academy: BusinessUnitPrimitives;
}

export function AcademyCard({ academy }: AcademyCardProps) {
  const typeLabel = academy.type
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <Card className="flex flex-col gap-2">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[#E5E7EB] font-semibold">{academy.name}</p>
          <p className="text-[#9CA3AF] text-xs mt-0.5">{typeLabel}</p>
        </div>
        <span
          className={`w-2 h-2 rounded-full mt-1 ${academy.isActive ? 'bg-[#22C55E]' : 'bg-[#9CA3AF]'}`}
        />
      </div>
      <div className="border-t border-[#9CA3AF]/10 pt-2">
        <p className="text-[#9CA3AF] text-xs">Next Session</p>
        <p className="text-[#E5E7EB] text-sm mt-0.5">Coming soon</p>
      </div>
    </Card>
  );
}
