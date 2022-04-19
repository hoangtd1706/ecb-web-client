import {
  SHOW_ALERT,
  HIDE_ALERT,
  AlertActions,
} from '../constants/alert';

import { AlertState } from '../types';

const initialState: AlertState = {
  show: false,
  text: '',
  severity: 'success',
};

export default function reducer(state = initialState, action: AlertActions): AlertState {
  switch (action.type) {
    case SHOW_ALERT:
      return {
        show: true,
        severity: action.payload.severity,
        text: action.payload.text,
      };

    case HIDE_ALERT:
      return {
        ...state,
        show: false,
      };

    default:
      return state;
  }
}
