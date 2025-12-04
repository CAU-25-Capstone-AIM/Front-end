import type { AnalystRankingEntry } from './analyst';
import type { StockRankingEntry } from './stock';
import type { SectorRankingEntry } from './sector';

export type HomePageData = {
  topAnalysts: AnalystRankingEntry[];
  topStocks: StockRankingEntry[];
  topSectors: SectorRankingEntry[];
  trendingAnalysts: AnalystRankingEntry[];
};

