import { httpClient } from './httpClient';
import type { AnalystRankingEntry } from '../models/analyst';
import type { StockRankingEntry } from '../models/stock';
import type { SectorRankingEntry, SectorConsensusBreakdown } from '../models/sector';
import type { HomePageData } from '../models/home';

// 백엔드 응답 DTO 타입
type HomeAnalystDTO = {
  analyst_id: number;
  analyst_name: string;
  firm_name: string;
  accuracy_rate: number;
  return_rate: number;
  aims_score: number;
};

type HomeStockDTO = {
  stock_id: number;
  stock_name: string;
  stock_code: string;
  upside_potential: number;
  buy_ratio: number;
};

type HomeSectorDTO = {
  sector_name: string;
  buy_ratio: number;
  strong_buy_count: number;
  buy_count: number;
};

type HomeResponseDTO = {
  top_analysts: HomeAnalystDTO[];
  top_stocks: HomeStockDTO[];
  top_sectors: HomeSectorDTO[];
  trending_analysts: HomeAnalystDTO[];
};

function mapHomeAnalyst(dto: HomeAnalystDTO, index: number): AnalystRankingEntry {
  return {
    // AnalystCore 필드
    id: String(dto.analyst_id),
    name: dto.analyst_name,
    firm: dto.firm_name,
    sectors: [], // 홈 API에서는 제공하지 않으므로 빈 배열
    
    // AnalystRankingEntry 필드
    rank: index + 1, // 배열 순서대로 1, 2, 3위
    
    // AnalystMetrics 필드 (정확한 타입 구조 맞춤)
    metrics: {
      accuracy: dto.accuracy_rate,
      avgReturn: dto.return_rate,
      targetError: 0, // 홈 API에서 미제공, 기본값
      relativeReturn: 0, // 홈 API에서 미제공, 기본값
      relativeTargetError: 0, // 홈 API에서 미제공, 기본값
      compositeScore: dto.aims_score,
    },
  };
}

function mapHomeStock(dto: HomeStockDTO): StockRankingEntry {
  return {
    id: dto.stock_id,
    name: dto.stock_name,
    ticker: dto.stock_code,
    sector: '', // 홈 API에서 미제공, 빈 문자열
    upside: dto.upside_potential ?? 0,
    buyRatio: dto.buy_ratio ?? 0,
  };
}

function mapHomeSector(dto: HomeSectorDTO): SectorRankingEntry {
  const ratings: SectorConsensusBreakdown = {
    strongBuy: dto.strong_buy_count,
    moderateBuy: dto.buy_count,
    hold: 0, // 홈 API에서 미제공, 기본값
    moderateSell: 0, // 홈 API에서 미제공, 기본값
    strongSell: 0, // 홈 API에서 미제공, 기본값
  };

  const totalStocks = dto.strong_buy_count + dto.buy_count;

  return {
    id: dto.sector_name,
    name: dto.sector_name,
    totalStocks,
    ratings,
    buyRatio: dto.buy_ratio,
  };
}

export async function getHomeData(): Promise<HomePageData> {
  const response = await httpClient.get<HomeResponseDTO>('/home');
  const data = response.data;

  return {
    topAnalysts: (data.top_analysts ?? []).map(mapHomeAnalyst),
    topStocks: (data.top_stocks ?? []).map(mapHomeStock),
    topSectors: (data.top_sectors ?? []).map(mapHomeSector),
    trendingAnalysts: (data.trending_analysts ?? []).map(mapHomeAnalyst),
  };
}

