import type { StockCore } from './stock';
import type { Report } from './report';
import type { AnalystDetailDTO } from '../api/analystApi';

const fallbackNumber = (value: unknown, digits = 1): number => {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return 0;
  }
  return Number(value.toFixed(digits));
};

// 애널리스트 기본 정보
export type AnalystCore = {
  id: string;
  name: string;
  firm: string;
  sectors: string[];
};

// 애널리스트 성과 지표
export type AnalystMetrics = {
  accuracy: number;            // 정답률 (%)
  avgReturn: number;           // 평균 수익률 (%)
  targetError: number;         // 목표가 오차율 (%)
  relativeReturn: number;      // 애널 평균 대비 수익률
  relativeTargetError: number; // 애널 평균 대비 목표가 오차율
  compositeScore: number;      // 종합 점수
};

// 메인 페이지 랭킹용
export type AnalystRankingEntry = AnalystCore & {
  rank: number;
  metrics: AnalystMetrics;
};

// 애널리스트 상세 페이지 전체 데이터
export type AnalystDetailPageData = {
  analyst: AnalystCore;
  metrics: AnalystMetrics;
  coveredStocks: StockCore[];
  reports: Report[];
  reportFrequency: {
    month: string;
    count: number;
  }[];
};

export type AnalystCoveredStock = {
  id: number;
  name: string;
  code: string;
  sector: string;
  reportCount: number;
};

export type AnalystReport = {
  id: number;
  title: string;
  date: string;
  stockName: string;
  stockCode: string;
  targetPrice: number;
  surfaceOpinion: string;
  hiddenOpinion: number;
  hiddenOpinionLabel: string;
};

export type AnalystDetail = {
  id: number;
  name: string;
  firm: string;
  rank: number;
  totalAnalysts: number;
  metrics: {
    accuracyRate: number;
    returnRate: number;
    targetDiffRate: number;
    avgReturnDiff: number;
    avgTargetDiff: number;
    aimsScore: number;
  };
  coveredStocks: AnalystCoveredStock[];
  reports: AnalystReport[];
};

export const mapAnalystDetailFromDTO = (
  dto: AnalystDetailDTO,
): AnalystDetail => {
  return {
    id: dto.analyst_id,
    name: dto.analyst_name,
    firm: dto.firm_name,
    rank: dto.rank,
    totalAnalysts: dto.total_analysts,
    metrics: {
      accuracyRate: fallbackNumber(dto.accuracy_rate),
      returnRate: fallbackNumber(dto.return_rate),
      targetDiffRate: fallbackNumber(dto.target_diff_rate),
      avgReturnDiff: fallbackNumber(dto.avg_return_diff),
      avgTargetDiff: fallbackNumber(dto.avg_target_diff),
      aimsScore: fallbackNumber(dto.aims_score, 0),
    },
    coveredStocks: dto.covered_stocks.map((stock) => ({
      id: stock.stock_id,
      name: stock.stock_name,
      code: stock.stock_code,
      sector: stock.sector,
      reportCount: stock.report_count,
    })),
    reports: dto.reports.map((report) => ({
      id: report.report_id,
      title: report.report_title,
      date: report.report_date,
      stockName: report.stock_name,
      stockCode: report.stock_code,
      targetPrice: report.target_price,
      surfaceOpinion: report.surface_opinion,
      hiddenOpinion: report.hidden_opinion,
      hiddenOpinionLabel: report.hidden_opinion_label,
    })),
  };
};

