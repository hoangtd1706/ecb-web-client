import axios from 'axios';

const apiUrl = (moduleId: number): string => `/api/help-desk/modules/${moduleId}/supporters`;

export type SupporterModel = {
  userNumber: string;
  fullName: string;
}

export type AddSupporterModel = {
  keyword: string;
}

function getAll(moduleId: number): Promise<SupporterModel[]> {
  return axios.get(apiUrl(moduleId));
}

function create(moduleId: number, keyword: string): Promise<unknown> {
  const model: AddSupporterModel = {
    keyword: keyword,
  }
  return axios.post(apiUrl(moduleId), model);
}

function remove(moduleId: number, userNumber: string): Promise<unknown> {
  return axios.delete(`${apiUrl(moduleId)}/${userNumber}`);
}

const service = {
  getAll,
  create,
  remove,
};

export default service;