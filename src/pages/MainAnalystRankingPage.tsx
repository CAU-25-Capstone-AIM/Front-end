import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnalystCard } from '../components/analyst/AnalystCard';
import { Pagination } from '../components/common/Pagination';
import { getAnalystRankings } from '../api/analystApi';
import type { AnalystRankingEntry } from '../models/analyst';
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

const HeaderSection = styled.section`
  padding: 32px 24px;
  background-color: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
`;

const ServiceName = styled.h1`
  margin: 0 0 8px 0;
  font-size: 32px;
  font-weight: 700;
  color: #333;
`;

const ServiceDescription = styled.p`
  margin: 0;
  font-size: 16px;
  color: #666;
`;

const SortBar = styled.section`
  padding: 16px 24px;
  background-color: #ffffff;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
`;

const RankingSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const SectionTitle = styled.h2`
  margin: 0 0 16px 0;
  font-size: 20px;
  font-weight: 600;
  color: #333;
`;

const StatusMessage = styled.div`
  padding: 24px;
  text-align: center;
  color: #666;
  border: 1px dashed #d0d7de;
  border-radius: 8px;
  background-color: #fafbfc;
`;

const PAGE_SIZE = 10;

export const MainAnalystRankingPage = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [analysts, setAnalysts] = useState<AnalystRankingEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { sortKey, direction, setSortKey, toggleDirection, sortAnalysts } =
    useAnalystSort('accuracy', 'desc');

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await getAnalystRankings('accuracyRate');

        if (isMounted) {
          setAnalysts(data);
        }
      } catch (e) {
        console.error(e);
        if (isMounted) {
          setError('애널리스트 랭킹을 불러오는 데 실패했습니다.');
          setAnalysts([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  // 페이지네이션 계산
  const sortedAnalysts = sortAnalysts(analysts);
  const totalPages =
    sortedAnalysts.length > 0 ? Math.ceil(sortedAnalysts.length / PAGE_SIZE) : 0;
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  const currentPageAnalysts = sortedAnalysts.slice(startIndex, endIndex);

  return (
    <PageContainer>
      <HeaderSection>
        <ServiceName>애널리스트 리포트</ServiceName>
        <ServiceDescription>
          증권사 애널리스트의 리포트를 기반으로 한 투자 인사이트 플랫폼
        </ServiceDescription>
      </HeaderSection>

      <SortBar>
        <AnalystSortControl
          sortKey={sortKey}
          direction={direction}
          onChangeKey={(key) => {
            setSortKey(key);
            setCurrentPage(1);
          }}
          onToggleDirection={() => {
            toggleDirection();
            setCurrentPage(1);
          }}
        />
      </SortBar>

      <RankingSection>
        <SectionTitle>애널리스트 랭킹</SectionTitle>
        {loading && (
          <StatusMessage>애널리스트 랭킹을 불러오는 중입니다...</StatusMessage>
        )}
        {!loading && error && <StatusMessage>{error}</StatusMessage>}
        {!loading && !error && currentPageAnalysts.length === 0 && (
          <StatusMessage>표시할 랭킹 데이터가 없습니다.</StatusMessage>
        )}
        {!loading &&
          !error &&
          currentPageAnalysts.map((analyst) => (
            <AnalystCard
              key={analyst.id}
              name={analyst.name}
              firm={analyst.firm}
              rank={analyst.rank}
              sectors={analyst.sectors}
              accuracy={analyst.metrics.accuracy}
              avgReturn={analyst.metrics.avgReturn}
              targetError={analyst.metrics.targetError}
              compositeScore={analyst.metrics.compositeScore}
              onClickDetail={() => navigate(`/analysts/${analyst.id}`)}
            />
          ))}
        {!loading && !error && totalPages > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </RankingSection>
    </PageContainer>
  );
};

