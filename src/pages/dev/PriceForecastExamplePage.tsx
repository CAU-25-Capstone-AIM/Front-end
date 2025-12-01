import styled from 'styled-components';
import { PriceForecastChart } from '../../components/charts/PriceForecastChart';
import type {
  ClosePricePoint,
  DailyAverageTargetPricePoint,
  LatestTargetPriceSummary,
} from '../../types/stock';

const Wrapper = styled.div`
  padding: 32px 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  color: #111827;
`;

const mockCloseTrend: ClosePricePoint[] = [
  { trade_date: '2019-01-02', close_price: 48000 },
  { trade_date: '2020-01-02', close_price: 52000 },
  { trade_date: '2021-01-04', close_price: 64000 },
  { trade_date: '2022-01-03', close_price: 71000 },
  { trade_date: '2023-01-02', close_price: 84000 },
  { trade_date: '2024-01-02', close_price: 92000 },
  { trade_date: '2024-12-31', close_price: 98000 },
];

const mockDailyAvgTargets: DailyAverageTargetPricePoint[] = [
  { trade_date: '2021-01-04', average_target_price: 66000 },
  { trade_date: '2022-01-03', average_target_price: 74000 },
  { trade_date: '2023-01-02', average_target_price: 86000 },
  { trade_date: '2024-12-31', average_target_price: 102000 },
];

const mockSummary: LatestTargetPriceSummary = {
  average_target_price: 103000,
  max_target_price: 120000,
  min_target_price: 90000,
};

export function PriceForecastExamplePage() {
  return (
    <Wrapper>
      <Title>Price Forecast Chart (Example)</Title>
      <PriceForecastChart
        closePriceTrend={mockCloseTrend}
        dailyAverageTargetPrices={mockDailyAvgTargets}
        latestTargetPriceSummary={mockSummary}
      />
    </Wrapper>
  );
}

export default PriceForecastExamplePage;

