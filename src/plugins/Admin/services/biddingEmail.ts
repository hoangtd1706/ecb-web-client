import axios from 'axios';

const apiUrl = '/api/configuration/biddingEmailConfig';

export type BiddingEmailConfigModel = {
  from: string,
  smtpServer: string,
  port: number,
  userName: string,
  password: string
}

function get(): Promise<BiddingEmailConfigModel> {
  return axios.get(apiUrl);
}

function set(model: BiddingEmailConfigModel): Promise<unknown> {
  return axios.post(apiUrl, model);
}

const service = {
  get,
  set,
};

export default service;
