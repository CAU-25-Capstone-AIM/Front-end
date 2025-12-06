import React from 'react';
import styled from 'styled-components';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  type TooltipProps,
} from 'recharts';

export type SectorConsensusBreakdown = {
  strongBuy: number;
  moderateBuy: number;
  hold: number;
  moderateSell: number;
  strongSell: number;
};

export type SectorRankingCardProps = {
  name: string; // 섹터 이름 (예: "Technology")
  totalStocks: number; // 섹터 내 종목 수 (예: 505)
  ratings: SectorConsensusBreakdown;
  buyRatio: number; // 매수율 (%) = (strongBuy + moderateBuy) / totalStocks * 100
  rank: number; // 랭킹 (1, 2, 3...)
  onClickDetail?: () => void;
};

export const SectorRankingCard: React.FC<SectorRankingCardProps> = ({
  name,
  totalStocks,
  ratings,
  buyRatio,
  rank,
  onClickDetail,
}) => {
  const { strongBuy, moderateBuy, hold, moderateSell, strongSell } = ratings;

  const pctStrongBuy = (strongBuy / totalStocks) * 100;
  const pctModerateBuy = (moderateBuy / totalStocks) * 100;
  const pctHold = (hold / totalStocks) * 100;
  const pctModerateSell = (moderateSell / totalStocks) * 100;
  const pctStrongSell = (strongSell / totalStocks) * 100;

  const chartData = [
    {
      name: 'consensus',
      strongBuy: pctStrongBuy,
      moderateBuy: pctModerateBuy,
      hold: pctHold,
      moderateSell: pctModerateSell,
      strongSell: pctStrongSell,
    },
  ];

  const clickable = Boolean(onClickDetail);

  const handleClick = () => {
    onClickDetail?.();
  };

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
    <CardWrapper
      $clickable={clickable}
      onClick={clickable ? handleClick : undefined}
      role={clickable ? 'button' : undefined}
      tabIndex={clickable ? 0 : undefined}
      onKeyDown={clickable ? handleKeyDown : undefined}
    >
      <HeaderRow>
        <div>
          <Title>{name}</Title>
          <SubInfo>총 {totalStocks}개 종목 · 매수율 {buyRatio.toFixed(1)}%</SubInfo>
        </div>
        <RankBadge>#{rank}</RankBadge>
      </HeaderRow>
      <ChartContainer>
        <ResponsiveContainer width="100%" height={28}>
          <BarChart data={chartData} layout="vertical">
            <XAxis type="number" hide domain={[0, 100]} />
            <YAxis type="category" dataKey="name" hide />
            <Tooltip content={<CustomTooltip name={name} totalStocks={totalStocks} ratings={ratings} />} />
            <Bar dataKey="strongBuy" stackId="consensus" fill="#166534" />
            <Bar dataKey="moderateBuy" stackId="consensus" fill="#4ADE80" />
            <Bar dataKey="hold" stackId="consensus" fill="#9CA3AF" />
            <Bar dataKey="moderateSell" stackId="consensus" fill="#FB7185" />
            <Bar dataKey="strongSell" stackId="consensus" fill="#B91C1C" />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
      <LegendRow>
        <LegendItem>
          <LegendColorBox $color="#166534" />
          <LegendLabel>Strong Buy</LegendLabel>
        </LegendItem>
        <LegendItem>
          <LegendColorBox $color="#4ADE80" />
          <LegendLabel>Moderate Buy</LegendLabel>
        </LegendItem>
        <LegendItem>
          <LegendColorBox $color="#9CA3AF" />
          <LegendLabel>Hold</LegendLabel>
        </LegendItem>
        <LegendItem>
          <LegendColorBox $color="#FB7185" />
          <LegendLabel>Moderate Sell</LegendLabel>
        </LegendItem>
        <LegendItem>
          <LegendColorBox $color="#B91C1C" />
          <LegendLabel>Strong Sell</LegendLabel>
        </LegendItem>
      </LegendRow>
    </CardWrapper>
  );
};

