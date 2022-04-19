import axios from 'axios';

import {
  AddFromExcelModel,
} from './common';

const apiUrl = '/api/project-system/elementClusters';

export type ElementClusterBase = {
  elementCode: string;
  clusterCode: string;
  quantity: number;
  projectCode: string;
}

export type ElementClusterModel = ElementClusterBase & {
  versionNumber: number;
}

export type CommittedElementClusterModel = ElementClusterBase & {
  commitNumber: number;
  status: number;
}

export type ElementClusterViewModel = ElementClusterModel & {
  elementDescription: string;
  clusterDescription: string;
}

export type ElementClusterRemoveModel = {
  elementCode: string;
  clusterCode: string;
}

function getAll(projectCode: string, version: number): Promise<ElementClusterViewModel[]> {
  return axios.get(`${apiUrl}?projectCode=${projectCode}&version=${version}`);
}

function create(projectCode: string, model: ElementClusterModel): Promise<unknown> {
  return axios.post(`${apiUrl}?projectCode=${projectCode}`, model);
}

function edit(projectCode: string, elementCode: string, clusterCode: string, model: ElementClusterModel): Promise<unknown> {
  return axios.put(`${apiUrl}?projectCode=${projectCode}&elementCode=${elementCode}&clusterCode=${clusterCode}`, model);
}

function remove(projectCode: string, models: ElementClusterRemoveModel[]): Promise<unknown> {
  return axios.post(`${apiUrl}/delete?projectCode=${projectCode}`, models);
}

function addFromExcel(projectCode: string, file: File): Promise<AddFromExcelModel<ElementClusterModel>[]> {
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
  create,
  edit,
  remove,
  addFromExcel,
};

export default service;
