import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { MetricCard } from '../components/analyst/MetricCard';
import { getAnalystDetail } from '../api/analystApi';
import type { AnalystDetail } from '../models/analyst';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

const PageContainer = styled.div`
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  max-width: 1200px;
  margin: 0 auto;
`;

const StatusMessage = styled.p`
  margin: 0;
  padding: 80px 24px;
  text-align: center;
  font-size: 16px;
  color: #555;
  background-color: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
`;

const Section = styled.section`
  padding: 24px;
  background-color: #ffffff;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
`;

const SectionTitle = styled.h2`
  margin: 0 0 16px 0;
  font-size: 20px;
  font-weight: 600;
  color: #333;
`;

const HeaderWrapper = styled.div`
  padding: 24px;
  background-color: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
`;

const AnalystName = styled.h2`
  margin: 0 0 8px 0;
  font-size: 24px;
  font-weight: 700;
  color: #333;
`;

const Affiliation = styled.p`
  margin: 0 0 12px 0;
  font-size: 16px;
  color: #666;
`;

const SectorList = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 12px;
`;

const SectorTag = styled.span`
  padding: 6px 12px;
  background-color: #e3f2fd;
  border-radius: 4px;
  font-size: 14px;
  color: #1976d2;
  font-weight: 500;
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
  margin-top: 16px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 16px;
`;

const TableHeader = styled.thead`
  background-color: #f8f9fa;
`;

const TableHeaderCell = styled.th`
  padding: 12px;
  text-align: left;
  font-size: 14px;
  font-weight: 600;
  color: #333;
  border-bottom: 2px solid #e0e0e0;
`;

const TableBody = styled.tbody``;

const TableRow = styled.tr`
  border-bottom: 1px solid #e0e0e0;

  &:hover {
    background-color: #f8f9fa;
  }
`;

const TableCell = styled.td`
  padding: 12px;
  font-size: 14px;
  color: #333;
`;

const ChartPlaceholder = styled.div`
  width: 100%;
  height: 300px;
  background-color: #f8f9fa;
  border: 1px dashed #ccc;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 14px;
  margin-top: 16px;
`;

const ChartWrapper = styled.div`
  width: 100%;
  height: 300px;
  margin-top: 16px;
`;

const ReportList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 16px;
`;

const ReportItem = styled.div`
  padding: 16px;
  background-color: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ReportInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const ReportTitle = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #333;
`;

const ReportMeta = styled.div`
  font-size: 14px;
  color: #666;
`;

const ReportButton = styled.button`
  padding: 8px 16px;
  border: 1px solid #007bff;
  border-radius: 4px;
  background-color: #007bff;
  color: #ffffff;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #0056b3;
  }
`;

type ReportFrequencyPoint = {
  month: string;
  count: number;
};

