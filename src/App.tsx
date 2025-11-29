import styled from 'styled-components';
import { Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { MainAnalystRankingPage } from './pages/MainAnalystRankingPage';
import { StockRankingPage } from './pages/StockRankingPage';
import { SectorRankingPage } from './pages/SectorRankingPage';
import { AnalystDetailPage } from './pages/AnalystDetailPage';
import { StockDetailPage } from './pages/StockDetailPage';
import { SectorDetailPage } from './pages/SectorDetailPage';
import { Navbar } from './components/layout/Navbar';

const AppLayout = styled.div`
  min-height: 100vh;
  background-color: #f3f4f6;
`;

const ContentWrapper = styled.main`
  padding: 80px 24px 40px;
`;

function App() {
  return (
    <AppLayout>
      <Navbar />
      <ContentWrapper>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/analysts" element={<MainAnalystRankingPage />} />
          <Route path="/analysts/:analystId" element={<AnalystDetailPage />} />
          <Route path="/stocks" element={<StockRankingPage />} />
          <Route path="/stocks/:ticker" element={<StockDetailPage />} />
          <Route path="/sectors" element={<SectorRankingPage />} />
          <Route path="/sectors/:sectorId" element={<SectorDetailPage />} />
        </Routes>
      </ContentWrapper>
    </AppLayout>
  );
}

export default App;
