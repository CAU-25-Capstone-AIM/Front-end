import { useQuery } from '@tanstack/react-query';
import { getStockDetail } from '../api/stocks';
import type { StockDetail } from '../types/stock';

export const stockDetailQueryKey = (stockId: number) => [
  'stockDetail',
  stockId,
];

export const useStockDetail = (stockId: number) =>
  useQuery<StockDetail>({
    queryKey: stockDetailQueryKey(stockId),
    queryFn: () => getStockDetail(stockId),
    enabled: Number.isFinite(stockId) && stockId > 0,
  });

