import { useQuery } from '@tanstack/react-query';
import { getSectorDetail } from '../api/sectorApi';
import type { SectorDetail } from '../models/sector';

export const sectorDetailQueryKey = (sectorName: string) => [
  'sectorDetail',
  sectorName,
];

export const useSectorDetail = (sectorName: string | undefined) =>
  useQuery<SectorDetail>({
    queryKey: sectorName ? sectorDetailQueryKey(sectorName) : ['sectorDetail', 'empty'],
    queryFn: () => {
      if (!sectorName) {
        throw new Error('sectorName is required');
      }
      return getSectorDetail(sectorName);
    },
    enabled: !!sectorName,
  });

