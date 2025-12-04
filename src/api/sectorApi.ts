import { httpClient } from './httpClient';
import type { SectorRankingEntry, SectorDetail, SectorConsensusBreakdown } from '../models/sector';
import type { StockRankingEntry } from '../models/stock';

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

export type SectorDetailDTO = {
  sector_name: string;
  stock_count: number;
  buy_ratio: number;
  strong_buy_count: number;
  buy_count: number;
  hold_count: number;
  sell_count: number;
  strong_sell_count: number;
  stocks: {
    stock_id: number;
    stock_name: string;
    stock_code: string;
    upside_potential: number | null;
    buy_ratio: number | null;
    latest_opinion: string;
  }[];
};

function mapStockDtoToStockRankingEntry(
  dto: SectorDetailDTO['stocks'][0],
  sectorName: string
): StockRankingEntry {
  return {
    id: dto.stock_id,
    name: dto.stock_name,
    ticker: dto.stock_code,
    sector: sectorName,
    upside: dto.upside_potential ?? 0,
    buyRatio: dto.buy_ratio ?? 0,
  };
}

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

export async function getSectorDetail(sectorName: string): Promise<SectorDetail> {
  const response = await httpClient.get<SectorDetailDTO>(
    `/sectors/${encodeURIComponent(sectorName)}`
  );
  const data = response.data;

  const ratings: SectorConsensusBreakdown = {
    strongBuy: data.strong_buy_count,
    moderateBuy: data.buy_count,
    hold: data.hold_count,
    moderateSell: data.sell_count,
    strongSell: data.strong_sell_count,
  };

  return {
    id: data.sector_name,
    name: data.sector_name,
    totalStocks: data.stock_count,
    buyRatio: data.buy_ratio,
    rank: undefined,
    ratings,
    stocks: data.stocks.map((stock) => mapStockDtoToStockRankingEntry(stock, data.sector_name)),
  };
}

