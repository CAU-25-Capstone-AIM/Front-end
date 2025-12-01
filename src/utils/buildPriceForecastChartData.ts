import type {
  ClosePricePoint,
  DailyAverageTargetPricePoint,
  LatestTargetPriceSummary,
  PriceForecastChartPoint,
} from '../types/stock';

type BuildParams = {
  closePriceTrend: ClosePricePoint[];
  dailyAverageTargetPrices: DailyAverageTargetPricePoint[];
  latestTargetPriceSummary: LatestTargetPriceSummary;
};

const DATE_LENGTH = 10;

const normalizeDate = (value: string): string => {
  if (!value) {
    return '';
  }
  const hasTime = value.includes('T');
  if (!hasTime && value.length >= DATE_LENGTH) {
    return value.slice(0, DATE_LENGTH);
  }
  const date = new Date(value);
  if (!Number.isNaN(date.getTime())) {
    return date.toISOString().slice(0, DATE_LENGTH);
  }
  const fallbackMatch = value.match(/^\d{4}-\d{2}-\d{2}/);
  return fallbackMatch ? fallbackMatch[0] : value;
};

const compareDateStrings = (a: string, b: string) =>
  normalizeDate(a).localeCompare(normalizeDate(b));

const addYears = (dateString: string, deltaYears: number): string => {
  const date = new Date(`${normalizeDate(dateString)}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) {
    return normalizeDate(dateString);
  }
  date.setUTCFullYear(date.getUTCFullYear() + deltaYears);
  return date.toISOString().slice(0, DATE_LENGTH);
};

const ensurePoint = (
  pointsMap: Map<string, PriceForecastChartPoint>,
  date: string,
): PriceForecastChartPoint => {
  const normalized = normalizeDate(date);
  const existing = pointsMap.get(normalized);
  if (existing) {
    return existing;
  }
  const point: PriceForecastChartPoint = { date: normalized };
  pointsMap.set(normalized, point);
  return point;
};

export function buildPriceForecastChartData({
  closePriceTrend,
  dailyAverageTargetPrices,
  latestTargetPriceSummary,
}: BuildParams): PriceForecastChartPoint[] {
  if (!closePriceTrend.length) {
    return [];
  }

  const sortedCloseTrend = [...closePriceTrend].sort((a, b) =>
    compareDateStrings(a.trade_date, b.trade_date),
  );
  const sortedAvgTargets = [...dailyAverageTargetPrices].sort((a, b) =>
    compareDateStrings(a.trade_date, b.trade_date),
  );

  const lastClosePoint = sortedCloseTrend[sortedCloseTrend.length - 1];
  const lastDate = normalizeDate(lastClosePoint.trade_date);
  const lastClose = lastClosePoint.close_price;
  const windowStartDate = addYears(lastDate, -5);

  const windowedCloses = sortedCloseTrend.filter((point) => {
    const normalized = normalizeDate(point.trade_date);
    return normalized >= windowStartDate && normalized <= lastDate;
  });

  if (windowedCloses.length === 0) {
    windowedCloses.push(lastClosePoint);
  }

  const avgTargetMap = new Map<string, number>();
  sortedAvgTargets.forEach((point) => {
    avgTargetMap.set(normalizeDate(point.trade_date), point.average_target_price);
  });

  const chartPointsMap = new Map<string, PriceForecastChartPoint>();

  windowedCloses.forEach((point) => {
    const date = normalizeDate(point.trade_date);
    const chartPoint = ensurePoint(chartPointsMap, date);
    chartPoint.close = point.close_price;
    if (avgTargetMap.has(date)) {
      chartPoint.avgTargetHist = avgTargetMap.get(date);
    }
  });

  const lastPointEntry = ensurePoint(chartPointsMap, lastDate);
  lastPointEntry.close = lastClose;

  const lastAvgTargetValue =
    sortedAvgTargets.length > 0
      ? sortedAvgTargets[sortedAvgTargets.length - 1].average_target_price
      : latestTargetPriceSummary.average_target_price;

  lastPointEntry.forecastHigh = lastAvgTargetValue;
  lastPointEntry.forecastAvg = lastAvgTargetValue;
  lastPointEntry.forecastLow = lastAvgTargetValue;

  const forecastEndDate = addYears(lastDate, 1);
  const forecastEndPoint = ensurePoint(chartPointsMap, forecastEndDate);
  forecastEndPoint.forecastHigh = latestTargetPriceSummary.max_target_price;
  forecastEndPoint.forecastAvg = latestTargetPriceSummary.average_target_price;
  forecastEndPoint.forecastLow = latestTargetPriceSummary.min_target_price;
  forecastEndPoint.close = lastClose;

  const result = Array.from(chartPointsMap.values()).sort((a, b) =>
    a.date.localeCompare(b.date),
  );

  if (!result.some((point) => point.date === lastDate)) {
    const fallbackLastPoint = { date: lastDate, close: lastClose };
    result.push(fallbackLastPoint);
    result.sort((a, b) => a.date.localeCompare(b.date));
  }

  return result;
}

