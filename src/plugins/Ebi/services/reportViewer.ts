import axios from 'axios';

const apiUrl = '/api/ebi/report-viewers';

export type ViewerModel = Viewer & {
  projectName: string;
}

export type Viewer = {
  reportCode: string;
  projectCode: string;
  userNumber: string;
  userFullName: string;
}

export type ProjectViewerModel = {
  projectCode: string;
  projectName: string;
  viewers: Viewer[];
}

function get(reportCode: string): Promise<ProjectViewerModel[]> {
  return axios.get(`${apiUrl}?reportCode=${reportCode}`);
}

function getPermission(reportCode: string): Promise<ViewerModel[]> {
  return axios.get(`${apiUrl}/my-permission?reportCode=${reportCode}`);
}

function create(reportCode: string, projectCode: string, userNumber: string): Promise<unknown> {
  return axios.post(`${apiUrl}?reportCode=${reportCode}&projectCode=${projectCode}&userNumber=${userNumber}`);
}

function remove(reportCode: string, projectCode: string, userNumber: string): Promise<unknown> {
  return axios.delete(`${apiUrl}?reportCode=${reportCode}&projectCode=${projectCode}&userNumber=${userNumber}`);
}

const service = {
  get,
  getPermission,
  create,
  remove,
};

export default service;
