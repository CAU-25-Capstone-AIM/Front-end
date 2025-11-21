import { useState } from 'react';
import styled from 'styled-components';
import { mockSectorRankings } from '../mocks/sectorRankings';
import { SectorRankingCard } from '../components/sector/SectorRankingCard';

type SectorSortType = 'buyHigh' | 'buyLow';

export const SectorRankingPage = () => {
  const [sortType, setSortType] = useState<SectorSortType>('buyHigh');

  const sortedSectors = [...mockSectorRankings].sort((a, b) => {
    if (sortType === 'buyHigh') {
      return b.buyRatio - a.buyRatio; // 매수율 높은 순
    }
    return a.buyRatio - b.buyRatio; // 매수율 낮은 순
  });

  return (
    <PageContainer>
      <HeaderSection>
        <PageTitle>섹터 랭킹</PageTitle>
        <PageDescription>
          섹터별 애널리스트 의견 비율을 기반으로 매수 선호도가 높은 섹터를 확인합니다.
        </PageDescription>
      </HeaderSection>

      <SortBar>
        <SortButton
          type="button"
          $active={sortType === 'buyHigh'}
          onClick={() => setSortType('buyHigh')}
        >
          매수율 높은 순
        </SortButton>
        <SortButton
          type="button"
          $active={sortType === 'buyLow'}
          onClick={() => setSortType('buyLow')}
        >
          매수율 낮은 순
        </SortButton>
      </SortBar>

      <RankingSection>
        <SectionTitle>섹터별 종합 의견</SectionTitle>
        <CardList>
          {sortedSectors.map((sector, index) => (
            <SectorRankingCard
              key={sector.id}
              name={sector.name}
              totalStocks={sector.totalStocks}
              ratings={sector.ratings}
              buyRatio={sector.buyRatio}
              rank={index + 1}
            />
          ))}
        </CardList>
      </RankingSection>
    </PageContainer>
  );
};

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const HeaderSection = styled.section`
  padding: 24px;
  border-radius: 12px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
`;

const PageTitle = styled.h1`
  font-size: 24px;
  font-weight: 700;
  margin: 0 0 8px 0;
  color: #333;
`;

const PageDescription = styled.p`
  font-size: 14px;
  color: #64748b;
  margin: 0;
`;

const SortBar = styled.section`
  padding: 12px 16px;
  border-radius: 12px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  display: flex;
  gap: 12px;
`;

const SortButton = styled.button<{ $active: boolean }>`
  padding: 8px 16px;
  border: 1px solid ${({ $active }) => ($active ? '#2563eb' : '#e0e0e0')};
  border-radius: 4px;
  background-color: ${({ $active }) => ($active ? '#2563eb' : '#ffffff')};
  color: ${({ $active }) => ($active ? '#ffffff' : '#333')};
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #2563eb;
    background-color: ${({ $active }) => ($active ? '#1d4ed8' : '#f0f8ff')};
  }
`;

const RankingSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const SectionTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  margin: 0;
  color: #333;
`;

const CardList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

