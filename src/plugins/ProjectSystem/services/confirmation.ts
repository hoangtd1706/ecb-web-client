import axios from 'axios';

const apiUrl = '/api/project-system/confirmations';

export type ConfirmationBase = {
  elementCode: string;
  postingDate: Date;
  projectCode: string;
}

export type ConfirmationModel = ConfirmationBase & {
  versionNumber: number;
}

export type CommittedConfirmationModel = ConfirmationBase & {
  commitNumber: number;
  status: number;
}

function getAll(projectCode: string, version: number): Promise<ConfirmationModel[]> {
  return axios.get(`${apiUrl}?projectCode=${projectCode}&version=${version}`);
}

function create(projectCode: string, elementCode: string): Promise<unknown> {
  return axios.post(`${apiUrl}?projectCode=${projectCode}&elementCode=${elementCode}`);
}

function remove(projectCode: string, elementCode: string): Promise<unknown> {
  return axios.delete(`${apiUrl}?projectCode=${projectCode}&elementCode=${elementCode}`);
}

const service = {
  getAll,
  create,
  remove,
};

export default service;
