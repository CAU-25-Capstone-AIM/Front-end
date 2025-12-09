import { useMemo } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
  ReferenceLine,
} from 'recharts';
import type {
  StockClosePricePoint as ClosePricePoint,
  StockDailyAverageTargetPricePoint as DailyAverageTargetPricePoint,
  StockLatestTargetPriceSummary as TargetPriceStats,
  StockPriceForecastChartPoint as PriceForecastChartPoint,
} from '../../types/stock';
import {
  buildPriceForecastChartData,
  fillMissingDates,
} from '../../utils/buildPriceForecastChartData';

type PriceForecastChartProps = {
  closePriceTrend: ClosePricePoint[];
  dailyAverageTargetPrices: DailyAverageTargetPricePoint[];
  targetPriceStats: TargetPriceStats;
  height?: number;
};

type TooltipPayloadItem = {
  dataKey: keyof PriceForecastChartPoint;
  value: number;
  color?: string;
};

const formatTickMonth = (value: string) => {
  const [year, month] = value.split('-');
  if (!year || !month) {
    return value;
  }
  return `${year.slice(2)}.${month}`;
};

const formatPrice = (value?: number) =>
  typeof value === 'number'
    ? `${value.toLocaleString('ko-KR', { maximumFractionDigits: 0 })}원`
    : undefined;

const PriceForecastTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
}) => {
  if (!active || !payload || !payload.length) {
    return null;
  }

  const entries = payload
    .filter((item) => typeof item.value === 'number')
    .map((item) => ({
      label:
        item.dataKey === 'close'
          ? '종가'
          : item.dataKey === 'avgTargetHist'
            ? '이전 평균 목표가'
            : item.dataKey === 'forecastHigh'
              ? "AIM's 예측 최고가"
              : item.dataKey === 'forecastAvg'
                ? "AIM's 예측 평균가"
                : "AIM's 예측 최저가",
      value: formatPrice(item.value),
    }))
    .filter((entry) => entry.value);

  if (!entries.length) {
    return null;
  }

  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e5e7eb',
        borderRadius: 8,
        padding: 12,
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        minWidth: 200,
      }}
    >
      <div style={{ fontWeight: 600, marginBottom: 8 }}>{label}</div>
      <div style={{ fontSize: 13, color: '#374151', display: 'grid', gap: 4 }}>
        {entries.map((entry) => (
          <span key={entry.label}>
            {entry.label}: {entry.value}
          </span>
        ))}
      </div>
    </div>
  );
};

const PriceForecastLegend = () => (
  <div
    style={{
      display: 'flex',
      gap: 16,
      padding: '0 12px 12px',
      fontSize: 13,
      color: '#4b5563',
    }}
  >
    <LegendItem color="#6b84d4" label="종가" />
    <LegendItem color="#e2b053" label="이전 애널리스트 평균 목표주가" />
  </div>
);

const LegendItem = ({ color, label }: { color: string; label: string }) => (
  <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
    <span
      style={{
        width: 12,
        height: 12,
        borderRadius: 999,
        backgroundColor: color,
        display: 'inline-flex',
      }}
    />
    {label}
  </span>
);

const ForecastDot = (props: {
  cx?: number;
  cy?: number;
  payload?: PriceForecastChartPoint;
  dataKey?: string;
  stroke?: string;
  value?: number;
}) => {
  const { cx, cy, payload, dataKey, stroke, value } = props;

  // 미래 예측 데이터가 아니거나 값이 없으면 렌더링하지 않음
  if (!payload || !payload.isForecast || typeof value !== 'number') {
    return null;
  }

  // 각 forecast 라인의 끝점에만 표시
  if (
    dataKey !== 'forecastHigh' &&
    dataKey !== 'forecastAvg' &&
    dataKey !== 'forecastLow'
  ) {
    return null;
  }

  if (typeof cx !== 'number' || typeof cy !== 'number') {
    return null;
  }

  return (
    <g>
      <circle
        cx={cx}
        cy={cy}
        r={4}
        fill="#fff"
        stroke={stroke || '#bf4b3e'}
        strokeWidth={2}
      />
      <text
        x={cx}
        y={cy - 12}
        textAnchor="middle"
        fill={stroke || '#bf4b3e'}
        fontSize={11}
        fontWeight={600}
      >
        {formatPrice(value)}
      </text>
    </g>
  );
};

