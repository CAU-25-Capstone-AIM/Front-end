import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { HeroSlider } from '../components/home/HeroSlider';
import { AnalystTop3Section } from '../components/home/AnalystTop3Section';
import { StockTop3Section } from '../components/home/StockTop3Section';
import { SectorTop3Section } from '../components/home/SectorTop3Section';
import { useHomeData } from '../hooks/useHomeData';

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px 16px 40px;
`;

const LoadingMessage = styled.div`
  padding: 24px;
  text-align: center;
  color: #64748b;
  font-size: 14px;
`;

const ErrorMessage = styled.div`
  padding: 24px;
  text-align: center;
  color: #ef4444;
  font-size: 14px;
`;

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { data, isLoading, isError } = useHomeData();

  const handleGoAnalystRanking = () => {
    navigate('/analysts');
  };

  const handleGoStockRanking = () => {
    navigate('/stocks');
  };

  const handleGoSectorRanking = () => {
    navigate('/sectors');
  };

  if (isLoading) {
    return (
      <PageContainer>
        <HeroSlider />
        <LoadingMessage>홈 데이터를 불러오는 중입니다...</LoadingMessage>
      </PageContainer>
    );
  }

  if (isError || !data) {
    return (
      <PageContainer>
        <HeroSlider />
        <ErrorMessage>홈 데이터를 불러오는 중 오류가 발생했습니다.</ErrorMessage>
      </PageContainer>
    );
  }

  const { topAnalysts, topStocks, topSectors } = data;

  return (
    <PageContainer>
      <HeroSlider />
      <AnalystTop3Section
        analysts={topAnalysts}
        onClickAnalystDetail={(analystId) => navigate(`/analysts/${analystId}`)}
        onClickSeeAll={handleGoAnalystRanking}
      />
      <StockTop3Section
        stocks={topStocks}
        onClickStockDetail={(stockId) => navigate(`/stocks/${stockId}`)}
        onClickSeeAll={handleGoStockRanking}
      />
      <SectorTop3Section
        sectors={topSectors}
        onClickSectorDetail={(sectorId) =>
          navigate(`/sectors/${encodeURIComponent(sectorId)}`)
        }
        onClickSeeAll={handleGoSectorRanking}
      />
    </PageContainer>
  );
};

export default HomePage;

