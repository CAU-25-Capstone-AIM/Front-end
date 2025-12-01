import styled from 'styled-components';
import type {
  AnalystSortKey,
  SortDirection,
} from '../../hooks/useAnalystSort';

type AnalystSortControlProps = {
  sortKey: AnalystSortKey;
  direction: SortDirection;
  onChangeKey: (key: AnalystSortKey) => void;
  onToggleDirection: () => void;
};

const SORT_OPTIONS: { label: string; key: AnalystSortKey }[] = [
  { label: "AIM's Score", key: 'aimScore' },
  { label: '정답률', key: 'accuracy' },
  { label: '수익률', key: 'returnRate' },
  { label: '목표가 오차율', key: 'targetError' },
];

export const AnalystSortControl: React.FC<AnalystSortControlProps> = ({
  sortKey,
  direction,
  onChangeKey,
  onToggleDirection,
}) => {
  return (
    <Wrapper>
      <OptionsGroup>
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
      </OptionsGroup>
      <DirectionButton type="button" onClick={onToggleDirection}>
        {direction === 'asc' ? '오름차순 ↑' : '내림차순 ↓'}
      </DirectionButton>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
`;

const OptionsGroup = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const SortButton = styled.button<{ $active: boolean }>`
  padding: 8px 16px;
  border: 1px solid ${({ $active }) => ($active ? '#1d4ed8' : '#e2e8f0')};
  border-radius: 4px;
  background-color: ${({ $active }) => ($active ? '#1d4ed8' : '#ffffff')};
  color: ${({ $active }) => ($active ? '#ffffff' : '#1f2937')};
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s, border-color 0.2s;

  &:hover {
    border-color: #1d4ed8;
    background-color: ${({ $active }) => ($active ? '#1e40af' : '#eef2ff')};
  }
`;

const DirectionButton = styled.button`
  padding: 8px 14px;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  background-color: #ffffff;
  color: #1f2937;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s, border-color 0.2s;

  &:hover {
    border-color: #1d4ed8;
    background-color: #eef2ff;
  }
`;


