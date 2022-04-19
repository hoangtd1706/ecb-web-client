import axios from 'axios';

const apiUrl = '/api/ebi/moderators';

function checkPermission(): Promise<boolean> {
  return axios.get(`${apiUrl}/checkPermission`);
}

const service = {
  checkPermission,
};

export default service;
