import { SCurveChartData } from '../components/SCurveChart';
import { PieChartData } from '../components/PieChart';
import { GapBar2ChartData } from '../components/GapBar2Chart';

import { ReportItem } from '../services/types';
import {
  getCurrentPeriod,
  getFiscalYear,
  getPeriodLabel,
  getPeriodsByFiscalYear,
  getReportType,
  getVersionType,
} from './helpers';

const getSCurveChartData = (
  data: ReportItem[],
): SCurveChartData[] => {

  const fiscalYear = getFiscalYear();
  const periods = getPeriodsByFiscalYear(fiscalYear);

  return periods.map(period => {
    const baselineData = data.filter(
      x => x.period === period &&
        x.reportType[0] === getVersionType('BASELINE'));

    const rebaselineData = data.filter(
      x => x.period === period &&
        x.reportType[0] === getVersionType('REBASELINE'));

    const forecastData = data.filter(
      x => x.period === period &&
        x.reportType[0] === getVersionType('FORECAST'));

    const row: SCurveChartData = {
      period: getPeriodLabel(period),
      baseline: baselineData.map(x => x.dispersion).reduce((acc, val) => acc + val, 0),
      rebaseline: rebaselineData.map(x => x.dispersion).reduce((acc, val) => acc + val, 0),
      forecast: forecastData.map(x => x.dispersion).reduce((acc, val) => acc + val, 0),
      accBaseline: baselineData.map(x => x.accumulation).reduce((acc, val) => acc + val, 0),
      accRebaseline: rebaselineData.map(x => x.accumulation).reduce((acc, val) => acc + val, 0),
      accForecast: forecastData.map(x => x.accumulation).reduce((acc, val) => acc + val, 0),
    }

    return row;
  });
}

const getPieChartData = (
  data: ReportItem[],
  categories: CategoryConfig[],
): PieChartData[] => {

  const currentPeriod = getCurrentPeriod();

  return categories.map(category => {
    const forecastData = data.filter(
      x => x.period === currentPeriod &&
        category.reportTypes
          .map(x => getReportType('FORECAST', x))
          .includes(x.reportType));

    const row: PieChartData = {
      name: category.name,
      value: forecastData.map(x => x.accumulation).reduce((acc, val) => acc + val, 0),
    }

    return row;
  });
}

const getGap2ChartData = (
  data: ReportItem[],
  categories: CategoryConfig[],
): GapBar2ChartData[] => {

  const currentPeriod = getCurrentPeriod();

  return categories.map(category => {
    const forecastVal = data.filter(
      x => x.period === currentPeriod &&
        category.reportTypes
          .map(x => getReportType('FORECAST', x))
          .includes(x.reportType))
      .map(x => x.accumulation)
      .reduce((acc, val) => acc + val, 0);

    const rebaselineVal = data.filter(
      x => x.period === currentPeriod &&
        category.reportTypes
          .map(x => getReportType('REBASELINE', x))
          .includes(x.reportType))
      .map(x => x.accumulation)
      .reduce((acc, val) => acc + val, 0);

    const row: GapBar2ChartData = {
      category: category.name,
      name: category.name,
      forecast: forecastVal,
      rebaseline: rebaselineVal,
      gap: Math.abs(rebaselineVal - forecastVal),
    }

    return row;
  });
}

const helpers = {
  getSCurveChartData,
  getPieChartData,
  getGap2ChartData,
}

export type CategoryConfig = {
  name: string;
  reportTypes: string[];
}

export default helpers;