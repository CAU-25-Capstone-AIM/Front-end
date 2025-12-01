import { httpClient } from './httpClient';
import type { StockRankingEntry } from '../models/stock';

export type StockRankingDTO = {
  id: number;
  stockName: string;
  stockCode: string;
  sector: string;
  upsidePotential: number;
  buyRatio: number;
};

type StockRankingEntryWithId = StockRankingEntry & { id: string };

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

  const mapped: StockRankingEntryWithId[] = data.map((dto) => ({
    id: String(dto.id),
    name: dto.stockName,
    ticker: dto.stockCode,
    sector: dto.sector,
    upside: dto.upsidePotential ?? 0,
    buyRatio: dto.buyRatio ?? 0,
  }));

  console.log('[getStockRankings] mapped length:', mapped.length);

  return mapped;
}

