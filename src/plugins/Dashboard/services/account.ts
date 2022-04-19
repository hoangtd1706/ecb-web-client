import axios from 'axios';

export type ChangePasswordModel = {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

function changePassword(model: ChangePasswordModel): Promise<unknown> {
  return axios.post('api/account/changePassword', model);
}

const service = {
  changePassword,
};

export default service;
