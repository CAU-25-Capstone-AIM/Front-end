import {
  ResponsiveContainer,
  ComposedChart,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
  Area,
  ReferenceLine,
} from 'recharts';
import type {
  StockClosePricePoint as ClosePricePoint,
  StockDailyAverageTargetPricePoint as DailyAverageTargetPricePoint,
  StockLatestTargetPriceSummary as TargetPriceStats,
  StockPriceForecastChartPoint as PriceForecastChartPoint,
} from '../../types/stock';
import { buildPriceForecastChartData } from '../../utils/buildPriceForecastChartData';

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
  return `${year.slice(2)}-${month}`;
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
              ? 'Forecast High'
              : item.dataKey === 'forecastAvg'
                ? 'Forecast Avg'
                : 'Forecast Low',
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
    <LegendItem color="#111827" label="종가" />
    <LegendItem color="#d2a84b" label="이전 애널리스트 평균 목표주가" />
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

export function PriceForecastChart({
  closePriceTrend,
  dailyAverageTargetPrices,
  targetPriceStats,
  height = 360,
}: PriceForecastChartProps) {
  const chartData = buildPriceForecastChartData({
    closePriceTrend,
    dailyAverageTargetPrices,
    latestTargetPriceSummary: {
      average_target_price: targetPriceStats.average_target_price,
      max_target_price: targetPriceStats.max_target_price,
      min_target_price: targetPriceStats.min_target_price,
    },
  });

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
        <ComposedChart data={chartData}>
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
            stroke="#111827"
            strokeWidth={2}
            dot={false}
            name="Close Price"
          />
          <Line
            type="monotone"
            dataKey="avgTargetHist"
            stroke="#d2a84b"
            strokeWidth={2}
            dot={false}
            name="Avg Target (hist)"
          />
          <Line
            type="monotone"
            dataKey="forecastHigh"
            stroke="#b0302e"
            strokeWidth={1.5}
            strokeDasharray="4 4"
            dot={false}
            legendType="none"
          />
          <Line
            type="monotone"
            dataKey="forecastAvg"
            stroke="#b0302e"
            strokeWidth={2}
            strokeDasharray="0"
            dot={{ r: 3, stroke: '#b0302e', strokeWidth: 1, fill: '#fff' }}
            legendType="none"
          />
          <Line
            type="monotone"
            dataKey="forecastLow"
            stroke="#b0302e"
            strokeWidth={1.5}
            strokeDasharray="4 4"
            dot={false}
            legendType="none"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}


