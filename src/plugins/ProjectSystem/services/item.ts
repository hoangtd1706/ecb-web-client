import axios from 'axios';

import {
  AddFromExcelModel,
} from './common';

const apiUrl = '/api/project-system/items';

export type ItemBase = {
  clusterCode: string;
  serviceMasterCode: string;
  billCode: string;
  quantity: number;
  projectCode: string;
}

export type ItemModel = ItemBase & {
  versionNumber: number;
}

export type CommittedItemModel = ItemBase & {
  commitNumber: number;
  status: number;
}

export type ItemViewModel = ItemModel & {
  serviceMasterDescription: string;
  serviceMasterUnit: string;
  clusterDescription: string;
}

export type ItemRemoveModel = {
  clusterCode: string;
  serviceMasterCode: string;
}

function getAll(projectCode: string, version: number): Promise<ItemViewModel[]> {
  return axios.get(`${apiUrl}?projectCode=${projectCode}&version=${version}`);
}

function getDistinct(projectCode: string, version: number): Promise<ItemViewModel[]> {
  return axios.get(`${apiUrl}/get-distinct?projectCode=${projectCode}&version=${version}`);
}

function getCollective(projectCode: string, version: number): Promise<ItemViewModel[]> {
  return axios.get(`${apiUrl}/get-collective?projectCode=${projectCode}&version=${version}`);
}

function create(projectCode: string, model: ItemModel): Promise<unknown> {
  return axios.post(`${apiUrl}?projectCode=${projectCode}`, model);
}

function edit(projectCode: string, serviceMasterCode: string, clusterCode: string, model: ItemModel): Promise<unknown> {
  return axios.put(`${apiUrl}?projectCode=${projectCode}&serviceMasterCode=${serviceMasterCode}&clusterCode=${clusterCode}`, model);
}

function remove(projectCode: string, models: ItemRemoveModel[]): Promise<unknown> {
  return axios.post(`${apiUrl}/delete?projectCode=${projectCode}`, models);
}

function addFromExcel(projectCode: string, file: File): Promise<AddFromExcelModel<ItemModel>[]> {
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
  getCollective,
  getDistinct,
  create,
  edit,
  remove,
  addFromExcel,
};

export default service;
