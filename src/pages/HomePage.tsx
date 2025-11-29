import React from 'react';
import styled from 'styled-components';
import { HeroSlider } from '../components/home/HeroSlider';
import { AnalystTop3Section } from '../components/home/AnalystTop3Section';
import { mockAnalystRankings } from '../mocks/analystRankings';

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px 16px 40px;
`;

export const HomePage: React.FC = () => {
  const top3Analysts = [...mockAnalystRankings].sort((a, b) => a.rank - b.rank).slice(0, 3);

  return (
    <PageContainer>
      <HeroSlider />
      <AnalystTop3Section analysts={top3Analysts} />
    </PageContainer>
  );
};

export default HomePage;

