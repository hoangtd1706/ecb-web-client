import axios from 'axios';

const apiUrl = '/api/contract/users';
export const ROLES = [
  'CREATOR_ROLE',
  'APPROVER_ROLE'
] as const;

export type RoleType = typeof ROLES[number];

export type ModeratorModel = {
  userNumber: string;
  fullName: string;
  role: string;
}

function checkPermission(): Promise<boolean> {
  return axios.get(`${apiUrl}/checkPermission`);
}

function checkRolePermission(role: RoleType): Promise<boolean> {
  return axios.get(`${apiUrl}/checkRolePermission?role=${role}`);
}

function getAll(): Promise<ModeratorModel[]> {
  return axios.get(apiUrl);
}

function create(role: RoleType, userNumber: string): Promise<unknown> {
  return axios.post(`${apiUrl}/create/${userNumber}?role=${role}`);
}

function remove(role: RoleType, userNumber: string): Promise<unknown> {
  return axios.delete(`${apiUrl}/remove/${userNumber}?role=${role}`);
}

function getApproverByKeyWord(keyWord: string): Promise<ModeratorModel> {
  return axios.get(`${apiUrl}/getApproverByKeyWord?keyWord=${keyWord}`);
}

const service = {
  checkPermission,
  checkRolePermission,
  getAll,
  create,
  remove,
  getApproverByKeyWord,
};

export default service;
