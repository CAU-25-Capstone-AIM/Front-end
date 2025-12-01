import { httpClient } from './httpClient';
import type { StockRankingEntry } from '../models/stock';

export type StockRankingDTO = {
  id: number;
  stock_name: string;
  stock_code: string;
  sector: string;
  upside_potential: number;
  buy_ratio: number;
};

const isStockRankingDTOArray = (
  data: unknown,
): data is StockRankingDTO[] => Array.isArray(data);

export async function getStockRankings(): Promise<StockRankingEntry[]> {
  const response = await httpClient.get<StockRankingDTO[]>('/stocks');
  const data = response.data;

  if (!isStockRankingDTOArray(data)) {
    console.warn('[getStockRankings] unexpected response:', data);
    return [];
  }

  console.log('[getStockRankings] raw length:', data.length);

  const mapped: StockRankingEntry[] = data.map((dto) => ({
    id: dto.id,
    name: dto.stock_name,
    ticker: dto.stock_code,
    sector: dto.sector,
    upside: dto.upside_potential ?? 0,
    buyRatio: dto.buy_ratio ?? 0,
  }));

  console.log('[getStockRankings] mapped length:', mapped.length);

  return mapped;
}

