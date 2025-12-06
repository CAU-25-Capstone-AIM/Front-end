/**
 * 통화 포맷팅 유틸리티
 * @param value 숫자 값
 * @returns 한국 통화 형식 문자열 (예: "50,000원")
 */
export const formatCurrency = (value: number | null | undefined): string => {
  if (value == null || Number.isNaN(value)) {
    return '-';
  }
  return `${value.toLocaleString('ko-KR', { maximumFractionDigits: 0 })}원`;
};

/**
 * 날짜 포맷팅 유틸리티
 * @param value 날짜 문자열 (YYYY-MM-DD 또는 ISO 형식)
 * @returns YYYY.MM.DD 형식 문자열
 */
export const formatDate = (value: string | null | undefined): string => {
  if (!value) {
    return '-';
  }

  // 'YYYY-MM-DD' 또는 'YYYY-MM-DDTHH:mm:ss' 형식 처리
  const dateOnly = value.split('T')[0];
  if (!dateOnly) {
    return value;
  }

  const [y, m, d] = dateOnly.split('-');
  if (!y || !m || !d) {
    return value;
  }

  return `${y}.${m}.${d}`;
};

