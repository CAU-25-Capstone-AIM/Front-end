import type { StockRankingEntry } from './stock';

export type SectorConsensusBreakdown = {
  strongBuy: number;
  moderateBuy: number;
  hold: number;
  moderateSell: number;
  strongSell: number;
};

export type SectorRankingEntry = {
  id: string; // "sector-tech" 등
  name: string; // 섹터 이름 (예: "Technology")
  totalStocks: number; // 섹터 내 종목 수
  ratings: SectorConsensusBreakdown;
  buyRatio: number; // 매수율 (%) = (strongBuy + moderateBuy) / totalStocks * 100
};

export type SectorDetail = {
  id: string; // 'sector-tech', 'sector-finance' 등
  name: string; // 섹터 이름
  totalStocks: number; // 섹터 내 종목 수
  buyRatio: number; // 섹터 전체 매수율
  rank?: number; // 선택: 섹터 랭킹
  ratings: SectorConsensusBreakdown;
  stocks: StockRankingEntry[]; // 이 섹터에 속한 종목만
};

