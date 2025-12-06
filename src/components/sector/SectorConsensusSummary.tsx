import React from 'react';
import styled from 'styled-components';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import type { SectorConsensusBreakdown } from '../../models/sector';

type SectorConsensusSummaryProps = {
  totalStocks: number;
  ratings: SectorConsensusBreakdown;
};

const ratingLabels: Record<keyof SectorConsensusBreakdown, string> = {
  strongBuy: 'Strong Buy',
  moderateBuy: 'Moderate Buy',
  hold: 'Hold',
  moderateSell: 'Moderate Sell',
  strongSell: 'Strong Sell',
};

const ratingColors: Record<keyof SectorConsensusBreakdown, string> = {
  strongBuy: '#166534',
  moderateBuy: '#4ADE80',
  hold: '#9CA3AF',
  moderateSell: '#FB7185',
  strongSell: '#B91C1C',
};

export const SectorConsensusSummary: React.FC<SectorConsensusSummaryProps> = ({ totalStocks, ratings }) => {
  const denominator = totalStocks > 0 ? totalStocks : 1;
  const entries = (Object.keys(ratings) as (keyof SectorConsensusBreakdown)[]).map((key) => ({
    key,
    label: ratingLabels[key],
    count: ratings[key],
    ratio: (ratings[key] / denominator) * 100,
    color: ratingColors[key],
  }));

  // 파이 차트용 데이터 (값이 0인 항목 제외)
  const chartData = entries.filter((item) => item.count > 0);

  return (
    <Card>
      <ChartContainer>
        <ResponsiveContainer width={120} height={120}>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="count"
              nameKey="label"
              cx="50%"
              cy="50%"
              innerRadius={35}
              outerRadius={60}
            >
              {chartData.map((entry) => (
                <Cell key={entry.key} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <ChartCenter>
          <CenterValue>{totalStocks}</CenterValue>
          <CenterLabel>총 종목</CenterLabel>
        </ChartCenter>
      </ChartContainer>
      <List>
        {entries.map((item) => (
          <ListItem key={item.key}>
            <Label>{item.label}</Label>
            <Value>
              {item.count} <RatioText>({item.ratio.toFixed(1)}%)</RatioText>
            </Value>
          </ListItem>
        ))}
      </List>
    </Card>
  );
};

const Card = styled.div`
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
  padding: 16px 20px;
  display: flex;
  align-items: center;
  gap: 20px;
`;

const ChartContainer = styled.div`
  position: relative;
  width: 120px;
  height: 120px;
  flex-shrink: 0;
`;

const ChartCenter = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  pointer-events: none;
`;

const CenterValue = styled.span`
  font-size: 20px;
  font-weight: 700;
  color: #0f172a;
  line-height: 1;
`;

const CenterLabel = styled.span`
  font-size: 11px;
  color: #6b7280;
  margin-top: 2px;
`;

const List = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const ListItem = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: #0f172a;
`;

const Label = styled.span`
  font-weight: 500;
`;

const Value = styled.span`
  font-weight: 600;
`;

const RatioText = styled.span`
  font-size: 12px;
  color: #6b7280;
  font-weight: 500;
`;

