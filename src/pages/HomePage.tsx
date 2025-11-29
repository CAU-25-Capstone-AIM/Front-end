import React from 'react';
import styled from 'styled-components';
import { HeroSlider } from '../components/home/HeroSlider';

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px 16px 40px;
`;

export const HomePage: React.FC = () => {
  return (
    <PageContainer>
      <HeroSlider />
    </PageContainer>
  );
};

export default HomePage;

