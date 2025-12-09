import React from 'react';
import styled from 'styled-components';

type MetricCardProps = {
  label: string;
  value: string;
  description?: string;
  trend?: 'up' | 'down' | 'neutral';
  rank?: number;
  totalAnalysts?: number;
};

const Container = styled.div`
  padding: 20px;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.span`
  font-size: 14px;
  color: #666;
  font-weight: 500;
`;

const ValueRow = styled.div`
  display: flex;
  align-items: baseline;
  gap: 8px;
`;

const Value = styled.span`
  font-size: 24px;
  font-weight: 700;
  color: #333;
`;

const TrendIcon = styled.span<{ trend: 'up' | 'down' | 'neutral' }>`
  font-size: 16px;
  color: ${(props) => {
    if (props.trend === 'up') return '#4caf50';
    if (props.trend === 'down') return '#f44336';
    return '#999';
  }};
`;

const Description = styled.p`
  margin: 0;
  font-size: 12px;
  color: #888;
`;

const RankBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 12px;
  background-color: #2563eb;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 600;
  color: #ffffff;
  margin-top: 4px;
  width: fit-content;
`;

const StarIcon = styled.span`
  color: #fbbf24;
  font-size: 13px;
`;

const RankText = styled.span`
  font-size: 11px;
  color: #888;
  margin-top: 4px;
`;

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  description,
  trend,
  rank,
  totalAnalysts,
}) => {
  const getTrendIcon = () => {
    if (trend === 'up') return '↑';
    if (trend === 'down') return '↓';
    return '→';
  };

  // 등수에 따른 별 개수 계산
  const getStarCount = (rankValue: number): number => {
    if (rankValue >= 1 && rankValue <= 20) return 3;
    if (rankValue >= 21 && rankValue <= 60) return 2;
    if (rankValue >= 61 && rankValue <= 100) return 1;
    return 0;
  };

  const starCount = rank ? getStarCount(rank) : 0;

  return (
    <Container>
      <Label>{label}</Label>
      <ValueRow>
        <Value>{value}</Value>
        {trend && <TrendIcon trend={trend}>{getTrendIcon()}</TrendIcon>}
      </ValueRow>
      {rank && (
        <>
          <RankBadge>
            #{rank}
            {starCount > 0 &&
              Array.from({ length: starCount }).map((_, i) => (
                <StarIcon key={i}>★</StarIcon>
              ))}
          </RankBadge>
          {totalAnalysts && (
            <RankText>전체 {totalAnalysts}명 중</RankText>
          )}
        </>
      )}
      {description && <Description>{description}</Description>}
    </Container>
  );
};

/*
// Mock 테스트 예시:
<MetricCard
  label="정답률"
  value="85.5%"
  description="전체 리포트 대비 정확도"
  trend="up"
/>
*/

