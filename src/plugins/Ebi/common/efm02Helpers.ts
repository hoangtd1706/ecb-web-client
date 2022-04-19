import { DetailChartData } from '../components/efm02/DetailChart';
import { OverviewChartData } from '../components/efm02/OverviewChart';
import { getReportType, getVersionType } from './helpers';

import { ReportItem, VersionType } from '../services/types';
import { SummaryReport } from '../services/efm03';

import {
  getFiscalYear,
  getPeriodsByFiscalYear,
  getPeriodLabel,
} from './helpers';

const getValueByType = (reportData: ReportItem[], reportType: string, period: number): number => {
  return reportData
    .filter(x => x.reportType === reportType && x.period <= period)
    .map(x => x.dispersion)
    .reduce((acc, val) => acc + val, 0);
}

const getDetailChartData = (
  version: VersionType,
  isIncome: boolean,
  reportData: ReportItem[],
): DetailChartData[] => {
  const fiscalYear = getFiscalYear();
  const periods = getPeriodsByFiscalYear(fiscalYear);

  return periods.map(period => {
    const row: DetailChartData = {
      period: getPeriodLabel(period),
      paymentDiscount: getValueByType(reportData, getReportType(version, isIncome ? 2 : 1), period),
      financialSupport: getValueByType(reportData, getReportType(version, isIncome ? 4 : 3), period),
      latePayment: getValueByType(reportData, getReportType(version, isIncome ? 6 : 5), period),
      shortTermFunding: getValueByType(reportData, getReportType(version, isIncome ? 8 : 7), period),
      longTermFunding: getValueByType(reportData, getReportType(version, isIncome ? 10 : 9), period),
      other: getValueByType(reportData, getReportType(version, isIncome ? 12 : 11), period),
    }

    return row;
  });
}

const getOverviewChartData = (
  version: VersionType,
  reportData: ReportItem[],
  efm03ReportData: SummaryReport,
): OverviewChartData[] => {
  const fiscalYear = getFiscalYear();
  const periods = getPeriodsByFiscalYear(fiscalYear);

  const filterReportData = reportData.filter(x => x.reportType[0] === `${getVersionType(version)}`);

  return periods.map(period => {
    const outcome = filterReportData.filter(x => x.period <= period && parseInt(x.reportType) % 2 === 0)
      .map(x => x.dispersion)
      .reduce((a, v) => a + v, 0);

    const income = filterReportData.filter(x => x.period <= period && parseInt(x.reportType) % 2 === 1)
      .map(x => x.dispersion)
      .reduce((a, v) => a + v, 0);

    const baseline = efm03ReportData.data.filter(x => x.period === period && x.reportType === '102')
      .map(x => x.accumulation).reduce((a, v) => a + v, 0);

    const rebaseline = efm03ReportData.data.filter(x => x.period === period && x.reportType === '202')
      .map(x => x.accumulation).reduce((a, v) => a + v, 0);

    const forecast = efm03ReportData.data.filter(x => x.period === period && x.reportType === '302')
      .map(x => x.accumulation).reduce((a, v) => a + v, 0);

    const row: OverviewChartData = {
      period: getPeriodLabel(period),
      outcome: outcome,
      income: income,
      total: income - outcome,
      baselineRatio: baseline !== 0 ? (income - outcome) / baseline * 100 : 0,
      rebaselineRatio: rebaseline !== 0 ? (income - outcome) / rebaseline * 100 : 0,
      forecastRatio: forecast !== 0 ? (income - outcome) / forecast * 100 : 0,
    }

    return row;
  });
}

const dataProvider = {
  getDetailChartData,
  getOverviewChartData,
  getPeriodLabel,
}

export default dataProvider;