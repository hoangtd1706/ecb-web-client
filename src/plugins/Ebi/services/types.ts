export type ReportItem = {
  period: number;
  reportType: string;
  dispersion: number;
  accumulation: number;
}

export type VersionType = "BASELINE" | "REBASELINE" | "FORECAST";