import axios from 'axios';

const apiUrl = '/api/project-system/projects';

export type ProjectModel = {
  code: string;
  name: string;
}

function getAll(): Promise<ProjectModel[]> {
  return axios.get(apiUrl);
}

function get(projectCode: string): Promise<ProjectModel> {
  return axios.get(`${apiUrl}/${projectCode}`);
}

const service = {
  getAll,
  get,
};

export default service;
