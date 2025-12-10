import styled from 'styled-components';
import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { StockHeader } from '../components/stock/StockHeader';
import { AnalystCard } from '../components/analyst/AnalystCard';
import { AnalystSortControl } from '../components/analyst/AnalystSortControl';
import { PriceForecastChart } from '../components/charts/PriceForecastChart';
import { useAnalystSort } from '../hooks/useAnalystSort';
import { useStockDetail } from '../hooks/useStockDetail';
import { formatCurrency } from '../utils/format';

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

const SectionHeadingRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;
`;

const SectionHeading = styled(SectionTitle)`
  margin: 0;
`;

const OpinionSummary = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 16px;
`;

const OpinionBox = styled.div<{ $type: 'buy' | 'hold' | 'sell'; $isHighest: boolean }>`
  flex: 1;
  padding: 20px;
  background-color: ${({ $type, $isHighest }) => {
    if ($type === 'buy') {
      return $isHighest ? '#fecaca' : '#fee2e2'; // 진한 빨강 : 매우 연한 빨강
    }
    if ($type === 'hold') {
      return $isHighest ? '#fde68a' : '#fef3c7'; // 진한 노랑 : 매우 연한 노랑
    }
    if ($type === 'sell') {
      return $isHighest ? '#bfdbfe' : '#dbeafe'; // 진한 파랑 : 매우 연한 파랑
    }
    return '#f8f9fa';
  }};
  border-radius: 8px;
  text-align: center;
  transition: background-color 0.3s ease;
`;

const OpinionLabel = styled.div<{ $isHighest: boolean }>`
  font-size: 14px;
  color: ${({ $isHighest }) => ($isHighest ? '#1f2937' : '#666')};
  margin-bottom: 8px;
  font-weight: ${({ $isHighest }) => ($isHighest ? '600' : '400')};
`;

const OpinionValue = styled.div<{ $isHighest: boolean }>`
  font-size: 24px;
  font-weight: 700;
  color: ${({ $isHighest }) => ($isHighest ? '#111827' : '#333')};
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

const AnalystList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 16px;
`;

const StatusMessage = styled.div`
  padding: 24px;
  text-align: center;
  color: #666;
  border: 1px dashed #d0d7de;
  border-radius: 8px;
  background-color: #fafbfc;
`;

const formatOpinionPercent = (count: number, total: number) => {
  if (!total) {
    return '-';
  }
  const ratio = (count / total) * 100;
  return `${ratio.toFixed(1)}%`;
};

