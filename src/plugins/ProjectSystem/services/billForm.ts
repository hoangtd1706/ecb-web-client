import axios from 'axios';

const apiUrl = '/api/project-system/billForms';

export type BillFormModel = {
  billFormCode: string;
  projectCode: string;
  billFormName: string;
  beginRow: number;
  endRow: number;
  billCodeCol: number;
  totalCol: number;
  previousCol: number;
  actualCol: number;
  fileName: string;
}

function getAll(projectCode: string): Promise<BillFormModel[]> {
  return axios.get(`${apiUrl}?projectCode=${projectCode}`);
}

function create(projectCode: string, model: BillFormModel): Promise<unknown> {
  return axios.post(`${apiUrl}?projectCode=${projectCode}`, model);
}

function edit(projectCode: string, model: BillFormModel): Promise<unknown> {
  return axios.put(`${apiUrl}?projectCode=${projectCode}`, model);
}

function remove(projectCode: string, billFormCode: string): Promise<unknown> {
  return axios.delete(`${apiUrl}?projectCode=${projectCode}&billFormCode=${billFormCode}`);
}

function attach(projectCode: string,billFormCode: string, file: File): Promise<unknown> {
  const formData = new FormData();
  formData.append('files', file, file.name);

  return axios.post(
    `${apiUrl}/attach?projectCode=${projectCode}&billFormCode=${billFormCode}`,
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
  attach,
};

export default service;
