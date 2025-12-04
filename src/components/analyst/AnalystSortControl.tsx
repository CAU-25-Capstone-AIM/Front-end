import styled from 'styled-components';
import type { AnalystSortKey, SortDirection } from '../../hooks/useAnalystSort';

type AnalystSortControlProps = {
  sortKey: AnalystSortKey;
  direction: SortDirection;
  onChangeKey: (key: AnalystSortKey) => void;
  onToggleDirection: () => void;
  className?: string;
};

const SORT_OPTIONS: { key: AnalystSortKey; label: string }[] = [
  { key: 'aimScore', label: "AIM's Score" },
  { key: 'accuracy', label: '정답률' },
  { key: 'returnRate', label: '수익률' },
  { key: 'targetError', label: '목표가 오차율' },
];

export const AnalystSortControl = ({
  sortKey,
  direction,
  onChangeKey,
  onToggleDirection,
  className,
}: AnalystSortControlProps) => {
  return (
    <Container className={className}>
      <SortButtons>
        {SORT_OPTIONS.map((option) => (
          <SortButton
            key={option.key}
            type="button"
            $active={sortKey === option.key}
            onClick={() => onChangeKey(option.key)}
          >
            {option.label}
          </SortButton>
        ))}
      </SortButtons>
      <DirectionButton type="button" onClick={onToggleDirection}>
        {direction === 'desc' ? '↓ 내림차순' : '↑ 오름차순'}
      </DirectionButton>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  align-items: center;
`;

const SortButtons = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const SortButton = styled.button<{ $active: boolean }>`
  padding: 8px 14px;
  border-radius: 6px;
  border: 1px solid ${({ $active }) => ($active ? '#2563eb' : '#e5e7eb')};
  background-color: ${({ $active }) => ($active ? '#2563eb' : '#ffffff')};
  color: ${({ $active }) => ($active ? '#ffffff' : '#374151')};
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #2563eb;
    background-color: ${({ $active }) => ($active ? '#1d4ed8' : '#f0f6ff')};
  }
`;

const DirectionButton = styled.button`
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
  background-color: #ffffff;
  color: #374151;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #2563eb;
    color: #1f2937;
  }
`;


