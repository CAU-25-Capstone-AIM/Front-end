import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { HeroSlider } from '../components/home/HeroSlider';
import { AnalystTop3Section } from '../components/home/AnalystTop3Section';
import { StockTop3Section } from '../components/home/StockTop3Section';
import { SectorTop3Section } from '../components/home/SectorTop3Section';
import { mockAnalystRankings } from '../mocks/analystRankings';
import { mockStockRankings } from '../mocks/stockRankings';
import { mockSectorRankings } from '../mocks/sectorRankings';

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px 16px 40px;
`;

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const top3Analysts = [...mockAnalystRankings].sort((a, b) => a.rank - b.rank).slice(0, 3);
  const top3Stocks = [...mockStockRankings].sort((a, b) => b.upside - a.upside).slice(0, 3);
  const top3Sectors = [...mockSectorRankings].sort((a, b) => b.buyRatio - a.buyRatio).slice(0, 3);

  const handleGoAnalystRanking = () => {
    navigate('/analysts');
  };

  const handleGoStockRanking = () => {
    navigate('/stocks');
  };

  const handleGoSectorRanking = () => {
    navigate('/sectors');
  };

  return (
    <PageContainer>
      <HeroSlider />
      <AnalystTop3Section
        analysts={top3Analysts}
        onClickAnalystDetail={(analystId) => navigate(`/analysts/${analystId}`)}
        onClickSeeAll={handleGoAnalystRanking}
      />
      <StockTop3Section
        stocks={top3Stocks}
        onClickStockDetail={(stockId) => navigate(`/stocks/${stockId}`)}
        onClickSeeAll={handleGoStockRanking}
      />
      <SectorTop3Section
        sectors={top3Sectors}
        onClickSectorDetail={(sectorId) => navigate(`/sectors/${sectorId}`)}
        onClickSeeAll={handleGoSectorRanking}
      />
    </PageContainer>
  );
};

export default HomePage;

