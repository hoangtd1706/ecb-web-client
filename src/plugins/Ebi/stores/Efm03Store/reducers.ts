import {
  Actions,
  CHANGE_TITLE,
  FETCH_DATA_FAILURE,
  FETCH_DATA_SUCCESS,
} from './constant';
import { Efm03State, initialState } from './types';

export default function reducer(state = initialState, action: Actions): Efm03State {
  switch (action.type) {
    case CHANGE_TITLE:
      return {
        ...state,
        title: action.payload.text,
      };

    case FETCH_DATA_SUCCESS:
      return {
        ...state,
        reportData: action.payload.data,
      }

    case FETCH_DATA_FAILURE:
      return {
        ...state,
        reportData: initialState.reportData,
      }

    default:
      return state;
  }
}
