import axios from 'axios';

const apiUrl = (issueId: number): string => `/api/help-desk/issues/${issueId}/activities`;

export type ActivityModel = {
  issueId: number;
  activityCode: number;
  content: string;
  createdTime: Date;
  createdBy: string;
  createdByFullName: string;
}

export type AddActivityModel = {
  content: string;
}

export type RequestModel = {
  activity: ActivityModel,
  approvers: string[],
}

function getAll(issueId: number): Promise<ActivityModel[]> {
  return axios.get(apiUrl(issueId));
}

function getValidActions(issueId: number): Promise<number[]> {
  return axios.get(`${apiUrl(issueId)}/validAction`);
}

function create(issueId: number, actionName: string, model: AddActivityModel): Promise<unknown> {
  return axios.post(`${apiUrl(issueId)}/${actionName}`, model);
}

function createRequest(issueId: number, model: RequestModel): Promise<unknown> {
  return axios.post(`${apiUrl(issueId)}/createRequest`, model);
}

function attach(issueId: number, file: File): Promise<unknown> {
  const formData = new FormData();
  formData.append('files', file, file.name);

  return axios.post(`${apiUrl(issueId)}/attach`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
}

const service = {
  getAll,
  getValidActions,
  create,
  createRequest,
  attach,
};

export default service;