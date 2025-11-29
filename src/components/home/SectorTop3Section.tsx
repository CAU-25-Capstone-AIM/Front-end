import React from 'react';
import styled from 'styled-components';
import { mockSectorRankings } from '../../mocks/sectorRankings';
import { SectorMiniCard } from '../sector/SectorMiniCard';

export type SectorRankingEntry = (typeof mockSectorRankings)[number];

export type SectorTop3SectionProps = {
  sectors: SectorRankingEntry[];
};

export const SectorTop3Section: React.FC<SectorTop3SectionProps> = ({ sectors }) => {
  return (
    <SectionWrapper>
      <SectionHeader>
        <SectionTitle>매수 의견이 몰리는 섹터</SectionTitle>
        <SectionSubtitle>섹터별 Strong Buy + Buy 비율을 기준으로 정렬한 랭킹입니다.</SectionSubtitle>
        <SectionAction
          type="button"
          onClick={() => {
            // eslint-disable-next-line no-console
            console.log('Go to sector ranking page');
          }}
        >
          섹터 랭킹 전체 보기 →
        </SectionAction>
      </SectionHeader>
      <CardsRow>
        {sectors.map((sector, index) => (
          <SectorMiniCard
            key={sector.id}
            rank={index + 1}
            name={sector.name}
            buyRatio={sector.buyRatio}
            onClickDetail={() => {
              // eslint-disable-next-line no-console
              console.log('Go to sector detail:', sector.id);
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

export default SectorTop3Section;

