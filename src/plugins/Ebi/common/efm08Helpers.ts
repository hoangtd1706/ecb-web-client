import { ProjectReport } from '../services/efm';
import { ReportItem } from '../services/types';
import {
  getCurrentPeriod,
  getFiscalYear,
  getPeriodLabel,
  getPeriodsByFiscalYear,
} from './helpers';

export type Efm08AreaChartData = {
  period: string;
  inDue: number | null;
  outDue1: number | null;
  outDue31: number | null;
  outDue91: number | null;
  outDue181: number | null;
}

export type Efm08MixedChartData = {
  projectCode: string;
  projectName: string;
  inDue: number;
  outDue1: number;
  outDue31: number;
  outDue91: number;
  outDue181: number;
  outDueRatio: number;
}

const getAreaChartData = (
  dataType: '1' | '2',
  report: ProjectReport[],
): Efm08AreaChartData[] => {

  const fiscalYear = getFiscalYear();
  const periods = getPeriodsByFiscalYear(fiscalYear);
  const currentPeriod = getCurrentPeriod();

  const data: ReportItem[] = [];
  report.map(b => {
    data.push(...b.data);
    return true;
  });

  return periods.map(period => {
    const periodData = data.filter(x => x.period === period);

    const inDueVal = periodData
      .filter(x => x.reportType === `${dataType}01`)
      .map(x => x.accumulation)
      .reduce((acc, val) => acc + val, 0);

    const outDue1Val = periodData
      .filter(x => x.reportType === `${dataType}02`)
      .map(x => x.accumulation)
      .reduce((acc, val) => acc + val, 0);

    const outDue31Val = periodData
      .filter(x => x.reportType === `${dataType}03`)
      .map(x => x.accumulation)
      .reduce((acc, val) => acc + val, 0);

    const outDue91Val = periodData
      .filter(x => x.reportType === `${dataType}04`)
      .map(x => x.accumulation)
      .reduce((acc, val) => acc + val, 0);

    const outDue181Val = periodData
      .filter(x => x.reportType === `${dataType}05`)
      .map(x => x.accumulation)
      .reduce((acc, val) => acc + val, 0);


    const row: Efm08AreaChartData = {
      period: getPeriodLabel(period),
      inDue: currentPeriod >= period ? inDueVal : null,
      outDue1: currentPeriod >= period ? outDue1Val : null,
      outDue31: currentPeriod >= period ? outDue31Val : null,
      outDue91: currentPeriod >= period ? outDue91Val : null,
      outDue181: currentPeriod >= period ? outDue181Val : null,
    }

    return row;
  });
}

const getMixedChartData = (
  dataType: '1' | '2',
  report: ProjectReport[],
): Efm08MixedChartData[] => {

  const currentPeriod = getCurrentPeriod();

  const data: Efm08MixedChartData[] = report.map(project => {
    const periodData = project.data.filter(x => x.period === currentPeriod);

    const inDueVal = periodData
      .filter(x => x.reportType === `${dataType}01`)
      .map(x => x.accumulation)
      .reduce((acc, val) => acc + val, 0);

    const outDue1Val = periodData
      .filter(x => x.reportType === `${dataType}02`)
      .map(x => x.accumulation)
      .reduce((acc, val) => acc + val, 0);

    const outDue31Val = periodData
      .filter(x => x.reportType === `${dataType}03`)
      .map(x => x.accumulation)
      .reduce((acc, val) => acc + val, 0);

    const outDue91Val = periodData
      .filter(x => x.reportType === `${dataType}04`)
      .map(x => x.accumulation)
      .reduce((acc, val) => acc + val, 0);

    const outDue181Val = periodData
      .filter(x => x.reportType === `${dataType}05`)
      .map(x => x.accumulation)
      .reduce((acc, val) => acc + val, 0);

    const totalVal = (inDueVal + outDue1Val + outDue31Val + outDue91Val + outDue181Val);
    const outDueVal = (outDue1Val + outDue31Val + outDue91Val + outDue181Val);

    const outDueRatio = totalVal === 0 ? 0 : outDueVal / totalVal * 100;


    const row: Efm08MixedChartData = {
      projectCode: project.projectCode,
      projectName: project.projectName,
      inDue: inDueVal,
      outDue1: outDue1Val,
      outDue31: outDue31Val,
      outDue91: outDue91Val,
      outDue181: outDue181Val,
      outDueRatio: outDueRatio,
    }

    return row;
  });

  return data.sort(sortProject).slice(0, 5);
}

const sortProject = (a: Efm08MixedChartData, b: Efm08MixedChartData): number => {
  if (a.outDueRatio > b.outDueRatio) return -1;
  if (a.outDueRatio < b.outDueRatio) return 1;

  const totalA = (a.inDue + a.outDue1 + a.outDue31 + a.outDue91 + a.outDue181);
  const totalB = (b.inDue + b.outDue1 + b.outDue31 + b.outDue91 + b.outDue181);
  if (totalA > totalB) return -1;
  if (totalA < totalB) return 1;

  return 0;
}

const helpers = {
  getAreaChartData,
  getMixedChartData,
}

export default helpers;