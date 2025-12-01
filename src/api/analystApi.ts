import { httpClient } from './httpClient';
import { mapAnalystDetailFromDTO } from '../models/analyst';
import type { AnalystDetail, AnalystRankingEntry } from '../models/analyst';

export type AnalystMetricsDTO = {
  analyst_id: number;
  analyst_name: string;
  firm_name: string;
  accuracy_rate: number;
  return_rate: number;
  target_diff_rate: number;
  avg_return_diff: number;
  avg_target_diff: number;
  aims_score: number;
};

export type GetAnalystMetricsResponse = {
  criteria: string;
  ranking_list: AnalystMetricsDTO[];
};

export type AnalystSortKey =
  | 'accuracyRate'
  | 'returnRate'
  | 'targetDiffRate'
  | 'aimsScore';

export type AnalystDetailDTO = {
  analyst_id: number;
  analyst_name: string;
  firm_name: string;
  accuracy_rate: number;
  return_rate: number;
  target_diff_rate: number;
  avg_return_diff: number;
  avg_target_diff: number;
  aims_score: number;
  covered_stocks: {
    stock_id: number;
    stock_name: string;
    stock_code: string;
    sector: string;
    report_count: number;
  }[];
  reports: {
    report_id: number;
    report_title: string;
    report_date: string;
    stock_name: string;
    stock_code: string;
    target_price: number;
    surface_opinion: string;
    hidden_opinion: number;
    hidden_opinion_label: string;
  }[];
};

const fallbackNumber = (value: unknown, digits = 1): number => {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return 0;
  }
  return Number(value.toFixed(digits));
};

export async function getAnalystRankings(
  sortBy: AnalystSortKey = 'accuracyRate',
): Promise<AnalystRankingEntry[]> {
  const response = await httpClient.get<GetAnalystMetricsResponse>(
    '/analysts/metrics',
    { params: { sortBy } },
  );

  const rawList = response.data?.ranking_list ?? [];
  console.log('[getAnalystRankings] raw ranking_list:', rawList);

  const mapped = rawList.map((dto, index): AnalystRankingEntry => ({
    id: String(dto.analyst_id),
    name: dto.analyst_name,
    firm: dto.firm_name,
    sectors: [], // TODO: 추후 서버 섹터 필드 매핑
    rank: index + 1,
    metrics: {
      accuracy: fallbackNumber(dto.accuracy_rate),
      avgReturn: fallbackNumber(dto.return_rate),
      targetError: fallbackNumber(dto.target_diff_rate),
      relativeReturn: fallbackNumber(dto.avg_return_diff),
      relativeTargetError: fallbackNumber(dto.avg_target_diff),
      compositeScore: fallbackNumber(dto.aims_score, 0),
    },
  }));

  console.log('[getAnalystRankings] mapped length:', mapped.length);
  return mapped;
}

export async function getAnalystDetail(
  analystId: number,
): Promise<AnalystDetail> {
  const response =
    await httpClient.get<AnalystDetailDTO>(`/analysts/${analystId}`);
  return mapAnalystDetailFromDTO(response.data);
}

