import axios from 'axios';
import {
  TrackingChangeModel,
} from './common';

import {
  ElementModel,
  CommittedElementModel,
} from './element';

import {
  ClusterViewModel,
  CommittedClusterModel,
} from './cluster';

import {
  ElementClusterViewModel,
  CommittedElementClusterModel,
} from './elementCluster';

import {
  ItemViewModel,
  CommittedItemModel,
} from './item';

import {
  ResourceViewModel,
  CommittedResourceModel,
} from './resource';

import {
  ConfirmationModel,
  CommittedConfirmationModel,
} from '../services/confirmation';

const apiUrl = '/api/project-system/commits';

export type PlannerTrackingChangeModel = {
  elements: TrackingChangeModel<ElementModel>[];
}

export type DesignerTrackingChangeModel = {
  clusters: TrackingChangeModel<ClusterViewModel>[];
  elementClusters: TrackingChangeModel<ElementClusterViewModel>[];
  items: TrackingChangeModel<ItemViewModel>[];
}

export type EstimatorTrackingChangeModel = {
  resources: TrackingChangeModel<ResourceViewModel>[];
}

export type SupervisorTrackingChangeModel = {
  confirmations: TrackingChangeModel<ConfirmationModel>[];
}

export type Commit = {
  number: number;
  projectCode: string;
  branch: number;
  description: string;
  createdBy: string;
  createdByFullName: string;
  createdTime: Date;
}

export type PlannerCommit = {
  elements: CommittedElementModel[];
}

export type DesignerCommit = {
  clusters: CommittedClusterModel[];
  elementClusters: CommittedElementClusterModel[];
  items: CommittedItemModel[];
}

export type EstimatorCommit = {
  resources: CommittedResourceModel[];
}

export type SupervisorCommit = {
  confirmations: CommittedConfirmationModel[];
}

export type AddCommitModel<T> = {
  header: Commit;
  detail: T;
}

function plannerTrackingChange(projectCode: string): Promise<PlannerTrackingChangeModel> {
  return axios.get(`${apiUrl}/planner-tracking-change?projectCode=${projectCode}`);
}

function designerTrackingChange(projectCode: string): Promise<DesignerTrackingChangeModel> {
  return axios.get(`${apiUrl}/designer-tracking-change?projectCode=${projectCode}`);
}

function estimatorTrackingChange(projectCode: string): Promise<EstimatorTrackingChangeModel> {
  return axios.get(`${apiUrl}/estimator-tracking-change?projectCode=${projectCode}`);
}

function supervisorTrackingChange(projectCode: string): Promise<SupervisorTrackingChangeModel> {
  return axios.get(`${apiUrl}/supervisor-tracking-change?projectCode=${projectCode}`);
}

function plannerCommit(projectCode: string, data: AddCommitModel<PlannerCommit>): Promise<unknown> {
  return axios.post(`${apiUrl}/planner-commit?projectCode=${projectCode}`, data);
}

function designerCommit(projectCode: string, data: AddCommitModel<DesignerCommit>): Promise<unknown> {
  return axios.post(`${apiUrl}/designer-commit?projectCode=${projectCode}`, data);
}

function estimatorCommit(projectCode: string, data: AddCommitModel<EstimatorCommit>): Promise<unknown> {
  return axios.post(`${apiUrl}/estimator-commit?projectCode=${projectCode}`, data);
}

function supervisorCommit(projectCode: string, data: AddCommitModel<SupervisorCommit>): Promise<unknown> {
  return axios.post(`${apiUrl}/supervisor-commit?projectCode=${projectCode}`, data);
}

const service = {
  plannerTrackingChange,
  designerTrackingChange,
  estimatorTrackingChange,
  supervisorTrackingChange,
  plannerCommit,
  designerCommit,
  estimatorCommit,
  supervisorCommit,
};

export default service;
