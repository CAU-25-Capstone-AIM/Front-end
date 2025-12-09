// 백엔드 응답 DTO (snake_case)
export type SearchAnalystDTO = {
  analyst_id: number;
  analyst_name: string;
  firm_name: string;
};

export type SearchStockDTO = {
  stock_id: number;
  stock_code: string;
  stock_name: string;
  sector: string;
};

export type SearchResultDTO = {
  analysts: SearchAnalystDTO[];
  stocks: SearchStockDTO[];
};

// 프론트엔드용 타입 (camelCase)
export type SearchAnalyst = {
  analystId: number;
  analystName: string;
  firmName: string;
};

export type SearchStock = {
  stockId: number;
  stockCode: string;
  stockName: string;
  sector: string;
};

export type SearchResult = {
  analysts: SearchAnalyst[];
  stocks: SearchStock[];
};

