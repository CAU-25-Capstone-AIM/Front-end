export type StockClosePricePoint = {
  trade_date: string;
  close_price: number;
};

export type StockConsensus = {
  stock_id: number;
  stock_name: string;
  stock_code: string;
  buy_count: number;
  hold_count: number;
  sell_count: number;
  average_target_price: number;
  upside_potential: number;
  total_reports: number;
  total_analysts: number;
  max_target_price?: number;
  min_target_price?: number;
};

export type StockDetail = {
  id: number;
  stock_code: string;
  stock_name: string;
  sector: string;
  consensus: StockConsensus;
  close_price_trend: StockClosePricePoint[];
};

