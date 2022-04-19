import {
  Actions,
  LOGIN_REQUEST,
  LOGIN_FAILURE,
  LOGOUT,
  VERIFY_REQUEST,
  VERIFY_FAILURE,
  VERIFY_SUCCESS,
} from '../constants/auth';

import { AuthState } from '../types';

const initialState: AuthState = {
  isLoading: false,
  isError: false,
  errorMessage: '',
  isVerifying: true,
  user: null,
};

export default function reducer(state = initialState, action: Actions): AuthState {
  switch (action.type) {
    case LOGIN_REQUEST:
      return { 
        ...initialState,
        isLoading: true,
      };

    case LOGIN_FAILURE:
      return {
        ...state,
        isLoading: false,
        isError: true,
        errorMessage: action.error,
      };

    case VERIFY_REQUEST:
      return {
        ...initialState,
        isVerifying: true,
      };

    case VERIFY_SUCCESS:
      return {
        ...state,
        isVerifying: false,
        user: action.payload,
      };

    case VERIFY_FAILURE:
      return {
        ...initialState,
        isVerifying: false,
      };

    case LOGOUT:
      return {
        ...initialState,
        isVerifying: false,
      };

    default:
      return state;
  }
}
