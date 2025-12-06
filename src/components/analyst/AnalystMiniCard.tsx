import React from 'react';
import styled from 'styled-components';

export type AnalystMiniCardProps = {
  rank: number;
  name: string;
  firm: string;
  accuracy: number;
  avgReturn: number;
  compositeScore: number;
  onClickDetail?: () => void;
};

export const AnalystMiniCard: React.FC<AnalystMiniCardProps> = ({
  rank,
  name,
  firm,
  accuracy,
  avgReturn,
  compositeScore,
  onClickDetail,
}) => {
  return (
    <CardWrapper type="button" onClick={onClickDetail}>
      <HeaderRow>
        <RankBadge>#{rank}</RankBadge>
        <NameArea>
          <NameText>{name}</NameText>
          <FirmText>{firm}</FirmText>
        </NameArea>
      </HeaderRow>
      <MetricsRow>
      <MetricItem>
          <MetricLabel>AIM Score</MetricLabel>
          <MetricValue>{compositeScore.toFixed(1)}</MetricValue>
        </MetricItem>
        <MetricItem>
          <MetricLabel>정답률</MetricLabel>
          <MetricValue>{accuracy.toFixed(1)}%</MetricValue>
        </MetricItem>
        <MetricItem>
          <MetricLabel>평균 수익률</MetricLabel>
          <MetricValue>{avgReturn.toFixed(1)}%</MetricValue>
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
  align-items: center;
`;

const RankBadge = styled.span`
  padding: 4px 10px;
  border-radius: 999px;
  background: #2563eb;
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

const FirmText = styled.div`
  font-size: 12px;
  color: #6b7280;
`;

const MetricsRow = styled.div`
  display: flex;
  gap: 12px;
  font-size: 12px;
  color: #4b5563;
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

export default AnalystMiniCard;

