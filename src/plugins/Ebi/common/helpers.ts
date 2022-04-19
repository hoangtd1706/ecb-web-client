import { VersionType } from "../services/types";

export const getPeriodsByFiscalYear = (fiscalYear: number): number[] => {
  return [
    fiscalYear * 100 + 4,
    fiscalYear * 100 + 5,
    fiscalYear * 100 + 6,
    fiscalYear * 100 + 7,
    fiscalYear * 100 + 8,
    fiscalYear * 100 + 9,
    fiscalYear * 100 + 10,
    fiscalYear * 100 + 11,
    fiscalYear * 100 + 12,
    (fiscalYear + 1) * 100 + 1,
    (fiscalYear + 1) * 100 + 2,
    (fiscalYear + 1) * 100 + 3,
  ];
}

export const getCurrentPeriod = (): number => {
  const now = new Date();
  const month = now.getMonth() === 0 ? 12 : now.getMonth();
  const year = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
  return year * 100 + month;
}

export const getPeriodLabel = (period: number): string => {
  const text = period.toFixed(0);
  return `${text[4]}${text[5]}/${text[2]}${text[3]}`
}

export const getFiscalYear = (): number => {
  const now = new Date();
  const month = now.getMonth();
  if (month >= 4 && month <= 11) {
    return now.getFullYear();
  }

  return now.getFullYear() - 1;
}

export const getVersionType = (version: VersionType): string => {
  switch (version) {
    case "BASELINE": return "1";
    case "REBASELINE": return "2";
    case "FORECAST": return "3";
    default: throw "Not found version type!";
  }
}

export const getReportType = (version: VersionType, dataType: string | number): string => {
  const versionPrefix = parseInt(getVersionType(version), 10);
  const dataTypeSuffix = parseInt(`${dataType}`, 10);

  return `${versionPrefix * 100 + dataTypeSuffix}`;
}