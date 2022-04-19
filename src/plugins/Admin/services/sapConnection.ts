import axios from 'axios';

const apiUrl = '/api/configuration/sapConnectionConfig';

export type SapConnectionConfigModel = {
  url: string;
  client: string;
  username: string;
  password: string;
}

function get(): Promise<SapConnectionConfigModel> {
  return axios.get(apiUrl);
}

function set(model: SapConnectionConfigModel): Promise<unknown> {
  return axios.post(apiUrl, model);
}

const service = {
  get,
  set,
};

export default service;
