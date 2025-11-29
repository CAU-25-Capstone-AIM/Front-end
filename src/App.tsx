import { useState } from 'react';
import styled from 'styled-components';
import { MainAnalystRankingPage } from './pages/MainAnalystRankingPage';
import { StockDetailPage } from './pages/StockDetailPage';
import { AnalystDetailPage } from './pages/AnalystDetailPage';
import { StockRankingPage } from './pages/StockRankingPage';
import { SectorRankingPage } from './pages/SectorRankingPage';
import { SectorDetailPreview } from './pages/SectorDetailPage';

const AppContainer = styled.div`
  min-height: 100vh;
  background-color: #f5f5f5;
`;

const Navigation = styled.nav`
  padding: 16px 24px;
  background-color: #ffffff;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  gap: 16px;
`;

const NavButton = styled.button<{ active: boolean }>`
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  background-color: ${(props) => (props.active ? '#007bff' : 'transparent')};
  color: ${(props) => (props.active ? '#ffffff' : '#333')};
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: ${(props) => (props.active ? '#0056b3' : '#f0f0f0')};
  }
`;

type PageType = 'ranking' | 'stockRanking' | 'stock' | 'analyst' | 'sectors' | 'sectorDetail';

function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('ranking');

  const renderPage = () => {
    switch (currentPage) {
      case 'ranking':
        return <MainAnalystRankingPage />;
      case 'stockRanking':
        return <StockRankingPage />;
      case 'stock':
        return <StockDetailPage />;
      case 'analyst':
        return <AnalystDetailPage />;
      case 'sectors':
        return <SectorRankingPage />;
      case 'sectorDetail':
        return <SectorDetailPreview sectorId="sector-tech" />;
      default:
        return <MainAnalystRankingPage />;
    }
  };

  return (
    <AppContainer>
      <Navigation>
        <NavButton
          active={currentPage === 'ranking'}
          onClick={() => setCurrentPage('ranking')}
        >
          애널리스트 랭킹
        </NavButton>
        <NavButton
          active={currentPage === 'stockRanking'}
          onClick={() => setCurrentPage('stockRanking')}
        >
          종목 랭킹
        </NavButton>
        <NavButton
          active={currentPage === 'stock'}
          onClick={() => setCurrentPage('stock')}
        >
          종목 상세
        </NavButton>
        <NavButton
          active={currentPage === 'analyst'}
          onClick={() => setCurrentPage('analyst')}
        >
          애널리스트 상세
        </NavButton>
        <NavButton
          active={currentPage === 'sectors'}
          onClick={() => setCurrentPage('sectors')}
        >
          섹터 랭킹
        </NavButton>
        <NavButton
          active={currentPage === 'sectorDetail'}
          onClick={() => setCurrentPage('sectorDetail')}
        >
          섹터 상세
        </NavButton>
      </Navigation>
      {renderPage()}
    </AppContainer>
  );
}

export default App;
