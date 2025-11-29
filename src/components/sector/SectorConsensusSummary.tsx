import React from 'react';
import styled from 'styled-components';
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

export const SectorConsensusSummary: React.FC<SectorConsensusSummaryProps> = ({ totalStocks, ratings }) => {
  const denominator = totalStocks > 0 ? totalStocks : 1;
  const entries = (Object.keys(ratings) as (keyof SectorConsensusBreakdown)[]).map((key) => ({
    key,
    label: ratingLabels[key],
    count: ratings[key],
    ratio: (ratings[key] / denominator) * 100,
  }));

  return (
    <Card>
      <DonutCircle>
        <DonutValue>{totalStocks}</DonutValue>
        <DonutLabel>총 종목</DonutLabel>
      </DonutCircle>
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

const DonutCircle = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  border: 6px solid #38bdf8;
  box-shadow: inset 0 0 0 4px #e5e7eb;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const DonutValue = styled.span`
  font-size: 16px;
  font-weight: 700;
  color: #0f172a;
  line-height: 1;
`;

const DonutLabel = styled.span`
  font-size: 10px;
  color: #6b7280;
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

