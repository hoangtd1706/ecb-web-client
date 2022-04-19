import axios from 'axios';

import {
  ReportItem,
} from './types';

const apiUrl = '/api/ebi/efm03';

export type ProjectReport = {
  projectCode: string;
  projectName: string;
  data: ReportItem[];
}

export type SummaryReport = {
  data: ReportItem[];
  projects: ProjectReport[];
}

function get(): Promise<SummaryReport> {
  return axios.get(apiUrl);
}

const service = {
  get,
};

export default service;
