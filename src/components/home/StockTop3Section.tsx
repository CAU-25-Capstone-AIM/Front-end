import React from 'react';
import styled from 'styled-components';
import { mockStockRankings } from '../../mocks/stockRankings';
import { StockMiniCard } from '../stock/StockMiniCard';

export type StockRankingEntry = (typeof mockStockRankings)[number];

export type StockTop3SectionProps = {
  stocks: StockRankingEntry[];
  onClickStockDetail?: (ticker: string) => void;
  onClickSeeAll?: () => void;
};

export const StockTop3Section: React.FC<StockTop3SectionProps> = ({
  stocks,
  onClickStockDetail,
  onClickSeeAll,
}) => {
  return (
    <SectionWrapper>
      <SectionHeader>
        <SectionTitle>상승 여력 TOP 종목</SectionTitle>
        <SectionSubtitle>
          여러 애널리스트 리포트를 종합해 기대 수익률이 높은 종목을 보여줍니다.
        </SectionSubtitle>
        <SectionAction
          type="button"
          onClick={() => {
            if (onClickSeeAll) {
              onClickSeeAll();
            }
          }}
        >
          종목 랭킹 전체 보기 →
        </SectionAction>
      </SectionHeader>
      <CardsRow>
        {stocks.map((stock, index) => (
          <StockMiniCard
            key={stock.ticker}
            rank={index + 1}
            name={stock.name}
            ticker={stock.ticker}
            sector={stock.sector}
            upside={stock.upside}
            buyRatio={stock.buyRatio}
            onClickDetail={() => {
              if (onClickStockDetail) {
                onClickStockDetail(stock.ticker);
              }
            }}
          />
        ))}
      </CardsRow>
    </SectionWrapper>
  );
};

const SectionWrapper = styled.section`
  margin-top: 32px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const SectionHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const SectionTitle = styled.h3`
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  color: #111827;
`;

const SectionSubtitle = styled.p`
  margin: 0;
  font-size: 13px;
  color: #6b7280;
`;

const SectionAction = styled.button`
  align-self: flex-end;
  margin-top: 4px;
  font-size: 12px;
  color: #2563eb;
  background: transparent;
  border: none;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

const CardsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
  margin-top: 8px;
`;

export default StockTop3Section;

