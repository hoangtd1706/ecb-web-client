import axios from 'axios';

const apiUrl = '/api/project-system/serviceMasters';

export type ServiceMasterModel = {
  code: string;
  description: string;
  unit: string;
}

function getAll(): Promise<ServiceMasterModel[]> {
  return axios.get(apiUrl);
}

function getByFilter(filter: string, page: number): Promise<ServiceMasterModel[]> {
  if (filter !== '') {
    return axios.get(`${apiUrl}/search?filter=${filter}&page=${page}`);
  }
  return axios.get(`${apiUrl}/search?page=${page}`);
}

function get(serviceMasterCode: string): Promise<ServiceMasterModel> {
  return axios.get(`${apiUrl}/${serviceMasterCode}`);
}

const service = {
  getAll,
  getByFilter,
  get,
};

export default service;
