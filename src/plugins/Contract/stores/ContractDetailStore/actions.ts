import { Dispatch } from 'react';

import {
  alertActions,
  loadingActions,
  alertMessage,
  store,
} from '../../../../core';

import contractService,
{
  ContractDetailModel,
  UpdateNetPriceModel,
} from '../../services/contract';
import requestService,
{
  CreateRequestModel,
  ActionRequestModel,
} from '../../services/request';
import attachmentService from '../../services/attachment';
import {
  Actions,
  GET_CONTRACT_DETAIL_FAILURE,
  GET_CONTRACT_DETAIL_SUCCESS,
} from './constant';

const getContractDetail = async (
  contractNumber: string,
  dispatch: Dispatch<Actions>
): Promise<void> => {
  function success(
    contract: ContractDetailModel,
  ): Actions {
    return {
      type: GET_CONTRACT_DETAIL_SUCCESS,
      payload: {
        contract: contract,
      }
    };
  }
  function fail(): Actions { return { type: GET_CONTRACT_DETAIL_FAILURE }; }

  store.dispatch(loadingActions.show());
  try {
    const contract = await contractService.getContract(contractNumber);
    dispatch(success(contract));

  }
  catch {
    dispatch(fail());
    store.dispatch(alertActions.show(alertMessage.FETCH_FAILURE, 'error'));
  }
  finally {
    store.dispatch(loadingActions.hide());
  }
};

const create = async (
  contractNumber: string,
  model: CreateRequestModel,
  dispatch: Dispatch<Actions>
): Promise<void> => {
  if (model.content === '') {
    store.dispatch(alertActions.show('Nội dung phê duyệt không được để trống!', 'error'));
    return;
  }
  if (model.steps.find(x => !x.isFinish) === undefined) {
    store.dispatch(alertActions.show('Phải có ít nhất một người kiểm tra!', 'error'));
    return;
  }
  const approver = model.steps.find(x => x.isFinish);
  if (approver === undefined || approver.userNumber === '') {
    store.dispatch(alertActions.show('Chưa có người phê duyệt!', 'error'));
    return;
  }

  store.dispatch(loadingActions.show());
  try {
    await requestService.create(contractNumber, model);
    store.dispatch(alertActions.show(alertMessage.ACTION_SUCCESS, 'success'));
    getContractDetail(contractNumber, dispatch);
  }
  catch {
    store.dispatch(loadingActions.hide());
    store.dispatch(alertActions.show(alertMessage.ACTION_FAILURE, 'error'));
  }
};

const cancel = async (
  contractNumber: string,
  model: ActionRequestModel,
  dispatch: Dispatch<Actions>
): Promise<void> => {

  store.dispatch(loadingActions.show());
  try {
    await requestService.cancel(contractNumber, model);
    store.dispatch(alertActions.show(alertMessage.ACTION_SUCCESS, 'success'));
    getContractDetail(contractNumber, dispatch);
  }
  catch {
    store.dispatch(loadingActions.hide());
    store.dispatch(alertActions.show(alertMessage.ACTION_FAILURE, 'error'));
  }
};

const check = async (
  contractNumber: string,
  model: ActionRequestModel,
  dispatch: Dispatch<Actions>
): Promise<void> => {

  store.dispatch(loadingActions.show());
  try {
    await requestService.check(contractNumber, model);
    store.dispatch(alertActions.show(alertMessage.ACTION_SUCCESS, 'success'));
    getContractDetail(contractNumber, dispatch);
  }
  catch {
    store.dispatch(loadingActions.hide());
    store.dispatch(alertActions.show(alertMessage.ACTION_FAILURE, 'error'));
  }
};

const reject = async (
  contractNumber: string,
  model: ActionRequestModel,
  dispatch: Dispatch<Actions>
): Promise<void> => {

  if (model.content === '') {
    store.dispatch(alertActions.show('Nội dung từ chối không được để trống!', 'error'));
    return;
  }

  store.dispatch(loadingActions.show());
  try {
    await requestService.reject(contractNumber, model);
    store.dispatch(alertActions.show(alertMessage.ACTION_SUCCESS, 'success'));
    getContractDetail(contractNumber, dispatch);
  }
  catch {
    store.dispatch(loadingActions.hide());
    store.dispatch(alertActions.show(alertMessage.ACTION_FAILURE, 'error'));
  }
};

const approve = async (
  contractNumber: string,
  model: ActionRequestModel,
  dispatch: Dispatch<Actions>
): Promise<void> => {

  store.dispatch(loadingActions.show());
  try {
    await requestService.approve(contractNumber, model);
    store.dispatch(alertActions.show(alertMessage.ACTION_SUCCESS, 'success'));
    getContractDetail(contractNumber, dispatch);
  }
  catch {
    store.dispatch(loadingActions.hide());
    store.dispatch(alertActions.show(alertMessage.ACTION_FAILURE, 'error'));
  }
};

const updateNetPrice = async (
  contractNumber: string,
  model: UpdateNetPriceModel,
  dispatch: Dispatch<Actions>
): Promise<void> => {

  store.dispatch(loadingActions.show());
  try {
    await contractService.updateNetPrice(contractNumber, model);
    store.dispatch(alertActions.show(alertMessage.ACTION_SUCCESS, 'success'));
    getContractDetail(contractNumber, dispatch);
  }
  catch {
    store.dispatch(loadingActions.hide());
    store.dispatch(alertActions.show(alertMessage.ACTION_FAILURE, 'error'));
  }
};

const createAttachment = async (
  contractNumber: string,
  files: File[],
  privateFiles: File[],
  dispatch: Dispatch<Actions>
): Promise<void> => {

  const allFiles = [...files, ...privateFiles].map(x => x.name);
  const distinctFiles = Array.from(new Set(allFiles));
  if (allFiles.length !== distinctFiles.length) {
    store.dispatch(alertActions.show('Loại bỏ các file trùng lặp trước khi upload!', 'error'));
    return;
  }

  store.dispatch(loadingActions.show());
  try {
    await attachmentService.create(contractNumber, files, privateFiles);
    store.dispatch(alertActions.show(alertMessage.ACTION_SUCCESS, 'success'));
    getContractDetail(contractNumber, dispatch);
  }
  catch {
    store.dispatch(loadingActions.hide());
    store.dispatch(alertActions.show(alertMessage.ACTION_FAILURE, 'error'));
  }
};

const removeAttachment = async (
  contractNumber: string,
  id: number,
  dispatch: Dispatch<Actions>
): Promise<void> => {

  store.dispatch(loadingActions.show());
  try {
    await attachmentService.remove(contractNumber, id);
    store.dispatch(alertActions.show(alertMessage.ACTION_SUCCESS, 'success'));
    getContractDetail(contractNumber, dispatch);
  }
  catch {
    store.dispatch(loadingActions.hide());
    store.dispatch(alertActions.show(alertMessage.ACTION_FAILURE, 'error'));
  }
};

const actions = {
  getContractDetail,
  create,
  cancel,
  check,
  reject,
  approve,
  updateNetPrice,
  createAttachment,
  removeAttachment,
};

export default actions;
