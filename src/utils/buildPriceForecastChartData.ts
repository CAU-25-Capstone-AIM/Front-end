import type {
  StockClosePricePoint,
  StockDailyAverageTargetPricePoint,
  StockLatestTargetPriceSummary,
  StockPriceForecastChartPoint,
} from '../types/stock';

type BuildPriceForecastChartDataParams = {
  closePriceTrend: StockClosePricePoint[];
  dailyAverageTargetPrices: StockDailyAverageTargetPricePoint[];
  latestTargetPriceSummary: StockLatestTargetPriceSummary;
};

const FIVE_YEARS = 5;
const ONE_YEAR = 1;

const toDateOnly = (raw: string): string => {
  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) {
    return raw.split('T')[0] ?? raw;
  }
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const addYears = (dateString: string, years: number): string => {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    return dateString;
  }
  date.setFullYear(date.getFullYear() + years);
  return toDateOnly(date.toISOString());
};

const subtractYears = (dateString: string, years: number): string => {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    return dateString;
  }
  date.setFullYear(date.getFullYear() - years);
  return toDateOnly(date.toISOString());
};

export function buildPriceForecastChartData({
  closePriceTrend,
  dailyAverageTargetPrices,
  latestTargetPriceSummary,
}: BuildPriceForecastChartDataParams): StockPriceForecastChartPoint[] {
  if (!closePriceTrend.length) {
    return [];
  }

  const sortedCloses = [...closePriceTrend].sort(
    (a, b) =>
      new Date(a.trade_date).getTime() - new Date(b.trade_date).getTime(),
  );

  const lastClosePoint = sortedCloses[sortedCloses.length - 1];
  const lastDate = toDateOnly(lastClosePoint.trade_date);
  const lastClose = lastClosePoint.close_price;
  const windowStartDate = subtractYears(lastDate, FIVE_YEARS);

  const windowedCloses = sortedCloses.filter((point) => {
    const dateOnly = toDateOnly(point.trade_date);
    return dateOnly >= windowStartDate && dateOnly <= lastDate;
  });

  const sortedAvgTargets = [...dailyAverageTargetPrices].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );

  const avgTargetMap = new Map<string, number>();
  sortedAvgTargets
    .filter((point) => toDateOnly(point.date) <= lastDate)
    .forEach((point) => {
      avgTargetMap.set(toDateOnly(point.date), point.average_target_price);
    });

  const historicalPoints: StockPriceForecastChartPoint[] = windowedCloses
    .map((point) => {
      const date = toDateOnly(point.trade_date);
      return {
        date,
        close: point.close_price,
        avgTargetHist: avgTargetMap.get(date),
      };
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  if (!historicalPoints.length) {
    return [];
  }

  const lastHistoricalPoint =
    historicalPoints[historicalPoints.length - 1] ?? historicalPoints[0];

  const lastAvgTargetValue =
    sortedAvgTargets[sortedAvgTargets.length - 1]?.average_target_price ??
    latestTargetPriceSummary.average_target_price;

  const forecastStart: StockPriceForecastChartPoint = {
    ...lastHistoricalPoint,
    close: lastClose,
    avgTargetHist: lastHistoricalPoint.avgTargetHist ?? lastAvgTargetValue,
    forecastHigh: lastAvgTargetValue,
    forecastAvg: lastAvgTargetValue,
    forecastLow: lastAvgTargetValue,
  };

  const forecastEndDate = addYears(lastDate, ONE_YEAR);
  const forecastEnd: StockPriceForecastChartPoint = {
    date: forecastEndDate,
    close: lastClose,
    forecastHigh: latestTargetPriceSummary.max_target_price,
    forecastAvg: latestTargetPriceSummary.average_target_price,
    forecastLow: latestTargetPriceSummary.min_target_price,
  };

  const historicalWithoutLast = historicalPoints.slice(0, -1);
  return [...historicalWithoutLast, forecastStart, forecastEnd];
}


