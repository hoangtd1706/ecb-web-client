import axios from 'axios';

const apiUrl = '/api/configuration/biddingResetPasswordEmailTemplate';

export type RPEModel = {
  subject: string;
  content: string;
}

function get(): Promise<RPEModel> {
  return axios.get(apiUrl);
}

function set(model: RPEModel): Promise<unknown> {
  return axios.post(apiUrl, model);
}

const service = {
  get,
  set,
};

export default service;
