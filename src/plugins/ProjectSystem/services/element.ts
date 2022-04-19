import axios from 'axios';

import {
  AddFromExcelModel,
} from './common';

const apiUrl = '/api/project-system/elements';

export type ElementBase = {
  code: string;
  level: number;
  description: string;
  start: Date;
  finish: Date;
  projectCode: string;
}

export type ElementModel = ElementBase & {
  versionNumber: number;
}

export type CommittedElementModel = ElementBase & {
  commitNumber: number;
  status: number;
}

export type Breadcrumb = {
  text: string;
  code: string;
  level: number;
}

export type ChildrenElement = ElementModel & {
  isLeaf: boolean;
}

export type ElementViewModel = ElementModel & {
  breadcrumbs: Breadcrumb[];
  children: ChildrenElement[];
}

function getAll(projectCode: string, version: number): Promise<ElementModel[]> {
  return axios.get(`${apiUrl}?projectCode=${projectCode}&version=${version}`);
}

function getDetail(projectCode: string, version: number, elementCode = ''): Promise<ElementViewModel> {
  return elementCode === '' ? axios.get(`${apiUrl}/get-detail?projectCode=${projectCode}&version=${version}`) :
    axios.get(`${apiUrl}/get-detail?projectCode=${projectCode}&version=${version}&elementCode=${elementCode}`);
}

function getLeaf(projectCode: string, version: number): Promise<ElementModel[]> {
  return axios.get(`${apiUrl}/get-leaf?projectCode=${projectCode}&version=${version}`);
}

function remove(projectCode: string, elementCodes: string[]): Promise<unknown> {
  return axios.post(`${apiUrl}/delete?projectCode=${projectCode}`, elementCodes);
}

function addFromExcel(projectCode: string, file: File): Promise<AddFromExcelModel<ElementModel>[]> {
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
  getDetail,
  getLeaf,
  remove,
  addFromExcel,
};

export default service;
