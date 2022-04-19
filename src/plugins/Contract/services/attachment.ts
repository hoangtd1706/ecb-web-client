import axios from 'axios';

const apiUrl = (contractNumber: string) => `/api/contract/contracts/${contractNumber}/attachments`;

function create(contractNumber: string, files: File[], privateFiles: File[]): Promise<unknown> {
  const formData = new FormData();
  files.map(file => {
    formData.append('files', file, file.name);
    return true;
  });

  privateFiles.map(file => {
    formData.append('privateFiles', file, file.name);
    return true;
  });

  return axios.post(
    `${apiUrl(contractNumber)}`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
}

function remove(contractNumber: string, id: number): Promise<unknown> {
  return axios.delete(`${apiUrl(contractNumber)}/${id}`);
}

const service = {
  create,
  remove,
};

export default service;
