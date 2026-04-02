import { Card, SectionHeader } from '@saas/shared-ui';
import type { BusinessUnitPrimitives } from '@saas/shared-types';

interface AcademiesScrollProps {
  academies: BusinessUnitPrimitives[];
}

export function AcademiesScroll({ academies }: AcademiesScrollProps) {
  return (
    <div>
      <SectionHeader title="My Academies" />
      <div className="flex gap-3 overflow-x-auto pb-2 mt-3 scrollbar-hide">
        {academies.map((academy) => (
          <Card key={academy.id} className="min-w-[200px] flex-shrink-0">
            <p className="text-[#E5E7EB] font-semibold text-sm">
              {academy.name}
            </p>
            <p className="text-[#9CA3AF] text-xs mt-1 capitalize">
              {academy.type.replace(/_/g, ' ').toLowerCase()}
            </p>
          </Card>
        ))}
        {academies.length === 0 && (
          <Card className="min-w-[200px]">
            <p className="text-[#9CA3AF] text-sm">No academies found</p>
          </Card>
        )}
      </div>
    </div>
  );
}
