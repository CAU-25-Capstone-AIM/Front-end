import React from 'react';
import styled from 'styled-components';

export type StockMiniCardProps = {
  rank: number;
  name: string;
  ticker: string;
  sector: string;
  upside: number;
  buyRatio: number;
  onClickDetail?: () => void;
};

export const StockMiniCard: React.FC<StockMiniCardProps> = ({
  rank,
  name,
  ticker,
  sector,
  upside,
  buyRatio,
  onClickDetail,
}) => {
  return (
    <CardWrapper type="button" onClick={onClickDetail}>
      <HeaderRow>
        <RankBadge>#{rank}</RankBadge>
        <NameArea>
          <NameText>{name}</NameText>
          <TickerText>{ticker}</TickerText>
        </NameArea>
      </HeaderRow>
      <MetaRow>
        <SectorText>{sector}</SectorText>
      </MetaRow>
      <MetricsRow>
        <MetricItem>
          <MetricLabel>상승 여력</MetricLabel>
          <MetricValue>{upside.toFixed(1)}%</MetricValue>
        </MetricItem>
        <MetricItem>
          <MetricLabel>매수 비율</MetricLabel>
          <MetricValue>{buyRatio.toFixed(1)}%</MetricValue>
        </MetricItem>
      </MetricsRow>
    </CardWrapper>
  );
};

const CardWrapper = styled.button`
  width: 100%;
  border: none;
  background: #ffffff;
  border-radius: 12px;
  padding: 16px 18px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  gap: 8px;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
  text-align: left;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
  }
`;

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
`;

const RankBadge = styled.span`
  padding: 4px 10px;
  border-radius: 999px;
  background: #16a34a;
  color: #ffffff;
  font-size: 12px;
  font-weight: 600;
`;

const NameArea = styled.div`
  text-align: right;
`;

const NameText = styled.div`
  font-size: 15px;
  font-weight: 600;
  color: #111827;
`;

const TickerText = styled.div`
  font-size: 12px;
  color: #6b7280;
`;

const MetaRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SectorText = styled.span`
  font-size: 12px;
  color: #6b7280;
`;

const MetricsRow = styled.div`
  display: flex;
  gap: 12px;
  font-size: 12px;
  flex-wrap: wrap;
`;

const MetricItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const MetricLabel = styled.span`
  color: #9ca3af;
  font-size: 11px;
`;

const MetricValue = styled.span`
  color: #111827;
  font-weight: 600;
`;

export default StockMiniCard;

