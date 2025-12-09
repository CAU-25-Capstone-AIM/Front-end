import { httpClient } from './httpClient';
import type { SearchResultDTO, SearchResult } from '../models/search';

/**
 * 통합 검색 API
 * @param query 검색어 (애널리스트 이름 또는 종목명)
 * @returns 애널리스트와 종목 검색 결과
 */
export async function searchAll(query: string): Promise<SearchResult> {
  const trimmed = query.trim();

  // 공백만 입력된 경우는 바로 빈 결과 리턴 (백엔드 호출 안 함)
  if (!trimmed) {
    return { analysts: [], stocks: [] };
  }

  try {
    const res = await httpClient.get<SearchResultDTO>('/search', {
      params: {
        keyword: trimmed, // ✅ Swagger 확인: keyword 파라미터 사용
      },
    });

    console.log('[searchAll] 백엔드 응답:', res.data);

    // DTO (snake_case) -> 프론트엔드 타입 (camelCase) 변환
    const result: SearchResult = {
      analysts: res.data.analysts.map((dto) => ({
        analystId: dto.analyst_id,
        analystName: dto.analyst_name,
        firmName: dto.firm_name,
      })),
      stocks: res.data.stocks.map((dto) => ({
        stockId: dto.stock_id,
        stockCode: dto.stock_code,
        stockName: dto.stock_name,
        sector: dto.sector,
      })),
    };

    console.log('[searchAll] 변환된 결과:', result);
    return result;
  } catch (error: any) {
    console.error('[searchAll] 에러 발생:');
    console.error('- Status:', error.response?.status);
    console.error('- Message:', error.response?.data);
    throw error;
  }
}

