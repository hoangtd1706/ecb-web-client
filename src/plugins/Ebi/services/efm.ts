import axios from 'axios';

import {
  ReportItem,
} from './types';

export type BankReport = {
  bankCode: string;
  bankName: string;
  data: ReportItem[];
}

export type ProjectReport = {
  projectCode: string;
  projectName: string;
  data: ReportItem[];
}

const apiUrl = '/api/ebi/efm';

function getEfm02Report(): Promise<ReportItem[]> {
  return axios.get(`${apiUrl}/efm02`);
}

function getEfm05Report(): Promise<ReportItem[]> {
  return axios.get(`${apiUrl}/efm05`);
}

function getEfm06Report(): Promise<BankReport[]> {
  return axios.get(`${apiUrl}/efm06`);
}

function getEfm08Report(): Promise<ProjectReport[]> {
  return axios.get(`${apiUrl}/efm08`);
}

const service = {
  getEfm02Report,
  getEfm05Report,
  getEfm06Report,
  getEfm08Report,
};

export default service;
