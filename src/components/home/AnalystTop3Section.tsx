import React from 'react';
import styled from 'styled-components';
import { mockAnalystRankings } from '../../mocks/analystRankings';
import { AnalystMiniCard } from '../analyst/AnalystMiniCard';

export type AnalystRankingEntry = (typeof mockAnalystRankings)[number];

export type AnalystTop3SectionProps = {
  analysts: AnalystRankingEntry[];
};

export const AnalystTop3Section: React.FC<AnalystTop3SectionProps> = ({ analysts }) => {
  return (
    <SectionWrapper>
      <SectionHeader>
        <SectionTitle>신뢰도 TOP 애널리스트</SectionTitle>
        <SectionSubtitle>
          정답률, 수익률, 목표가 오차율을 종합해 산출한 AIM 랭킹입니다.
        </SectionSubtitle>
        <SectionAction
          type="button"
          onClick={() => {
            // eslint-disable-next-line no-console
            console.log('Go to analyst ranking page');
          }}
        >
          애널리스트 랭킹 전체 보기 →
        </SectionAction>
      </SectionHeader>
      <CardsRow>
        {analysts.map((analyst) => (
          <AnalystMiniCard
            key={analyst.id}
            rank={analyst.rank}
            name={analyst.name}
            firm={analyst.firm}
            accuracy={analyst.metrics.accuracy}
            avgReturn={analyst.metrics.avgReturn}
            compositeScore={analyst.metrics.compositeScore}
            onClickDetail={() => {
              // eslint-disable-next-line no-console
              console.log('Go to analyst detail:', analyst.id);
            }}
          />
        ))}
      </CardsRow>
    </SectionWrapper>
  );
};

const SectionWrapper = styled.section`
  margin-top: 32px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const SectionHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const SectionTitle = styled.h3`
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  color: #111827;
`;

const SectionSubtitle = styled.p`
  margin: 0;
  font-size: 13px;
  color: #6b7280;
`;

const SectionAction = styled.button`
  align-self: flex-end;
  margin-top: 4px;
  font-size: 12px;
  color: #2563eb;
  background: transparent;
  border: none;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

const CardsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
  margin-top: 8px;
`;

export default AnalystTop3Section;

