import axios from 'axios';

const apiUrl = '/api/configuration/emailConfig';

export type EmailConfigModel = {
  from: string,
  smtpServer: string,
  port: number,
  userName: string,
  password: string
}

function get(): Promise<EmailConfigModel> {
  return axios.get(apiUrl);
}

function set(model: EmailConfigModel): Promise<unknown> {
  return axios.post(apiUrl, model);
}

const service = {
  get,
  set,
};

export default service;
