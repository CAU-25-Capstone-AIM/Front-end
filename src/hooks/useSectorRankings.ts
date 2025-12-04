import { useQuery } from '@tanstack/react-query';
import { getSectorRankings } from '../api/sectorApi';
import type { SectorRankingEntry } from '../models/sector';

export const useSectorRankings = () =>
  useQuery<SectorRankingEntry[]>({
    queryKey: ['sectorRankings'],
    queryFn: getSectorRankings,
  });

