import axios from 'axios';

const apiUrl = '/api/project-system/users';
export const ROLES = [
  'PLANNER_ROLE',
  'DESIGNER_ROLE',
  'ESTIMATOR_ROLE',
  'SUPERVISOR_ROLE',
  'FORM_ROLE',
  'APPROVER_PLANNER_ROLE',
  'APPROVER_DESIGNER_ROLE',
  'APPROVER_ESTIMATOR_ROLE',
  'APPROVER_SUPERVISOR_ROLE',
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

const service = {
  checkPermission,
  checkRolePermission,
  getAll,
  create,
  remove,
};

export default service;
