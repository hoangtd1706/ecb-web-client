import axios from 'axios';

const apiUrl = '/api/admin';

function check(): Promise<boolean> {
  return axios.get(apiUrl);
}

const service = {
  check,
};

export default service;
