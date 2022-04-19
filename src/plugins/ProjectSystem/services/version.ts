import axios from 'axios';

const apiUrl = '/api/project-system/versions';

export type VersionModel = {
  number: number;
  projectCode: string;
  branch: number;
  description: string;
  createdBy: string;
  createdByFullName: string;
  createdDate: Date;
}

function getAll(projectCode: string, branch: number): Promise<VersionModel[]> {
  return axios.get(`${apiUrl}?projectCode=${projectCode}&branch=${branch}`);
}

function createPlannerVersion(projectCode: string, data: VersionModel): Promise<unknown> {
  return axios.post(`${apiUrl}/create-planner-version?projectCode=${projectCode}`, data);
}

function createDesignerVersion(projectCode: string, data: VersionModel): Promise<unknown> {
  return axios.post(`${apiUrl}/create-designer-version?projectCode=${projectCode}`, data);
}

const service = {
  getAll,
  createPlannerVersion,
  createDesignerVersion,
};

export default service;
