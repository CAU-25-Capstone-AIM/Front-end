import { httpClient } from './httpClient';
import type { StockDetail } from '../types/stock';

export const getStockDetail = async (
  stockId: number,
): Promise<StockDetail> => {
  const response = await httpClient.get<StockDetail>(`/stocks/${stockId}`);
  return response.data;
};

