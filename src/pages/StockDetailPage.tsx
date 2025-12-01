import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import { StockHeader } from '../components/stock/StockHeader';
import { AnalystCard } from '../components/analyst/AnalystCard';
import { useStockDetail } from '../hooks/useStockDetail';
import { useAnalystSort } from '../hooks/useAnalystSort';
import { AnalystSortControl } from '../components/analyst/AnalystSortControl';

const PageContainer = styled.div`
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  max-width: 1200px;
  margin: 0 auto;
`;

const Section = styled.section`
  padding: 24px;
  background-color: #ffffff;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
`;

const SectionTitle = styled.h2`
  margin: 0 0 16px 0;
  font-size: 20px;
  font-weight: 600;
  color: #333;
`;

const OpinionSummary = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 16px;
`;

const OpinionBox = styled.div`
  flex: 1;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
  text-align: center;
`;

const OpinionLabel = styled.div`
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
`;

const OpinionValue = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: #333;
`;

const TargetPriceGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-top: 16px;
`;

const TargetPriceItem = styled.div`
  padding: 16px;
  background-color: #f8f9fa;
  border-radius: 8px;
`;

const TargetPriceLabel = styled.div`
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
`;

const TargetPriceValue = styled.div`
  font-size: 20px;
  font-weight: 700;
  color: #333;
`;

const UpsidePotential = styled.div`
  margin-top: 16px;
  padding: 16px;
  background-color: #e8f5e9;
  border-radius: 8px;
  text-align: center;
`;

const UpsideText = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #2e7d32;
`;

const ChartPlaceholder = styled.div`
  width: 100%;
  height: 300px;
  background-color: #f8f9fa;
  border: 1px dashed #ccc;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 14px;
  margin-top: 16px;
`;

const AnalystListHeader = styled.div`
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const AnalystList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const formatCurrency = (value: number) =>
  `${value.toLocaleString('ko-KR', { maximumFractionDigits: 0 })}원`;

const formatOpinionPercent = (count: number, total: number) => {
  if (!total) {
    return '-';
  }
  const ratio = (count / total) * 100;
  return `${ratio.toFixed(1)}%`;
};

type StockAnalyst = {
  id: string;
  name: string;
  firm: string;
  sectors: string[];
  metrics: {
    accuracy: number;
    avgReturn: number;
    targetError: number;
    compositeScore: number;
  };
};

export const StockDetailPage = () => {
  const { stockId } = useParams<{ stockId: string }>();
  const numericStockId = Number(stockId);
  const {
    data: stock,
    isLoading,
    isError,
  } = useStockDetail(Number.isNaN(numericStockId) ? -1 : numericStockId);
  const {
    sortKey: analystSortKey,
    direction: analystSortDirection,
    setSortKey: setAnalystSortKey,
    toggleDirection: toggleAnalystDirection,
    sortAnalysts,
  } = useAnalystSort('aimScore', 'desc');

  if (Number.isNaN(numericStockId)) {
    return <PageContainer>유효하지 않은 종목 ID입니다.</PageContainer>;
  }

  if (isLoading) {
    return <PageContainer>종목 정보를 불러오는 중입니다...</PageContainer>;
  }

  if (isError || !stock) {
    return <PageContainer>종목 정보를 불러오지 못했습니다.</PageContainer>;
  }

  const consensus = stock.consensus;
  const averageTargetPrice = consensus.average_target_price;
  const maxTargetPrice =
    consensus.max_target_price ?? consensus.average_target_price;
  const minTargetPrice =
    consensus.min_target_price ?? consensus.average_target_price;
  const buyCount = consensus.buy_count ?? 0;
  const holdCount = consensus.hold_count ?? 0;
  const sellCount = consensus.sell_count ?? 0;
  const totalOpinions = buyCount + holdCount + sellCount;

  const coveringAnalysts: StockAnalyst[] = [
    {
      id: '1',
      name: '김애널리스트',
      firm: '삼성증권',
      sectors: ['IT/전자', '반도체'],
      metrics: {
        accuracy: 85.5,
        avgReturn: 12.3,
        targetError: 5.2,
        compositeScore: 92,
      },
    },
    {
      id: '2',
      name: '이애널리스트',
      firm: 'KB증권',
      sectors: ['IT/전자', '디스플레이'],
      metrics: {
        accuracy: 82.1,
        avgReturn: 10.8,
        targetError: 6.5,
        compositeScore: 88,
      },
    },
  ];

  const sortedCoveringAnalysts = sortAnalysts(coveringAnalysts);

  return (
    <PageContainer>
      <Section>
        <StockHeader
          name={stock.stock_name}
          ticker={stock.stock_code}
          sector={stock.sector}
        />
      </Section>

      <Section>
        <SectionTitle>종합 의견 요약</SectionTitle>
        <OpinionSummary>
          <OpinionBox>
            <OpinionLabel>매수</OpinionLabel>
            <OpinionValue>
              {formatOpinionPercent(buyCount, totalOpinions)}
            </OpinionValue>
          </OpinionBox>
          <OpinionBox>
            <OpinionLabel>보유</OpinionLabel>
            <OpinionValue>
              {formatOpinionPercent(holdCount, totalOpinions)}
            </OpinionValue>
          </OpinionBox>
          <OpinionBox>
            <OpinionLabel>매도</OpinionLabel>
            <OpinionValue>
              {formatOpinionPercent(sellCount, totalOpinions)}
            </OpinionValue>
          </OpinionBox>
        </OpinionSummary>
      </Section>

      <Section>
        <SectionTitle>목표가 요약</SectionTitle>
        <TargetPriceGrid>
          <TargetPriceItem>
            <TargetPriceLabel>평균 목표가</TargetPriceLabel>
            <TargetPriceValue>
              {formatCurrency(averageTargetPrice)}
            </TargetPriceValue>
          </TargetPriceItem>
          <TargetPriceItem>
            <TargetPriceLabel>최고 목표가</TargetPriceLabel>
            <TargetPriceValue>
              {formatCurrency(maxTargetPrice)}
            </TargetPriceValue>
          </TargetPriceItem>
          <TargetPriceItem>
            <TargetPriceLabel>최저 목표가</TargetPriceLabel>
            <TargetPriceValue>
              {formatCurrency(minTargetPrice)}
            </TargetPriceValue>
          </TargetPriceItem>
        </TargetPriceGrid>
        <UpsidePotential>
          <UpsideText>
            상승 여력: {consensus.upside_potential.toFixed(2)}%
          </UpsideText>
        </UpsidePotential>
      </Section>

      <Section>
        <SectionTitle>지난 가격 및 12개월 전망</SectionTitle>
        <ChartPlaceholder>차트 영역 (Recharts로 교체 예정)</ChartPlaceholder>
      </Section>

      <Section>
        <SectionTitle>이 종목을 커버하는 애널리스트</SectionTitle>
        <AnalystListHeader>
          <AnalystSortControl
            sortKey={analystSortKey}
            direction={analystSortDirection}
            onChangeKey={setAnalystSortKey}
            onToggleDirection={toggleAnalystDirection}
          />
        </AnalystListHeader>
        <AnalystList>
          {sortedCoveringAnalysts.map((analyst) => (
            <AnalystCard
              key={analyst.id}
              name={analyst.name}
              firm={analyst.firm}
              sectors={analyst.sectors}
              accuracy={analyst.metrics.accuracy}
              avgReturn={analyst.metrics.avgReturn}
              targetError={analyst.metrics.targetError}
              compositeScore={analyst.metrics.compositeScore}
            />
          ))}
        </AnalystList>
      </Section>
    </PageContainer>
  );
};

