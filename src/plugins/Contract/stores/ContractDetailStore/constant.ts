import { ContractDetailModel } from '../../services/contract';

export const GET_CONTRACT_DETAIL_SUCCESS = 'GET_CONTRACT_DETAIL_SUCCESS';
export const GET_CONTRACT_DETAIL_FAILURE = 'GET_CONTRACT_DETAIL_FAILURE';

interface GetContractSuccessAction {
  type: typeof GET_CONTRACT_DETAIL_SUCCESS,
  payload: {
    contract: ContractDetailModel,
  }
}

interface GetContractFailureAction {
  type: typeof GET_CONTRACT_DETAIL_FAILURE,
}

export type Actions =
  GetContractSuccessAction |
  GetContractFailureAction;
