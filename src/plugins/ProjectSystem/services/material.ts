import axios from 'axios';

const apiUrl = '/api/project-system/materials';

export type MaterialModel = {
  code: string;
  description: string;
  unit: string
}

function getAll(): Promise<MaterialModel[]> {
  return axios.get(apiUrl);
}

function getByFilter(filter: string, page: number): Promise<MaterialModel[]> {
  if (filter !== '') {
    return axios.get(`${apiUrl}/search?filter=${filter}&page=${page}`);
  }
  return axios.get(`${apiUrl}/search?page=${page}`);
}

const service = {
  getAll,
  getByFilter,
};

export default service;
