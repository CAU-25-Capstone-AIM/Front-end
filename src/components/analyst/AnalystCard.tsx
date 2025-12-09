import React from 'react';
import styled from 'styled-components';
import { formatCurrency, formatDate } from '../../utils/format';

type AnalystCardVariant = 'default' | 'stockDetail';

type AnalystCardProps = {
  name: string;
  firm: string;
  rank?: number;
  sectors: string[];
  accuracy?: number;
  avgReturn?: number;
  targetError?: number;
  compositeScore?: number;
  onClickDetail?: () => void;
  variant?: AnalystCardVariant;
  // stockDetail variant 전용 필드
  latestOpinion?: string | null;
  hiddenOpinion?: string | null;
  latestTargetPrice?: number | null;
  latestReportDate?: string | null;
};

const Container = styled.div<{ $clickable: boolean }>`
  padding: 20px;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  margin-bottom: 16px;
  cursor: ${({ $clickable }) => ($clickable ? 'pointer' : 'default')};
  transition: box-shadow 0.2s;

  &:hover {
    box-shadow: ${({ $clickable }) =>
      $clickable ? '0 4px 12px rgba(0, 0, 0, 0.12)' : '0 2px 6px rgba(0, 0, 0, 0.08)'};
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
`;

const NameSection = styled.div`
  flex: 1;
`;

const Name = styled.h3`
  margin: 0 0 4px 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
`;

const Firm = styled.p`
  margin: 0;
  font-size: 14px;
  color: #666;
`;

const TagContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 10px;
`;

const Tag = styled.span`
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 12px;
  background-color: #f1f5f9;
  color: #475569;
  font-weight: 500;
`;

const RankBadge = styled.div`
  padding: 4px 12px;
  background-color: #2563eb;
  border-radius: 16px;
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
`;

const RankWithStars = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 12px;
  background-color: #2563eb;
  border-radius: 16px;
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
`;

const StarIcon = styled.span`
  color: #fbbf24;
  font-size: 14px;
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 16px;
`;

const MetricItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const MetricLabel = styled.span`
  font-size: 12px;
  color: #888;
`;

const MetricValue = styled.span`
  font-size: 16px;
  font-weight: 600;
  color: #333;
`;

const ScoreSection = styled.div`
  padding-top: 16px;
  border-top: 1px solid #e0e0e0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ScoreLabel = styled.span`
  font-size: 14px;
  color: #666;
`;

const ScoreValue = styled.span`
  font-size: 20px;
  font-weight: 700;
  color: #333;
