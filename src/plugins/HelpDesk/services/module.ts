import axios from 'axios';

const apiUrl = '/api/help-desk/modules';

export type ModuleModel = AddModuleModel & {
  id: number;
}

export type AddModuleModel = {
  category: string;
  name: string;
  description: string;
}

function getAll(): Promise<ModuleModel[]> {
  return axios.get(apiUrl);
}

function get(moduleId: number): Promise<ModuleModel> {
  return axios.get(`${apiUrl}/${moduleId}`);
}

function create(model: AddModuleModel): Promise<number> {
  return axios.post(apiUrl, model);
}

function edit(id: number, model: ModuleModel): Promise<unknown> {
  return axios.put(`${apiUrl}/${id}`, model);
}

function remove(id: number): Promise<unknown> {
  return axios.delete(`${apiUrl}/${id}`);
}

const service = {
  getAll,
  get,
  create,
  edit,
  remove,
};

export default service;
