import axios from 'axios';

const apiUrl = '/api/bidding/materials';

export type MaterialModel = {
  code: string;
  description: string;
  unit: string;
  optionUnit: string;
}

export type AddFromExcelModel = {
  code: string;
  isAdded: string;
  message: string;
}

function getAll(): Promise<MaterialModel[]> {
  return axios.get(apiUrl);
}

function create(model: MaterialModel): Promise<number> {
  return axios.post(apiUrl, model);
}

function edit(code: string, model: MaterialModel): Promise<unknown> {
  return axios.put(`${apiUrl}/${code}`, model);
}

function remove(code: string): Promise<unknown> {
  return axios.delete(`${apiUrl}/${code}`);
}

function addFromExcel(file: File): Promise<AddFromExcelModel[]> {
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
  edit,
  remove,
  addFromExcel,
};

export default service;
