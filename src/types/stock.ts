export type StockClosePricePoint = {
  trade_date: string;
  close_price: number;
};

export type StockDailyAverageTargetPricePoint = {
  date: string;
  average_target_price: number;
};

export type StockLatestTargetPriceSummary = {
  average_target_price: number;
  max_target_price: number;
  min_target_price: number;
  aims_target_price?: number;
  aims_max_target_price?: number;
  aims_min_target_price?: number;
};

export type StockPriceForecastChartPoint = {
  date: string;
  close?: number;
  avgTargetHist?: number;
  forecastHigh?: number;
  forecastAvg?: number;
  forecastLow?: number;
  isForecast?: boolean;
};

export type StockConsensus = {
  stock_id: number;
  stock_name: string;
  stock_code: string;
  buy_count: number;
  hold_count: number;
  sell_count: number;
  average_target_price: number;
  aims_average_target_price: number;
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
  daily_average_target_prices: StockDailyAverageTargetPricePoint[];
  target_price_stats: StockLatestTargetPriceSummary;
  covering_analysts: StockCoveringAnalyst[];
};

export type StockCoveringAnalyst = {
  analyst_id: number;
  analyst_name: string;
  firm_name: string;
  latest_target_price: number;
  latest_report_date: string;
  latest_opinion: string;
  hidden_opinion: string;
  target_price_diff: number;
  accuracy_rate: number;
  return_rate: number;
  target_diff_rate: number;
  avg_return_diff: number;
  avg_target_diff: number;
  aims_score: number;
  rank: number;
  total_analysts: number;
};

