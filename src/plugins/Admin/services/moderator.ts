import axios from 'axios';

const apiUrl = (module: string) => `/api/${module}/moderators`

export type ModeratorModel = {
  userNumber: string;
  role: string;
}

function getModerators(module: string): Promise<ModeratorModel[]> {
  return axios.get(apiUrl(module));
}

function createModerator(module: string, userNumber: string): Promise<unknown> {
  return axios.post(`${apiUrl(module)}/createMod/${userNumber}`);
}

function removeModerator(module: string, userNumber: string): Promise<unknown> {
  return axios.delete(`${apiUrl(module)}/removeMod/${userNumber}`);
}

const service = {
  getModerators,
  createModerator,
  removeModerator,
};

export default service;