`;

// 기본 메트릭 (정답률, 평균 수익률, 목표가 오차율)
const MetricsDefault: React.FC<{
  accuracy?: number | null;
  avgReturn?: number | null;
  targetError?: number | null;
}> = ({ accuracy, avgReturn, targetError }) => (
  <MetricsGrid>
    <MetricItem>
      <MetricLabel>정답률</MetricLabel>
      <MetricValue>{accuracy != null ? `${accuracy}%` : '-'}</MetricValue>
    </MetricItem>
    <MetricItem>
      <MetricLabel>평균 수익률</MetricLabel>
      <MetricValue>{avgReturn != null ? `${avgReturn}%` : '-'}</MetricValue>
    </MetricItem>
    <MetricItem>
      <MetricLabel>목표가 오차율</MetricLabel>
      <MetricValue>{targetError != null ? `${targetError}%` : '-'}</MetricValue>
    </MetricItem>
  </MetricsGrid>
);

// 종목 상세 페이지용 메트릭 (AIM's Score, 최신 의견, 최신 목표가, 최신 리포트)
const MetricsStockDetail: React.FC<{
  latestOpinion?: string | null;
  hiddenOpinion?: string | null;
  latestTargetPrice?: number | null;
  latestReportDate?: string | null;
  compositeScore?: number;
}> = ({ latestOpinion, hiddenOpinion, latestTargetPrice, latestReportDate, compositeScore }) => {
  // latest_opinion / hidden_opinion 형식으로 표시
  let opinionDisplay: React.ReactNode = '-';

  if (latestOpinion && hiddenOpinion) {
    // 예시: "BUY / 매수" 형태
    opinionDisplay = (
      <>
        {latestOpinion} / <span style={{ color: '#2563eb' }}>{hiddenOpinion}</span>
      </>
    );
  } else if (hiddenOpinion) {
    opinionDisplay = hiddenOpinion;
  } else if (latestOpinion) {
    opinionDisplay = latestOpinion;
  }

  return (
    <>
      <MetricsGrid>
        <MetricItem>
          <MetricLabel>
            <span style={{ fontWeight: 700, color: '#2563eb' }}>AIM&apos;s Score</span>
          </MetricLabel>
          <MetricValue style={{ color: '#2563eb', fontSize: '18px' }}>
            {compositeScore ?? '-'}
          </MetricValue>
        </MetricItem>
        <MetricItem>
          <MetricLabel>
            <span style={{ fontWeight: 400, color: '#666' }}>최신 의견/</span>
            <span style={{ fontWeight: 700, color: '#2563eb' }}>AIM&apos;s opinion</span>
          </MetricLabel>
          <MetricValue>{opinionDisplay}</MetricValue>
        </MetricItem>
        <MetricItem>
          <MetricLabel>최신 목표가</MetricLabel>
          <MetricValue>{formatCurrency(latestTargetPrice)}</MetricValue>
        </MetricItem>
      </MetricsGrid>
      <MetricsGrid style={{ marginTop: '12px' }}>
        <MetricItem>
          <MetricLabel>최신 리포트</MetricLabel>
          <MetricValue>{formatDate(latestReportDate)}</MetricValue>
        </MetricItem>
      </MetricsGrid>
    </>
  );
};

export const AnalystCard: React.FC<AnalystCardProps> = ({
  name,
  firm,
  rank,
  sectors,
  accuracy,
  avgReturn,
  targetError,
  compositeScore,
  onClickDetail,
  variant = 'default',
  latestOpinion,
  hiddenOpinion,
  latestTargetPrice,
  latestReportDate,
}) => {
  const clickable = Boolean(onClickDetail);
  const isStockDetail = variant === 'stockDetail';

  // 등수에 따른 별 개수 계산
  const getStarCount = (rankValue: number): number => {
    if (rankValue >= 1 && rankValue <= 20) return 3;
    if (rankValue >= 21 && rankValue <= 60) return 2;
    if (rankValue >= 61 && rankValue <= 100) return 1;
    return 0;
  };

  const starCount = rank ? getStarCount(rank) : 0;

  const handleKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (event) => {
    if (!clickable) {
      return;
    }
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onClickDetail?.();
    }
  };

  return (
    <Container
      $clickable={clickable}
      onClick={clickable ? onClickDetail : undefined}
      role={clickable ? 'button' : undefined}
      tabIndex={clickable ? 0 : undefined}
      onKeyDown={clickable ? handleKeyDown : undefined}
    >
      <Header>
        <NameSection>
          <Name>{name}</Name>
          <Firm>{firm}</Firm>
          {sectors.length > 0 && (
            <TagContainer>
              {sectors.map((sector, index) => (
                <Tag key={index}>{sector}</Tag>
              ))}
            </TagContainer>
          )}
        </NameSection>
        {rank && starCount > 0 ? (
          <RankWithStars>
            #{rank}
            {Array.from({ length: starCount }).map((_, i) => (
              <StarIcon key={i}>★</StarIcon>
            ))}
          </RankWithStars>
        ) : rank ? (
          <RankBadge>#{rank}</RankBadge>
        ) : null}
      </Header>
      {isStockDetail ? (
        <MetricsStockDetail
          latestOpinion={latestOpinion}
          hiddenOpinion={hiddenOpinion}
          latestTargetPrice={latestTargetPrice}
          latestReportDate={latestReportDate}
          compositeScore={compositeScore}
        />
      ) : (
        <>
          <MetricsDefault
            accuracy={accuracy}
            avgReturn={avgReturn}
            targetError={targetError}
          />
          {compositeScore !== undefined && (
            <ScoreSection>
              <ScoreLabel>AIM's Score</ScoreLabel>
              <ScoreValue>{compositeScore}</ScoreValue>
            </ScoreSection>
          )}
        </>
      )}
    </Container>
  );
};

/*
// Mock 테스트 예시:
<AnalystCard
  name="김애널리스트"
  firm="삼성증권"
  rank={1}
  sectors={['IT/전자', '반도체']}
  accuracy={85.5}
  avgReturn={12.3}
  targetError={5.2}
  compositeScore={92}
  onClick={() => console.log('클릭됨')}
/>
*/

