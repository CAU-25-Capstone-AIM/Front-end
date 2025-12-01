import { buildPriceForecastChartData } from './buildPriceForecastChartData';

const sampleCloseTrend = [
  { trade_date: '2018-01-02', close_price: 50000 },
  { trade_date: '2020-12-31', close_price: 70000 },
  { trade_date: '2021-06-30', close_price: 80000 },
  { trade_date: '2023-06-30', close_price: 90000 },
  { trade_date: '2024-12-31T15:00:00Z', close_price: 95000 },
];

const sampleAvgTargets = [
  { trade_date: '2021-06-30', average_target_price: 82000 },
  { trade_date: '2024-12-31', average_target_price: 97000 },
];

const sampleSummary = {
  average_target_price: 98000,
  max_target_price: 110000,
  min_target_price: 88000,
};

const result = buildPriceForecastChartData({
  closePriceTrend: sampleCloseTrend,
  dailyAverageTargetPrices: sampleAvgTargets,
  latestTargetPriceSummary: sampleSummary,
});

const lastDate = '2024-12-31';
const forecastEndDate = '2025-12-31';

const assert = (condition: unknown, message: string) => {
  if (!condition) {
    throw new Error(message);
  }
};

const lastPoint = result.find((point) => point.date === lastDate);
assert(lastPoint, 'last point missing');
assert(lastPoint?.close === 95000, 'last close not preserved');
assert(lastPoint?.forecastAvg === 97000, 'forecast start avg mismatch');

const forecastEnd = result.find((point) => point.date === forecastEndDate);
assert(forecastEnd, 'forecast end point missing');
assert(forecastEnd?.forecastHigh === 110000, 'forecast high mismatch');
assert(forecastEnd?.close === 95000, 'future close should be flat line');

const windowStart = '2019-01-01';
assert(
  !result.some((point) => point.date < windowStart),
  'points before 5-year window should be filtered out',
);

export {};

