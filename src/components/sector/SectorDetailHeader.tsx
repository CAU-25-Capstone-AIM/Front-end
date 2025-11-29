import React from 'react';
import styled from 'styled-components';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import type { SectorConsensusBreakdown } from '../../models/sector';

type SectorDetailHeaderProps = {
  name: string;
  totalStocks: number;
  buyRatio: number;
  rank?: number;
  ratings: SectorConsensusBreakdown;
};

export const SectorDetailHeader: React.FC<SectorDetailHeaderProps> = ({
  name,
  totalStocks,
  buyRatio,
  rank,
  ratings,
}) => {
  const denominator = totalStocks > 0 ? totalStocks : 1;
  const chartData = [
    {
      key: 'consensus',
      strongBuy: (ratings.strongBuy / denominator) * 100,
      moderateBuy: (ratings.Buy / denominator) * 100,
      hold: (ratings.hold / denominator) * 100,
      moderateSell: (ratings.Sell / denominator) * 100,
      strongSell: (ratings.strongSell / denominator) * 100,
    },
  ];

  return (
    <Container>
      <HeaderRow>
        <div>
          <Title>{name}</Title>
          <Subtitle>
            총 {totalStocks}개 종목 · 매수율 {buyRatio.toFixed(1)}%
          </Subtitle>
        </div>
        {typeof rank === 'number' && (
          <RankBadge>{`#${rank}`}</RankBadge>
        )}
      </HeaderRow>

      <ChartWrapper>
        <ResponsiveContainer width="100%" height={40}>
          <BarChart data={chartData} layout="vertical">
            <XAxis type="number" hide />
            <YAxis type="category" dataKey="key" hide />
            <Bar dataKey="strongBuy" stackId="consensus" fill="#0f766e" />
            <Bar dataKey="moderateBuy" stackId="consensus" fill="#38bdf8" />
            <Bar dataKey="hold" stackId="consensus" fill="#9ca3af" />
            <Bar dataKey="moderateSell" stackId="consensus" fill="#a855f7" />
            <Bar dataKey="strongSell" stackId="consensus" fill="#7e22ce" />
          </BarChart>
        </ResponsiveContainer>
      </ChartWrapper>
    </Container>
  );
};

const Container = styled.div`
  background: #ffffff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 700;
  margin: 0;
  color: #0f172a;
`;

const Subtitle = styled.p`
  margin: 8px 0 0;
  font-size: 14px;
  color: #64748b;
`;

const RankBadge = styled.span`
  align-self: flex-start;
  padding: 6px 14px;
  border-radius: 999px;
  background: #2563eb;
  color: #ffffff;
  font-weight: 600;
  font-size: 14px;
`;

const ChartWrapper = styled.div`
  width: 100%;
  height: 40px;
`;

