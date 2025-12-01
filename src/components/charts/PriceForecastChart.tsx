import { useMemo } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ReferenceLine,
} from 'recharts';
import type {
  ClosePricePoint,
  DailyAverageTargetPricePoint,
  LatestTargetPriceSummary,
  PriceForecastChartPoint,
} from '../../types/stock';
import { buildPriceForecastChartData } from '../../utils/buildPriceForecastChartData';

type PriceForecastChartProps = {
  closePriceTrend: ClosePricePoint[];
  dailyAverageTargetPrices: DailyAverageTargetPricePoint[];
  latestTargetPriceSummary: LatestTargetPriceSummary;
  height?: number;
};

const DEFAULT_COLORS = {
  close: '#1d4ed8',
  avgTargetHist: '#9333ea',
  forecastHigh: '#ef4444',
  forecastAvg: '#f59e0b',
  forecastLow: '#10b981',
};

const formatTickMonth = (value: string) => {
  if (!value) return value;
  const normalized = value.slice(0, 7);
  return normalized;
};

type TooltipPayload = {
  color?: string;
  value: number;
  dataKey: keyof PriceForecastChartPoint;
};

const PriceForecastTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
}) => {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const lines = payload
    .filter(
      (item) =>
        item.value !== undefined &&
        item.value !== null &&
        typeof item.value === 'number',
    )
    .map((item) => ({
      key: item.dataKey,
      label: (() => {
        switch (item.dataKey) {
          case 'close':
            return 'Close Price';
          case 'avgTargetHist':
            return 'Avg Target (hist)';
          case 'forecastHigh':
            return 'Forecast High';
          case 'forecastAvg':
            return 'Forecast Avg';
          case 'forecastLow':
            return 'Forecast Low';
          default:
            return item.dataKey;
        }
      })(),
      color: item.color ?? '#555',
      value: item.value.toLocaleString('ko-KR'),
    }));

  if (!lines.length) {
    return null;
  }

  return (
    <div
      style={{
        background: '#ffffff',
        border: '1px solid #e5e7eb',
        borderRadius: 8,
        padding: '8px 12px',
        fontSize: 12,
        boxShadow: '0 4px 12px rgba(15, 23, 42, 0.12)',
      }}
    >
      <div style={{ fontWeight: 600, marginBottom: 4 }}>{label}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {lines.map((line) => (
          <div
            key={line.key}
            style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}
          >
            <span style={{ color: line.color }}>{line.label}</span>
            <span>{line.value}원</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export function PriceForecastChart({
  closePriceTrend,
  dailyAverageTargetPrices,
  latestTargetPriceSummary,
  height = 360,
}: PriceForecastChartProps) {
  const chartData = useMemo(
    () =>
      buildPriceForecastChartData({
        closePriceTrend,
        dailyAverageTargetPrices,
        latestTargetPriceSummary,
      }),
    [closePriceTrend, dailyAverageTargetPrices, latestTargetPriceSummary],
  );

  if (!chartData.length) {
    return (
      <div
        style={{
          height,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid #e5e7eb',
          borderRadius: 8,
          color: '#6b7280',
        }}
      >
        차트 데이터를 표시할 수 없습니다.
      </div>
    );
  }

  const latestHistoryDate = useMemo(() => {
    const historyPoints = chartData.filter(
      (point) =>
        point.forecastHigh === undefined &&
        point.forecastAvg === undefined &&
        point.forecastLow === undefined,
    );
    const lastHistory = historyPoints[historyPoints.length - 1];
    return lastHistory?.date;
  }, [chartData]);

  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer>
        <ComposedChart data={chartData} margin={{ top: 20, right: 30, bottom: 20, left: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="date"
            tickFormatter={formatTickMonth}
            minTickGap={32}
            tick={{ fontSize: 12, fill: '#4b5563' }}
          />
          <YAxis
            tick={{ fontSize: 12, fill: '#4b5563' }}
            width={60}
            tickFormatter={(value) => value.toLocaleString('ko-KR')}
          />
          <Tooltip content={<PriceForecastTooltip />} />
          <Legend verticalAlign="top" height={36} />

          {latestHistoryDate && (
            <ReferenceLine
              x={latestHistoryDate}
              stroke="#9ca3af"
              strokeDasharray="4 4"
              label={{
                value: 'Latest',
                position: 'top',
                fill: '#6b7280',
                fontSize: 12,
              }}
            />
          )}

          <Line
            type="monotone"
            dataKey="close"
            name="Close Price"
            stroke={DEFAULT_COLORS.close}
            strokeWidth={2}
            dot={false}
            connectNulls
          />
          <Line
            type="monotone"
            dataKey="avgTargetHist"
            name="Avg Target (hist)"
            stroke={DEFAULT_COLORS.avgTargetHist}
            strokeDasharray="5 3"
            dot={false}
            connectNulls
          />
          <Line
            type="monotone"
            dataKey="forecastHigh"
            name="Forecast High"
            stroke={DEFAULT_COLORS.forecastHigh}
            strokeDasharray="4 2"
            dot={false}
            connectNulls
          />
          <Line
            type="monotone"
            dataKey="forecastAvg"
            name="Forecast Avg"
            stroke={DEFAULT_COLORS.forecastAvg}
            strokeDasharray="4 2"
            dot={false}
            connectNulls
          />
          <Line
            type="monotone"
            dataKey="forecastLow"
            name="Forecast Low"
            stroke={DEFAULT_COLORS.forecastLow}
            strokeDasharray="4 2"
            dot={false}
            connectNulls
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

export default PriceForecastChart;

