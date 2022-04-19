import axios from 'axios';

import {
  AddFromExcelModel,
} from './common';

const apiUrl = '/api/project-system/resources';

export type ResourceBase = {
  projectCode: string;
  serviceMasterCode: string;
  materialCode: string;
  quantity: number;
}

export type ResourceModel = ResourceBase & {
  versionNumber: number;
}

export type CommittedResourceModel = ResourceBase & {
  commitNumber: number;
  status: number;
}

export type ResourceViewModel = ResourceModel & {
  serviceMasterDescription: string;
  serviceMasterUnit: string;
  materialDescription: string;
  materialUnit: string;
}

export type CbsModel = {
  elementCode: string;
  elementDescription: string;
  period: number;
  materialGroup: string;
  materialGroupDescription: string;
  materialCode: string;
  description: string;
  unit: string;
  quantity: number;
}

export type ResourceRemoveModel = {
  serviceMasterCode: string;
  materialCode: string;
}

function getAll(projectCode: string, version: number): Promise<ResourceViewModel[]> {
  return axios.get(`${apiUrl}?projectCode=${projectCode}&version=${version}`);
}

function getCbsReport(projectCode: string): Promise<CbsModel[]> {
  return axios.get(`${apiUrl}/get-cbs-report?projectCode=${projectCode}`);
}

function create(projectCode: string, model: ResourceModel): Promise<unknown> {
  return axios.post(`${apiUrl}?projectCode=${projectCode}`, model);
}

function edit(projectCode: string, serviceMasterCode: string, materialCode: string, model: ResourceModel): Promise<unknown> {
  return axios.put(`${apiUrl}?projectCode=${projectCode}&serviceMasterCode=${serviceMasterCode}&materialCode=${materialCode}`, model);
}

function remove(projectCode: string, models: ResourceRemoveModel[]): Promise<unknown> {
  return axios.post(`${apiUrl}/delete?projectCode=${projectCode}`, models);
}

function addFromExcel(projectCode: string, file: File): Promise<AddFromExcelModel<ResourceModel>[]> {
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
  getCbsReport,
  create,
  edit,
  remove,
  addFromExcel,
};

export default service;