type CustomTooltipProps = TooltipProps<number, string> & {
  name: string;
  totalStocks: number;
  ratings: SectorConsensusBreakdown;
};

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, name: sectorName, totalStocks, ratings }) => {
  if (!active) return null;

  const { strongBuy, moderateBuy, hold, moderateSell, strongSell } = ratings;

  return (
    <TooltipWrapper>
      <TooltipTitle>{sectorName}</TooltipTitle>
      <TooltipInfo>총 {totalStocks}개 종목</TooltipInfo>
      <TooltipDivider />
      <TooltipItem>
        <TooltipLabel>Strong Buy</TooltipLabel>
        <TooltipValue>{strongBuy}</TooltipValue>
      </TooltipItem>
      <TooltipItem>
        <TooltipLabel>Moderate Buy</TooltipLabel>
        <TooltipValue>{moderateBuy}</TooltipValue>
      </TooltipItem>
      <TooltipItem>
        <TooltipLabel>Hold</TooltipLabel>
        <TooltipValue>{hold}</TooltipValue>
      </TooltipItem>
      <TooltipItem>
        <TooltipLabel>Moderate Sell</TooltipLabel>
        <TooltipValue>{moderateSell}</TooltipValue>
      </TooltipItem>
      <TooltipItem>
        <TooltipLabel>Strong Sell</TooltipLabel>
        <TooltipValue>{strongSell}</TooltipValue>
      </TooltipItem>
    </TooltipWrapper>
  );
};

const CardWrapper = styled.div<{ $clickable: boolean }>`
  background: #ffffff;
  border-radius: 12px;
  padding: 16px 20px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  gap: 12px;
  position: relative;
  z-index: 0;
  cursor: ${({ $clickable }) => ($clickable ? 'pointer' : 'default')};
  transition: transform 0.15s ease, box-shadow 0.15s ease;

  &:hover {
    z-index: 10;
    transform: ${({ $clickable }) => ($clickable ? 'translateY(-2px)' : 'none')};
    box-shadow: ${({ $clickable }) =>
      $clickable ? '0 4px 12px rgba(0, 0, 0, 0.12)' : '0 2px 6px rgba(0, 0, 0, 0.06)'};
  }
`;

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const Title = styled.h3`
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  color: #111827;
`;

const SubInfo = styled.p`
  font-size: 13px;
  color: #6b7280;
  margin: 4px 0 0;
`;

const RankBadge = styled.span`
  padding: 4px 10px;
  font-size: 12px;
  background: #2563eb;
  color: #ffffff;
  border-radius: 999px;
  font-weight: 600;
`;

const ChartContainer = styled.div`
  width: 100%;
  height: 28px;
`;

const LegendRow = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  font-size: 11px;
  color: #6b7280;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

type LegendColorBoxProps = {
  $color: string;
};

const LegendColorBox = styled.div<LegendColorBoxProps>`
  width: 12px;
  height: 12px;
  background: ${({ $color }) => $color};
  border-radius: 2px;
`;

const LegendLabel = styled.span`
  font-size: 11px;
  color: #6b7280;
`;

const TooltipWrapper = styled.div`
  position: absolute;
  top: 36px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 999;
  background: #ffffff;
  padding: 12px 16px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  font-size: 12px;
  white-space: nowrap;
`;

const TooltipTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 4px;
`;

const TooltipInfo = styled.div`
  font-size: 12px;
  color: #6b7280;
  margin-bottom: 8px;
`;

const TooltipDivider = styled.div`
  height: 1px;
  background: #e5e7eb;
  margin: 8px 0;
`;

const TooltipItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
  gap: 16px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const TooltipLabel = styled.span`
  font-size: 12px;
  color: #6b7280;
`;

const TooltipValue = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: #111827;
`;

// <SectorRankingCard
//   name="Technology"
//   totalStocks={505}
//   buyRatio={72.5}
//   ratings={{
//     strongBuy: 101,
//     moderateBuy: 271,
//     hold: 119,
//     moderateSell: 13,
//     strongSell: 1,
//   }}
//   rank={1}
// />