export const StockDetailPage = () => {
  const { stockId } = useParams<{ stockId: string }>();
  const navigate = useNavigate();
  const { sortKey, direction, setSortKey, toggleDirection, sortAnalysts } =
    useAnalystSort('aimScore', 'desc');
  const numericStockId = Number(stockId);
  const {
    data: stock,
    isLoading,
    isError,
  } = useStockDetail(Number.isNaN(numericStockId) ? -1 : numericStockId);

  const sortedAnalysts = useMemo(() => {
    if (!stock) {
      return [];
    }
    const coveringAnalysts = stock.covering_analysts ?? [];
    const normalized = coveringAnalysts.map((analyst) => ({
      id: analyst.analyst_id,
      name: analyst.analyst_name,
      firm: analyst.firm_name,
      sectors: [stock.sector],
      accuracy: analyst.accuracy_rate ?? 0,
      avgReturn: analyst.return_rate ?? 0,
      targetError: analyst.target_diff_rate ?? 0,
      compositeScore: analyst.aims_score ?? 0,
      rank: analyst.rank,
      metrics: {
        accuracy: analyst.accuracy_rate ?? 0,
        avgReturn: analyst.return_rate ?? 0,
        targetError: analyst.target_diff_rate ?? 0,
        compositeScore: analyst.aims_score ?? 0,
      },
      aimsScore: analyst.aims_score ?? 0,
      // stockDetail variant용 추가 필드
      latestOpinion: analyst.latest_opinion,
      hiddenOpinion: analyst.hidden_opinion,
      latestTargetPrice: analyst.latest_target_price,
      latestReportDate: analyst.latest_report_date,
    }));
    return sortAnalysts(normalized);
  }, [sortAnalysts, stock]);

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
  const targetStats = stock.target_price_stats;
  const aimsAverageTargetPrice = consensus.aims_average_target_price;
  const averageTargetPrice =
    targetStats?.average_target_price ?? consensus.average_target_price;
  const maxTargetPrice =
    targetStats?.max_target_price ?? consensus.average_target_price;
  const minTargetPrice =
    targetStats?.min_target_price ?? consensus.average_target_price;
  const buyCount = consensus.buy_count ?? 0;
  const holdCount = consensus.hold_count ?? 0;
  const sellCount = consensus.sell_count ?? 0;
  const totalOpinions = buyCount + holdCount + sellCount;

  // 가장 높은 비중을 가진 의견 찾기
  const maxCount = Math.max(buyCount, holdCount, sellCount);
  const highestOpinion =
    maxCount === buyCount ? 'buy' : maxCount === holdCount ? 'hold' : 'sell';

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
        <SectionTitle>AIM's 종합 의견 요약</SectionTitle>
        <OpinionSummary>
          <OpinionBox $type="buy" $isHighest={highestOpinion === 'buy'}>
            <OpinionLabel $isHighest={highestOpinion === 'buy'}>매수</OpinionLabel>
            <OpinionValue $isHighest={highestOpinion === 'buy'}>
              {formatOpinionPercent(buyCount, totalOpinions)}
            </OpinionValue>
          </OpinionBox>
          <OpinionBox $type="hold" $isHighest={highestOpinion === 'hold'}>
            <OpinionLabel $isHighest={highestOpinion === 'hold'}>보유</OpinionLabel>
            <OpinionValue $isHighest={highestOpinion === 'hold'}>
              {formatOpinionPercent(holdCount, totalOpinions)}
            </OpinionValue>
          </OpinionBox>
          <OpinionBox $type="sell" $isHighest={highestOpinion === 'sell'}>
            <OpinionLabel $isHighest={highestOpinion === 'sell'}>매도</OpinionLabel>
            <OpinionValue $isHighest={highestOpinion === 'sell'}>
              {formatOpinionPercent(sellCount, totalOpinions)}
            </OpinionValue>
          </OpinionBox>
        </OpinionSummary>
      </Section>

      <Section>
        <SectionTitle>목표가 요약</SectionTitle>
        <TargetPriceGrid>
          <TargetPriceItem>
            <TargetPriceLabel>AIM's 목표가</TargetPriceLabel>
            <TargetPriceValue>
              {formatCurrency(aimsAverageTargetPrice)}
            </TargetPriceValue>
          </TargetPriceItem>
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
            AIM's 상승 여력: {consensus.upside_potential.toFixed(2)}%
          </UpsideText>
        </UpsidePotential>
      </Section>

      <Section>
        <SectionTitle>지난 가격 및 12개월 전망</SectionTitle>
        <PriceForecastChart
          closePriceTrend={stock.close_price_trend}
          dailyAverageTargetPrices={stock.daily_average_target_prices}
          targetPriceStats={stock.target_price_stats}
        />
      </Section>

      <Section>
        <SectionHeadingRow>
          <SectionHeading>이 종목을 커버하는 애널리스트</SectionHeading>
          <AnalystSortControl
            sortKey={sortKey}
            direction={direction}
            onChangeKey={setSortKey}
            onToggleDirection={toggleDirection}
          />
        </SectionHeadingRow>
        {sortedAnalysts.length === 0 ? (
          <StatusMessage>커버하는 애널리스트 정보가 없습니다.</StatusMessage>
        ) : (
          <AnalystList>
            {sortedAnalysts.map((analyst) => (
              <AnalystCard
                key={analyst.id}
                name={analyst.name}
                firm={analyst.firm}
                rank={analyst.rank}
                sectors={analyst.sectors}
                compositeScore={analyst.compositeScore}
                variant="stockDetail"
                latestOpinion={analyst.latestOpinion}
                hiddenOpinion={analyst.hiddenOpinion}
                latestTargetPrice={analyst.latestTargetPrice}
                latestReportDate={analyst.latestReportDate}
                onClickDetail={() => navigate(`/analysts/${analyst.id}`)}
              />
            ))}
          </AnalystList>
        )}
      </Section>
    </PageContainer>
  );
};

