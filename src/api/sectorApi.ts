import { httpClient } from './httpClient';
import type { SectorRankingEntry } from '../models/sector';

export type SectorRankingDTO = {
  sector_name: string;
  stock_count: number;
  buy_ratio: number;
  strong_buy_count: number;
  buy_count: number;
  hold_count: number;
  sell_count: number;
  strong_sell_count: number;
};

export async function getSectorRankings(): Promise<SectorRankingEntry[]> {
  const response = await httpClient.get<SectorRankingDTO[]>('/sectors');
  const data = response.data;

  if (!Array.isArray(data)) {
    console.warn('[getSectorRankings] unexpected response:', data);
    return [];
  }

  return data.map((item): SectorRankingEntry => ({
    id: item.sector_name,
    name: item.sector_name,
    totalStocks: item.stock_count,
    buyRatio: item.buy_ratio,
    ratings: {
      strongBuy: item.strong_buy_count,
      moderateBuy: item.buy_count,
      hold: item.hold_count,
      moderateSell: item.sell_count,
      strongSell: item.strong_sell_count,
    },
  }));
}

