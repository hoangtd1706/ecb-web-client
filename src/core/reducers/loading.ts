import {
  SHOW_LOADING,
  HIDE_LOADING,
  LoadingActions,
} from '../constants/loading';

import { LoadingState } from '../types';

const initialState: LoadingState = false;

export default function reducer(state = initialState, action: LoadingActions): LoadingState {
  switch (action.type) {
    case SHOW_LOADING:
      return true;

    case HIDE_LOADING:
      return false;

    default:
      return state;
  }
}
