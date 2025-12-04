import React from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import { SectorDetailHeader } from '../components/sector/SectorDetailHeader';
import { SectorConsensusSummary } from '../components/sector/SectorConsensusSummary';
import { SectorStockListSection } from '../components/sector/SectorStockListSection';
import { mockSectorDetails } from '../mocks/sectorDetails';

type SectorDetailContentProps = {
  sectorId?: string;
};

const SectorDetailContent: React.FC<SectorDetailContentProps> = ({ sectorId }) => {
  const sector = mockSectorDetails.find((item) => item.id === sectorId);

  if (!sector) {
    return (
      <PageContainer>
        <EmptyState>섹터를 찾을 수 없습니다.</EmptyState>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <SectorDetailHeader
        name={sector.name}
        totalStocks={sector.totalStocks}
        buyRatio={sector.buyRatio}
        rank={sector.rank}
        ratings={sector.ratings}
      />

      <SectionCard>
        <SectorConsensusSummary totalStocks={sector.totalStocks} ratings={sector.ratings} />
      </SectionCard>

      <SectionCard>
        <SectionTitle>섹터 내 종목 리스트</SectionTitle>
        <SectorStockListSection stocks={sector.stocks} />
      </SectionCard>
    </PageContainer>
  );
};

export const SectorDetailPage: React.FC = () => {
  const { sectorId } = useParams<{ sectorId: string }>();
  return (
    <SectorDetailContent
      sectorId={sectorId ? decodeURIComponent(sectorId) : undefined}
    />
  );
};

type SectorDetailPreviewProps = {
  sectorId: string;
};

export const SectorDetailPreview: React.FC<SectorDetailPreviewProps> = ({ sectorId }) => {
  return <SectorDetailContent sectorId={sectorId} />;
};

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const SectionCard = styled.section`
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const SectionTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  margin: 0;
`;

const EmptyState = styled.div`
  width: 100%;
  padding: 80px 0;
  text-align: center;
  font-size: 16px;
  color: #94a3b8;
`;

