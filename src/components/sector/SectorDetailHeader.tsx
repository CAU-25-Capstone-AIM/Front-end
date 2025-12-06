import React from 'react';
import styled from 'styled-components';

type SectorDetailHeaderProps = {
  name: string;
  totalStocks: number;
  buyRatio: number;
  rank?: number;
};

export const SectorDetailHeader: React.FC<SectorDetailHeaderProps> = ({
  name,
  totalStocks,
  buyRatio,
  rank,
}) => {
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

