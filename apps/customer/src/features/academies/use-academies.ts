import { useQuery } from '@tanstack/react-query';
import { getBusinessUnits } from '../../lib/api/club.api';

export function useAcademies() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['business-units'],
    queryFn: getBusinessUnits,
  });

  return {
    academies: data ?? [],
    isLoading,
    isError,
  };
}