export function PriceForecastChart({
  closePriceTrend,
  dailyAverageTargetPrices,
  targetPriceStats,
  height = 360,
}: PriceForecastChartProps) {
  // useMemo를 사용하여 데이터 변환 로직을 최적화
  // fillMissingDates로 마지막 과거 데이터와 1년 뒤 미래 예측 사이의 모든 날짜를 채움
  const chartData = useMemo(() => {
    const rawData = buildPriceForecastChartData({
      closePriceTrend,
      dailyAverageTargetPrices,
      latestTargetPriceSummary: {
        average_target_price: targetPriceStats.aims_target_price ?? targetPriceStats.average_target_price,
        max_target_price: targetPriceStats.aims_max_target_price ?? targetPriceStats.max_target_price,
        min_target_price: targetPriceStats.aims_min_target_price ?? targetPriceStats.min_target_price,
      },
    });

    // X축 간격 문제 해결: 날짜 사이의 빈 날짜를 모두 채워넣어
    // Recharts가 실제 시간 간격을 반영하도록 함
    return fillMissingDates(rawData);
  }, [closePriceTrend, dailyAverageTargetPrices, targetPriceStats]);

  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.log('[PriceForecastChart] chartData preview:', chartData.slice(-4));
  }

  if (!chartData.length) {
    return (
      <div
        style={{
          width: '100%',
          height,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px dashed #d1d5db',
          borderRadius: 8,
          color: '#6b7280',
        }}
      >
        차트 데이터를 불러올 수 없습니다.
      </div>
    );
  }

  const historicalPoints = chartData.filter(
    (point) =>
      typeof point.forecastHigh === 'undefined' &&
      typeof point.forecastAvg === 'undefined' &&
      typeof point.forecastLow === 'undefined',
  );
  const latestHistDate =
    historicalPoints[historicalPoints.length - 1]?.date ?? chartData[0].date;
  const forecastEndDate = chartData[chartData.length - 1]?.date ?? latestHistDate;

  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer>
        <LineChart data={chartData}>
          <XAxis
            dataKey="date"
            tickFormatter={formatTickMonth}
            minTickGap={24}
            stroke="#9ca3af"
            padding={{ right: 24 }}
          />
          <YAxis stroke="#9ca3af" />
          <Tooltip content={<PriceForecastTooltip />} />
          <Legend content={<PriceForecastLegend />} />
          <ReferenceLine
            x={latestHistDate}
            stroke="#9ca3af"
            strokeDasharray="4 4"
            label={{
              value: 'Latest',
              position: 'top',
              fill: '#6b7280',
              fontSize: 12,
            }}
          />
          <ReferenceLine
            x={forecastEndDate}
            stroke="#e5e7eb"
            strokeDasharray="2 2"
          />
          <Line
            type="monotone"
            dataKey="close"
            stroke="#6b84d4"
            strokeWidth={2}
            dot={false}
            connectNulls={true}
            name="Close Price"
          />
          <Line
            type="monotone"
            dataKey="avgTargetHist"
            stroke="#e2b053"
            strokeWidth={2}
            dot={false}
            connectNulls={true}
            name="Avg Target (hist)"
          />
          <Line
            type="monotone"
            dataKey="forecastHigh"
            stroke="#bf4b3e"
            strokeWidth={1.5}
            strokeDasharray="4 4"
            dot={<ForecastDot />}
            connectNulls={true}
            legendType="none"
          />
          <Line
            type="monotone"
            dataKey="forecastAvg"
            stroke="#e2b053"
            strokeWidth={2}
            strokeDasharray="0"
            dot={<ForecastDot />}
            connectNulls={true}
            legendType="none"
          />
          <Line
            type="monotone"
            dataKey="forecastLow"
            stroke="#6b84d4"
            strokeWidth={1.5}
            strokeDasharray="4 4"
            dot={<ForecastDot />}
            connectNulls={true}
            legendType="none"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}


