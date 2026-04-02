import { Card } from '@saas/shared-ui';

export function SessionWidget() {
  return (
    <Card className="flex items-center justify-between">
      <div>
        <p className="text-[#9CA3AF] text-sm">Next Session</p>
        <p className="text-[#E5E7EB] font-semibold mt-1">
          No upcoming sessions
        </p>
      </div>
      <div className="bg-[#22C55E]/10 rounded-xl p-3">
        <span className="text-[#22C55E] text-2xl">📅</span>
      </div>
    </Card>
  );
}
