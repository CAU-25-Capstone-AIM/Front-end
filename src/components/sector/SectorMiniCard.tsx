import React from 'react';
import styled from 'styled-components';

export type SectorMiniCardProps = {
  rank: number;
  name: string;
  buyRatio: number;
  onClickDetail?: () => void;
};

export const SectorMiniCard: React.FC<SectorMiniCardProps> = ({ rank, name, buyRatio, onClickDetail }) => {
  return (
    <CardWrapper type="button" onClick={onClickDetail}>
      <HeaderRow>
        <RankBadge>#{rank}</RankBadge>
        <NameText>{name}</NameText>
      </HeaderRow>
      <BuyRatioText>
        매수 의견 비율 <strong>{buyRatio.toFixed(1)}%</strong>
      </BuyRatioText>
    </CardWrapper>
  );
};

const CardWrapper = styled.button`
  width: 100%;
  border: none;
  background: #ffffff;
  border-radius: 12px;
  padding: 16px 18px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  gap: 8px;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
  text-align: left;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
  }
`;

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const RankBadge = styled.span`
  padding: 4px 10px;
  border-radius: 999px;
  background: #7c3aed;
  color: #ffffff;
  font-size: 12px;
  font-weight: 600;
`;

const NameText = styled.span`
  font-size: 15px;
  font-weight: 600;
  color: #111827;
  text-align: right;
`;

const BuyRatioText = styled.span`
  font-size: 13px;
  color: #4b5563;

  strong {
    margin-left: 4px;
    color: #111827;
    font-weight: 600;
  }
`;

export default SectorMiniCard;

