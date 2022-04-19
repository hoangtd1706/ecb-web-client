import { Dispatch } from 'react';

import {
  alertActions,
  loadingActions,
  alertMessage,
  store,
} from '../../../../core';

import efm03Service, { SummaryReport } from '../../services/efm03';

import {
  Actions,
  CHANGE_TITLE,
  FETCH_DATA_FAILURE,
  FETCH_DATA_SUCCESS,
} from './constant';

const changeTitle = (
  text: string,
  dispatch: Dispatch<Actions>
): void => {
  dispatch({
    type: CHANGE_TITLE,
    payload: {
      text: text,
    }
  })
};

const fetchData = async (dispatch: Dispatch<Actions>): Promise<void> => {

  function success(
    data: SummaryReport,
  ): Actions {
    return {
      type: FETCH_DATA_SUCCESS,
      payload: {
        data: data,
      }
    };
  }
  function fail(): Actions { return { type: FETCH_DATA_FAILURE }; }

  store.dispatch(loadingActions.show());
  try {
    const data = await efm03Service.get();
    dispatch(success(data));
  }
  catch {
    dispatch(fail());
    store.dispatch(alertActions.show(alertMessage.FETCH_FAILURE, 'error'));
  }
  finally {
    store.dispatch(loadingActions.hide());
  }
};

const actions = {
  changeTitle,
  fetchData,
};

export default actions;
