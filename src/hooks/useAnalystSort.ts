import { useCallback, useState } from 'react';

export type AnalystSortKey =
  | 'aimScore'
  | 'accuracy'
  | 'returnRate'
  | 'targetError';

export type SortDirection = 'asc' | 'desc';

type SortableMetrics = {
  compositeScore?: number;
  accuracy?: number;
  avgReturn?: number;
  returnRate?: number;
  targetError?: number;
};

export type SortableAnalyst = {
  metrics?: SortableMetrics;
  compositeScore?: number;
  accuracy?: number;
  avgReturn?: number;
  returnRate?: number;
  targetError?: number;
  aimsScore?: number;
};

const getValueByKey = (item: SortableAnalyst, key: AnalystSortKey): number | undefined => {
  const metrics = item.metrics ?? {};
  switch (key) {
    case 'aimScore':
      return (
        metrics.compositeScore ??
        item.compositeScore ??
        item.aimsScore
      );
    case 'accuracy':
      return metrics.accuracy ?? item.accuracy;
    case 'returnRate':
      return (
        metrics.avgReturn ??
        metrics.returnRate ??
        item.avgReturn ??
        item.returnRate
      );
    case 'targetError':
      return metrics.targetError ?? item.targetError;
    default:
      return undefined;
  }
};

export function useAnalystSort(
  initialKey: AnalystSortKey = 'aimScore',
  initialDirection: SortDirection = 'desc',
) {
  const [sortKey, setSortKey] = useState<AnalystSortKey>(initialKey);
  const [direction, setDirection] = useState<SortDirection>(initialDirection);

  const toggleDirection = useCallback(() => {
    setDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
  }, []);

  const selectSortKey = useCallback((key: AnalystSortKey) => {
    setSortKey(key);
  }, []);

  const sortAnalysts = useCallback(
    <T extends SortableAnalyst>(items: T[]): T[] => {
      const sorted = [...items];
      sorted.sort((a, b) => {
        const aValue = getValueByKey(a, sortKey);
        const bValue = getValueByKey(b, sortKey);

        const resolvedA =
          typeof aValue === 'number'
            ? aValue
            : direction === 'asc'
              ? Number.POSITIVE_INFINITY
              : Number.NEGATIVE_INFINITY;
        const resolvedB =
          typeof bValue === 'number'
            ? bValue
            : direction === 'asc'
              ? Number.POSITIVE_INFINITY
              : Number.NEGATIVE_INFINITY;

        if (resolvedA === resolvedB) {
          return 0;
        }
        return direction === 'asc'
          ? resolvedA - resolvedB
          : resolvedB - resolvedA;
      });
      return sorted;
    },
    [direction, sortKey],
  );

  return {
    sortKey,
    direction,
    setSortKey: selectSortKey,
    toggleDirection,
    sortAnalysts,
  };
}


