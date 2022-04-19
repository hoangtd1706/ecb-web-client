import React, { createContext } from 'react';
import { UpdateNetPriceModel } from '../../services/contract';
import { CreateRequestModel, ActionRequestModel } from '../../services/request';
import reducer from './reducers';
import { ContractDetailStore, initialState, defaultStore } from './types';
import action from './actions';

type ContractDetailProviderProps = {
  children: JSX.Element | JSX.Element[];
}

export const ContractDetailContext = createContext(defaultStore);

export default function ContractDetailProvider({ children }: ContractDetailProviderProps): JSX.Element {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  const getContractDetail = (contractNumber: string) => {
    action.getContractDetail(contractNumber, dispatch);
  };

  const create = (contractNumber: string, model: CreateRequestModel) => {
    action.create(contractNumber, model, dispatch);
  };

  const cancel = (contractNumber: string, model: ActionRequestModel) => {
    action.cancel(contractNumber, model, dispatch);
  };

  const check = (contractNumber: string, model: ActionRequestModel) => {
    action.check(contractNumber, model, dispatch);
  };

  const reject = (contractNumber: string, model: ActionRequestModel) => {
    action.reject(contractNumber, model, dispatch);
  };

  const approve = (contractNumber: string, model: ActionRequestModel) => {
    action.approve(contractNumber, model, dispatch);
  };

  const updateNetPrice = (contractNumber: string, model: UpdateNetPriceModel) => {
    action.updateNetPrice(contractNumber, model, dispatch);
  };

  const createAttachment = (contractNumber: string, files: File[], privateFiles: File[]) => {
    action.createAttachment(contractNumber, files, privateFiles, dispatch);
  };

  const removeAttachment = (contractNumber: string, id: number) => {
    action.removeAttachment(contractNumber, id, dispatch);
  };

  const store: ContractDetailStore = {
    state,
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

  return (
    <ContractDetailContext.Provider value={store}>
      {children}
    </ContractDetailContext.Provider>
  );
}
