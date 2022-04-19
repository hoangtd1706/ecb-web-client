import {
  Actions,
  GET_CONTRACT_DETAIL_FAILURE,
  GET_CONTRACT_DETAIL_SUCCESS,
} from './constant';
import { ContractDetailState, initialState } from './types';

export default function reducer(state = initialState, action: Actions): ContractDetailState {
  switch (action.type) {
    case GET_CONTRACT_DETAIL_SUCCESS:
      return {
        contract: action.payload.contract,
      };

    case GET_CONTRACT_DETAIL_FAILURE:
      return initialState;

    default:
      return state;
  }
}
