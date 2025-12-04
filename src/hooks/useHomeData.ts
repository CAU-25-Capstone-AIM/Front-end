import { useQuery } from '@tanstack/react-query';
import { getHomeData } from '../api/homeApi';
import type { HomePageData } from '../models/home';

export const useHomeData = () =>
  useQuery<HomePageData>({
    queryKey: ['home'],
    queryFn: getHomeData,
  });

