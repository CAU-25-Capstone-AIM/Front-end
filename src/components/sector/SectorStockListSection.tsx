import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import type { StockRankingEntry } from '../../models/stock';
import { StockRankingCard } from '../stock/StockRankingCard';

type StockSortType = 'upsideHigh' | 'upsideLow' | 'buyHigh' | 'buyLow';

type SectorStockListSectionProps = {
  stocks: StockRankingEntry[];
};

export const SectorStockListSection: React.FC<SectorStockListSectionProps> = ({ stocks }) => {
  const [sortType, setSortType] = useState<StockSortType>('upsideHigh');

  const sortedStocks = useMemo(() => {
    return [...stocks].sort((a, b) => {
      switch (sortType) {
        case 'upsideHigh':
          return b.upside - a.upside;
        case 'upsideLow':
          return a.upside - b.upside;
        case 'buyHigh':
          return b.buyRatio - a.buyRatio;
        case 'buyLow':
          return a.buyRatio - b.buyRatio;
        default:
          return 0;
      }
    });
  }, [stocks, sortType]);

  return (
    <Container>
      <SortBar>
        <SortButton type="button" $active={sortType === 'upsideHigh'} onClick={() => setSortType('upsideHigh')}>
          상승 여력 높은 순
        </SortButton>
        <SortButton type="button" $active={sortType === 'upsideLow'} onClick={() => setSortType('upsideLow')}>
          상승 여력 낮은 순
        </SortButton>
        <SortButton type="button" $active={sortType === 'buyHigh'} onClick={() => setSortType('buyHigh')}>
          매수 비율 높은 순
        </SortButton>
        <SortButton type="button" $active={sortType === 'buyLow'} onClick={() => setSortType('buyLow')}>
          매수 비율 낮은 순
        </SortButton>
      </SortBar>

      <CardList>
        {sortedStocks.map((stock, index) => (
          <StockRankingCard
            key={stock.ticker}
            name={stock.name}
            ticker={stock.ticker}
            sector={stock.sector}
            upside={stock.upside}
            buyRatio={stock.buyRatio}
            rank={index + 1}
          />
        ))}
      </CardList>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const SortBar = styled.div`
  padding: 12px 16px;
  border-radius: 12px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`;

const SortButton = styled.button<{ $active: boolean }>`
  padding: 8px 16px;
  border: 1px solid ${({ $active }) => ($active ? '#2563eb' : '#e0e0e0')};
  border-radius: 4px;
  background-color: ${({ $active }) => ($active ? '#2563eb' : '#ffffff')};
  color: ${({ $active }) => ($active ? '#ffffff' : '#333')};
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #2563eb;
    background-color: ${({ $active }) => ($active ? '#1d4ed8' : '#f0f8ff')};
  }
`;

const CardList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

