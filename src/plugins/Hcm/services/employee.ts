import axios from 'axios';

const apiUrl = '/api/hcm/employees';

export type UserModel = AddUserModel & {
  isActive: boolean;
}

export type AddUserModel = {
  number: string;
  fullName: string;
  email: string;
}

export type AddUserFromExcelModel = {
  number: string;
  fullName: string;
  email: string;
  isAdded: string;
  message: string;
}

function getAll(): Promise<UserModel[]> {
  return axios.get(apiUrl);
}

function create(model: AddUserModel): Promise<unknown> {
  return axios.post(`${apiUrl}/addUser`, model);
}

function lock(number: string): Promise<unknown> {
  return axios.put(`${apiUrl}/lockUser/${number}`);
}

function unLock(number: string): Promise<unknown> {
  return axios.put(`${apiUrl}/unLockUser/${number}`);
}

function reset(number: string): Promise<unknown> {
  return axios.put(`${apiUrl}/resetUser/${number}`);
}

function addUserFromExcel(file: File): Promise<AddUserFromExcelModel[]> {
  const formData = new FormData();
  formData.append('files', file, file.name);

  return axios.post(
    `${apiUrl}/addFromExcel`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );
}

const service = {
  getAll,
  create,
  lock,
  unLock,
  reset,
  addUserFromExcel,
};

export default service;
