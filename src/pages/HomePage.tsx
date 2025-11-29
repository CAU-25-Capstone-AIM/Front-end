import React from 'react';
import styled from 'styled-components';
import { HeroSlider } from '../components/home/HeroSlider';
import { AnalystTop3Section } from '../components/home/AnalystTop3Section';
import { StockTop3Section } from '../components/home/StockTop3Section';
import { mockAnalystRankings } from '../mocks/analystRankings';
import { mockStockRankings } from '../mocks/stockRankings';

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px 16px 40px;
`;

export const HomePage: React.FC = () => {
  const top3Analysts = [...mockAnalystRankings].sort((a, b) => a.rank - b.rank).slice(0, 3);
  const top3Stocks = [...mockStockRankings].sort((a, b) => b.upside - a.upside).slice(0, 3);

  return (
    <PageContainer>
      <HeroSlider />
      <AnalystTop3Section analysts={top3Analysts} />
      <StockTop3Section stocks={top3Stocks} />
    </PageContainer>
  );
};

export default HomePage;

