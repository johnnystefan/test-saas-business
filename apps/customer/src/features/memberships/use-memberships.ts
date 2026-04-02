import { useQuery } from '@tanstack/react-query';
import { getMemberships } from '../../lib/api/club.api';

export function useMemberships() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['memberships'],
    queryFn: getMemberships,
  });

  return {
    memberships: data ?? [],
    isLoading,
    isError,
  };
}
