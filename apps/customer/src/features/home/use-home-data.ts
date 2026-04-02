import { useQuery } from '@tanstack/react-query';
import { getMemberships, getBusinessUnits } from '../../lib/api/club.api';

export function useHomeData() {
  const memberships = useQuery({
    queryKey: ['memberships'],
    queryFn: getMemberships,
  });

  const academies = useQuery({
    queryKey: ['business-units'],
    queryFn: getBusinessUnits,
  });

  const isLoading = memberships.isLoading || academies.isLoading;
  const hasError = memberships.isError || academies.isError;
  const hasData = !isLoading && !hasError;
  const isEmpty =
    hasData &&
    (memberships.data?.length ?? 0) === 0 &&
    (academies.data?.length ?? 0) === 0;

  return {
    memberships: memberships.data ?? [],
    academies: academies.data ?? [],
    isLoading,
    hasError,
    isEmpty,
    hasData,
  };
}
