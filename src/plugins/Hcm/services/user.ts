import axios from 'axios';

const apiUrl = '/api/hcm/users';

function checkPermission(): Promise<boolean> {
  return axios.get(`${apiUrl}/checkPermission`);
}

const service = {
  checkPermission,
};

export default service;
