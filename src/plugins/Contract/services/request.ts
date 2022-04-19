import axios from 'axios';

const apiUrl = (contractNumber: string) => `/api/contract/contracts/${contractNumber}/requests`;

export type StepModel = {
  userNumber: string;
  isFinish: boolean;
}

export type CreateRequestModel = {
  isReopen: boolean;
  content: string;
  steps: StepModel[];
}

export type ActionRequestModel = {
  content: string;
}

function create(contractNumber: string, model: CreateRequestModel): Promise<unknown> {
  return axios.post(`${apiUrl(contractNumber)}/create`, model);
}

function cancel(contractNumber: string, model: ActionRequestModel): Promise<unknown> {
  return axios.post(`${apiUrl(contractNumber)}/cancel`, model);
}

function check(contractNumber: string, model: ActionRequestModel): Promise<unknown> {
  return axios.post(`${apiUrl(contractNumber)}/check`, model);
}

function reject(contractNumber: string, model: ActionRequestModel): Promise<unknown> {
  return axios.post(`${apiUrl(contractNumber)}/reject`, model);
}

function approve(contractNumber: string, model: ActionRequestModel): Promise<unknown> {
  return axios.post(`${apiUrl(contractNumber)}/approve`, model);
}

const service = {
  create,
  cancel,
  check,
  reject,
  approve,
};

export default service;
