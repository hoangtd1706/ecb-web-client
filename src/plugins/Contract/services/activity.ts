import axios from 'axios';

const apiUrl = (contractNumber: string) => `/api/contract/contracts/${contractNumber}/activities`;

export type ActivityModel = {
  userNumber: string;
  fullName: string;
  activityCode: number;
  createdTime: Date;
  content: string;
}

export type StepModel = {
  order: number;
  userNumber: string;
}

export type AddActivityModel = {
  content: string;
  steps: StepModel[];
}

function getAll(contractNumber: string): Promise<ActivityModel[]> {
  return axios.get(`${apiUrl(contractNumber)}`);
}

function getValidActions(contractNumber: string): Promise<number[]> {
  return axios.get(`${apiUrl(contractNumber)}/getValidActions`);
}

function create(contractNumber: string, actionName: string, model: AddActivityModel): Promise<unknown> {
  return axios.post(`${apiUrl(contractNumber)}/${actionName}`, model);
}

const service = {
  getAll,
  getValidActions,
  create,
};

export default service;
