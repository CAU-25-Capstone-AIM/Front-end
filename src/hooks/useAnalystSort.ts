import { useCallback, useState } from 'react';

export type AnalystSortKey =
  | 'aimScore'
  | 'accuracy'
  | 'returnRate'
  | 'targetError'
  | 'recentReportDate'
  | 'targetPrice';

export type SortDirection = 'asc' | 'desc';

type NumericLike = number | undefined;

export type AnalystSortable = {
  metrics?: {
    compositeScore?: number;
    aimsScore?: number;
    accuracy?: number;
    accuracyRate?: number;
    avgReturn?: number;
    returnRate?: number;
    targetError?: number;
    targetDiffRate?: number;
  };
  compositeScore?: number;
  aimsScore?: number;
  accuracy?: number;
  accuracyRate?: number;
  avgReturn?: number;
  returnRate?: number;
  targetError?: number;
  targetDiffRate?: number;
  lastReportDate?: string;
  recentReportDate?: string;
  latestTargetPrice?: number;
  targetPrice?: number;
};

const toTimestamp = (value?: string): NumericLike => {
  if (!value) return undefined;
  const time = Date.parse(value);
  return Number.isNaN(time) ? undefined : time;
};

const getMetricValue = (
  item: AnalystSortable,
  key: AnalystSortKey,
): NumericLike => {
  switch (key) {
    case 'aimScore':
      return (
        item.compositeScore ??
        item.aimsScore ??
        item.metrics?.compositeScore ??
        item.metrics?.aimsScore
      );
    case 'accuracy':
      return (
        item.accuracy ??
        item.accuracyRate ??
        item.metrics?.accuracy ??
        item.metrics?.accuracyRate
      );
    case 'returnRate':
      return (
        item.returnRate ??
        item.avgReturn ??
        item.metrics?.returnRate ??
        item.metrics?.avgReturn
      );
    case 'targetError':
      return (
        item.targetError ??
        item.targetDiffRate ??
        item.metrics?.targetError ??
        item.metrics?.targetDiffRate
      );
    case 'recentReportDate':
      return toTimestamp(item.recentReportDate ?? item.lastReportDate);
    case 'targetPrice':
      return item.latestTargetPrice ?? item.targetPrice;
    default:
      return undefined;
  }
};

const compareNumbers = (a: NumericLike, b: NumericLike) => {
  if (a === undefined && b === undefined) return 0;
  if (a === undefined) return 1;
  if (b === undefined) return -1;
  if (a === b) return 0;
  return a < b ? -1 : 1;
};

export function useAnalystSort(
  initialKey: AnalystSortKey = 'aimScore',
  initialDirection: SortDirection = 'desc',
) {
  const [sortKey, setSortKeyState] = useState<AnalystSortKey>(initialKey);
  const [direction, setDirection] = useState<SortDirection>(initialDirection);

  const setSortKey = useCallback((nextKey: AnalystSortKey) => {
    setSortKeyState((prev) => {
      if (prev === nextKey) {
        return prev;
      }
      setDirection('desc');
      return nextKey;
    });
  }, []);

  const toggleDirection = useCallback(() => {
    setDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
  }, []);

  const sortAnalysts = useCallback(
    <T extends AnalystSortable>(items: T[]): T[] => {
      const copy = [...items];
      copy.sort((a, b) => {
        const valueA = getMetricValue(a, sortKey);
        const valueB = getMetricValue(b, sortKey);
        const comparison = compareNumbers(valueA, valueB);
        return direction === 'asc' ? comparison : -comparison;
      });
      return copy;
    },
    [sortKey, direction],
  );

  return {
    sortKey,
    direction,
    setSortKey,
    toggleDirection,
    sortAnalysts,
  };
}


