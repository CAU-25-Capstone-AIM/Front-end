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

