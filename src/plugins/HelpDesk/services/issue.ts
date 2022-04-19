import axios from 'axios';

const apiUrl = '/api/help-desk/issues';

export type IssueModel = AddIssueModel & {
  id: number;
  moduleName: string;
  category: string;
  createdBy: string;
  createdByFullName: string;
  createdTime: Date;
  supportedBy: string;
  supportedByFullName: string;
  status: number;
  followed: boolean;
  attachments: AttachmentModel[];
}

export type AddIssueModel = {
  title: string;
  content: string;
  severity: number;
  priority: number;
  moduleId: number;
}

export type AttachmentModel = {
  fileName: string;
  createdBy: string;
  createdByFullName: string;
  createdTime: Date;
}

function getAll(filter: string): Promise<IssueModel[]> {
  return axios.get(`${apiUrl}/filter/${filter}`);
}

function getById(issueId: number): Promise<IssueModel> {
  return axios.get(`${apiUrl}/${issueId}`);
}

function create(model: AddIssueModel): Promise<number> {
  return axios.post(apiUrl, model);
}

function follow(issueId: number): Promise<unknown> {
  return axios.post(`${apiUrl}/${issueId}/followers/follow`);
}

function unFollow(issueId: number): Promise<unknown> {
  return axios.delete(`${apiUrl}/${issueId}/followers/unFollow`);
}

const service = {
  getAll,
  getById,
  create,
  follow,
  unFollow,
};

export default service;
