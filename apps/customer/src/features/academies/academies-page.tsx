import { SectionHeader, SkeletonCard } from '@saas/shared-ui';
import { useAcademies } from './use-academies';
import { AcademyCard } from './academy-card';

export function AcademiesPage() {
  const { academies, isLoading, isError } = useAcademies();

  return (
    <div className="px-4 pt-6 flex flex-col gap-4">
      <SectionHeader title="My Academies" />

      {isLoading && (
        <>
          <SkeletonCard lines={2} />
          <SkeletonCard lines={2} />
        </>
      )}

      {isError && (
        <p className="text-red-400 text-sm text-center py-8">
          Failed to load academies. Please try again.
        </p>
      )}

      {!isLoading && !isError && academies.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 gap-3">
          <span className="text-4xl">🏫</span>
          <p className="text-[#9CA3AF] text-sm text-center">
            No academies found.
          </p>
        </div>
      )}

      {!isLoading &&
        !isError &&
        academies.map((a) => <AcademyCard key={a.id} academy={a} />)}
    </div>
  );
}
