import axios from 'axios';

import {
  AddFromExcelModel,
} from './common';

const apiUrl = '/api/project-system/clusters';

export type ClusterBase = {
  code: string;
  description: string;
  note: string;
  filePath: string;
  projectCode: string;
}

export type ClusterModel = ClusterBase & {
  versionNumber: number;
}

export type CommittedClusterModel = ClusterBase & {
  commitNumber: number;
  status: number;
}

export type ClusterViewModel = ClusterModel & {
  elementCount: number;
  itemCount: number;
}

function getAll(projectCode: string, version: number): Promise<ClusterViewModel[]> {
  return axios.get(`${apiUrl}?projectCode=${projectCode}&version=${version}`);
}

function getSimple(projectCode: string, version: number): Promise<ClusterModel[]> {
  return axios.get(`${apiUrl}/simple?projectCode=${projectCode}&version=${version}`);
}

function create(projectCode: string, model: ClusterModel): Promise<unknown> {
  return axios.post(`${apiUrl}?projectCode=${projectCode}`, model);
}

function edit(projectCode: string, clusterCode: string, model: ClusterModel): Promise<unknown> {
  return axios.put(`${apiUrl}?projectCode=${projectCode}&clusterCode=${clusterCode}`, model);
}

function remove(projectCode: string, clusterCodes: string[]): Promise<unknown> {
  return axios.post(`${apiUrl}/delete?projectCode=${projectCode}`, clusterCodes);
}

function addFromExcel(projectCode: string, file: File): Promise<AddFromExcelModel<ClusterModel>[]> {
  const formData = new FormData();
  formData.append('files', file, file.name);

  return axios.post(
    `${apiUrl}/addFromExcel?projectCode=${projectCode}`,
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
  getSimple,
  create,
  edit,
  remove,
  addFromExcel,
};

export default service;
