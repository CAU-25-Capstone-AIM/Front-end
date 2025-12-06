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

const addDays = (dateString: string, days: number): string => {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    return dateString;
  }
  date.setDate(date.getDate() + days);
  return toDateOnly(date.toISOString());
};

/**
 * 차트 데이터 배열에서 날짜 사이의 빈 날짜를 채워넣는 함수
 * Recharts가 데이터를 등간격(Category)으로 처리하는 문제를 해결
 * 특히 마지막 과거 데이터와 1년 뒤 미래 예측 데이터 사이의 간격을 정확히 표현
 */
export function fillMissingDates(
  data: StockPriceForecastChartPoint[],
): StockPriceForecastChartPoint[] {
  if (data.length < 2) {
    return data;
  }

  const result: StockPriceForecastChartPoint[] = [];
  
  for (let i = 0; i < data.length; i++) {
    const currentPoint = data[i];
    result.push(currentPoint);

    // 다음 포인트가 있으면 사이의 날짜들을 채워넣기
    if (i < data.length - 1) {
      const nextPoint = data[i + 1];
      const currentDate = new Date(currentPoint.date);
      const nextDate = new Date(nextPoint.date);

      if (!Number.isNaN(currentDate.getTime()) && !Number.isNaN(nextDate.getTime())) {
        // 두 날짜 사이의 일수 계산
        const daysDiff = Math.floor(
          (nextDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24),
        );

        // 하루 이상 차이나면 빈 날짜 채우기
        for (let day = 1; day < daysDiff; day++) {
          const fillerDate = addDays(currentPoint.date, day);
          result.push({
            date: fillerDate,
            // 모든 값을 undefined로 설정하여 connectNulls가 작동하도록 함
            close: undefined,
            avgTargetHist: undefined,
            forecastHigh: undefined,
            forecastAvg: undefined,
            forecastLow: undefined,
          });
        }
      }
    }
  }

  return result;
}

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
    isForecast: true,
  };

  const historicalWithoutLast = historicalPoints.slice(0, -1);
  return [...historicalWithoutLast, forecastStart, forecastEnd];
}


