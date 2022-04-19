export type Efm06BarChartData = {
  name: string;
  total: number;
  balance: number;
  remaining: number;
}

export type Efm06PieChartData = {
  name: string;
  value: number;
}

export type Efm06SCurveChartData = {
  period: string;
  deposit: number | null;
  credit: number | null;
  balance: number | null;
}

import { BankReport } from '../services/efm';
import { ReportItem } from '../services/types';
import {
  getCurrentPeriod,
  getFiscalYear,
  getPeriodLabel,
  getPeriodsByFiscalYear,
} from './helpers';

const getSCurveChartData = (
  report: BankReport[],
): Efm06SCurveChartData[] => {

  const fiscalYear = getFiscalYear();
  const periods = getPeriodsByFiscalYear(fiscalYear);
  // const currentPeriod = getCurrentPeriod();
  const data: ReportItem[] = [];
  report.map(b => {
    data.push(...b.data);
    return true;
  });

  const currentPeriod = getCurrentPeriod();

  return periods.map(period => {
    const periodData = data.filter(x => x.period === period);
    const depositData = periodData.filter(x =>
      x.reportType === '501' ||
      x.reportType === '502' ||
      x.reportType === '503' ||
      x.reportType === '504' ||
      x.reportType === '505' ||
      x.reportType === '506'
    );

    const creditData = periodData.filter(x =>
      x.reportType === '301' ||
      x.reportType === '302' ||
      x.reportType === '305'
    );

    const depositVal = depositData.map(x => x.accumulation).reduce((acc, val) => acc + val, 0);
    const creditVal = creditData.map(x => x.accumulation).reduce((acc, val) => acc + val, 0);


    const row: Efm06SCurveChartData = {
      period: getPeriodLabel(period),
      deposit: currentPeriod >= period ? depositVal : null,
      credit: currentPeriod >= period ? creditVal : null,
      balance: currentPeriod >= period ? creditVal - depositVal : null,
    }

    return row;
  });
}

const getPieChartData = (
  report: BankReport[],
): Efm06PieChartData[] => {

  const currentPeriod = getCurrentPeriod();
  const data: ReportItem[] = [];
  report.map(b => {
    data.push(...b.data);
    return true;
  });

  const result: Efm06PieChartData[] = [];
  result.push(getPieChartRow(data, currentPeriod, '01', 'Tiền gửi thanh toán'));
  result.push(getPieChartRow(data, currentPeriod, '02', 'Tiền gửi có kỳ hạn từ 1-3 tháng'));
  result.push(getPieChartRow(data, currentPeriod, '03', 'Tiền gửi có kỳ hạn từ 3-6 tháng'));
  result.push(getPieChartRow(data, currentPeriod, '04', 'Tiền gửi có kỳ hạn từ 6-12 tháng'));
  result.push(getPieChartRow(data, currentPeriod, '05', 'Tiền gửi có kỳ hạn trên 12 tháng'));
  result.push(getPieChartRow(data, currentPeriod, '06', 'Ký quỹ bằng tiền'));

  return result;
}

const getBarChartData = (
  report: BankReport[],
): Efm06BarChartData[] => {

  const currentPeriod = getCurrentPeriod();
  const data: ReportItem[] = [];
  report.map(b => {
    data.push(...b.data);
    return true;
  });

  const result: Efm06BarChartData[] = [];
  result.push(getBarChartRow(data, currentPeriod, '01', 'Vay ngắn hạn'));
  result.push(getBarChartRow(data, currentPeriod, '02', 'Vay dài hạn'));
  result.push(getBarChartRow(data, currentPeriod, '03', 'Bảo lãnh'));
  result.push(getBarChartRow(data, currentPeriod, '04', 'L/C'));
  result.push(getBarChartRow(data, currentPeriod, '05', 'Vay thấu chi'));

  return result;

}

const getBarChartRow = (
  data: ReportItem[],
  period: number,
  dataType: string,
  category: string,
): Efm06BarChartData => {
  const totalData = data.filter(x => x.period === period && x.reportType === `2${dataType}`);
  const balanceData = data.filter(x => x.period === period && x.reportType === `3${dataType}`);
  const totalVal = totalData.map(x => x.accumulation).reduce((acc, val) => acc + val, 0);
  const balanceVal = balanceData.map(x => x.accumulation).reduce((acc, val) => acc + val, 0);

  const item: Efm06BarChartData = {
    name: category,
    total: totalVal,
    balance: balanceVal,
    remaining: totalVal - balanceVal,
  }

  return item;
}

const getPieChartRow = (
  data: ReportItem[],
  period: number,
  dataType: string,
  category: string,
): Efm06PieChartData => {
  const totalData = data.filter(x => x.period === period && x.reportType === `5${dataType}`);
  const totalVal = totalData.map(x => x.accumulation).reduce((acc, val) => acc + val, 0);

  const item: Efm06PieChartData = {
    name: category,
    value: totalVal,
  }

  return item;
}

const helpers = {
  getSCurveChartData,
  getPieChartData,
  getBarChartData,
}

export default helpers;