const buildReportFrequencyLastYear = (
  reports: AnalystDetail['reports'],
): ReportFrequencyPoint[] => {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const start = new Date(now.getFullYear(), now.getMonth() - 11, 1);

  const counter = new Map<string, number>();
  reports.forEach((report) => {
    const date = new Date(report.date);
    if (Number.isNaN(date.getTime())) {
      return;
    }
    if (date < start || date > now) {
      return;
    }
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      '0',
    )}`;
    counter.set(key, (counter.get(key) ?? 0) + 1);
  });

  const points: ReportFrequencyPoint[] = [];
  for (let i = 0; i < 12; i += 1) {
    const current = new Date(start.getFullYear(), start.getMonth() + i, 1);
    const key = `${current.getFullYear()}-${String(
      current.getMonth() + 1,
    ).padStart(2, '0')}`;
    points.push({ month: key, count: counter.get(key) ?? 0 });
  }

  return points;
};

export const AnalystDetailPage = () => {
  const { analystId } = useParams<{ analystId: string }>();
  const [analyst, setAnalyst] = useState<AnalystDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!analystId) {
      setError('애널리스트 ID가 유효하지 않습니다.');
      setLoading(false);
      return;
    }

    let isMounted = true;

    const fetchDetail = async () => {
      try {
        setLoading(true);
        setError(null);

        const numericId = Number(analystId);
        if (Number.isNaN(numericId)) {
          throw new Error('Invalid analystId');
        }

        const data = await getAnalystDetail(numericId);
        if (isMounted) {
          setAnalyst(data);
        }
      } catch (e) {
        console.error(e);
        if (isMounted) {
          setError('애널리스트 상세 정보를 불러오는 데 실패했습니다.');
          setAnalyst(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchDetail();

    return () => {
      isMounted = false;
    };
  }, [analystId]);

  if (loading) {
    return (
      <PageContainer>
        <StatusMessage>애널리스트 상세 정보를 불러오는 중입니다...</StatusMessage>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer>
        <StatusMessage>{error}</StatusMessage>
      </PageContainer>
    );
  }

  if (!analyst) {
    return (
      <PageContainer>
        <StatusMessage>애널리스트 정보를 찾을 수 없습니다.</StatusMessage>
      </PageContainer>
    );
  }

  const uniqueSectors = Array.from(
    new Set(analyst.coveredStocks.map((stock) => stock.sector)),
  );

  const formatPercent = (value: number, digits = 1) =>
    `${value.toFixed(digits)}%`;

  const reportFrequency = buildReportFrequencyLastYear(analyst.reports);

  return (
    <PageContainer>
      <Section>
        <HeaderWrapper>
          <AnalystName>{analyst.name}</AnalystName>
          <Affiliation>{analyst.firm}</Affiliation>
          {uniqueSectors.length > 0 && (
            <SectorList>
              {uniqueSectors.map((sector) => (
                <SectorTag key={sector}>{sector}</SectorTag>
              ))}
            </SectorList>
          )}
        </HeaderWrapper>
      </Section>

      <Section>
        <SectionTitle>핵심 지표</SectionTitle>
        <MetricsGrid>
          <MetricCard
            label="정답률"
            value={formatPercent(analyst.metrics.accuracyRate)}
          />
          <MetricCard
            label="평균 수익률"
            value={formatPercent(analyst.metrics.returnRate)}
          />
          <MetricCard
            label="목표가 오차율"
            value={formatPercent(analyst.metrics.targetDiffRate)}
          />
          <MetricCard
            label="평균 대비 수익률"
            value={formatPercent(analyst.metrics.avgReturnDiff)}
          />
          <MetricCard
            label="평균 대비 목표가 정확도"
            value={formatPercent(analyst.metrics.avgTargetDiff)}
          />
          <MetricCard
            label="AIM's Score"
            value={analyst.metrics.aimsScore.toFixed(0)}
          />
        </MetricsGrid>
      </Section>

      <Section>
        <SectionTitle>커버 종목 리스트</SectionTitle>
        <Table>
          <TableHeader>
            <tr>
              <TableHeaderCell>종목명</TableHeaderCell>
              <TableHeaderCell>종목 코드</TableHeaderCell>
              <TableHeaderCell>섹터</TableHeaderCell>
              <TableHeaderCell>리포트 수</TableHeaderCell>
            </tr>
          </TableHeader>
          <TableBody>
            {analyst.coveredStocks.map((stock) => (
              <TableRow key={stock.id}>
                <TableCell>{stock.name}</TableCell>
                <TableCell>{stock.code}</TableCell>
                <TableCell>{stock.sector}</TableCell>
                <TableCell>{stock.reportCount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Section>

      <Section>
        <SectionTitle>최근 1년 리포트 발행 추이</SectionTitle>
        {reportFrequency.length === 0 || reportFrequency.every((p) => p.count === 0) ? (
          <ChartPlaceholder>
            최근 1년간 발행된 리포트가 없습니다.
          </ChartPlaceholder>
        ) : (
          <ChartWrapper>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={reportFrequency}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </ChartWrapper>
        )}
      </Section>

      <Section>
        <SectionTitle>리포트 목록</SectionTitle>
        {analyst.reports.length === 0 ? (
          <StatusMessage>등록된 리포트가 없습니다.</StatusMessage>
        ) : (
          <ReportList>
            {analyst.reports.map((report) => (
              <ReportItem key={report.id}>
                <ReportInfo>
                  <ReportTitle>{report.title}</ReportTitle>
                  <ReportMeta>
                    {report.date} · {report.stockName} ({report.stockCode}) ·{' '}
                    {report.surfaceOpinion} / {report.hiddenOpinionLabel}
                  </ReportMeta>
                </ReportInfo>
                <ReportButton>리포트 보기</ReportButton>
              </ReportItem>
            ))}
          </ReportList>
        )}
      </Section>
    </PageContainer>
  );
};

