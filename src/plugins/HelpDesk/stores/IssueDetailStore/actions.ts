import { Dispatch } from 'react';

import {
  alertActions,
  loadingActions,
  alertMessage,
  store,
} from '../../../../core';

import activityService, {
  ActivityModel,
  AddActivityModel,
  RequestModel,
} from '../../services/activity';
import issueService,
{
  IssueModel,
} from '../../services/issue';
import {
  Actions,
  GET_ISSUE_DETAIL_FAILURE,
  GET_ISSUE_DETAIL_SUCCESS,
} from './constant';
import issueConstants from '../../constants/issue';

const getIssueDetail = async (
  issueId: number,
  dispatch: Dispatch<Actions>
): Promise<void> => {
  function success(
    issue: IssueModel,
    activities: ActivityModel[],
    validActions: number[],
  ): Actions {
    return {
      type: GET_ISSUE_DETAIL_SUCCESS,
      payload: {
        issue: issue,
        activities: activities,
        validActions: validActions,
      }
    };
  }
  function fail(): Actions { return { type: GET_ISSUE_DETAIL_FAILURE }; }

  store.dispatch(loadingActions.show());
  Promise.all([issueService.getById(issueId), activityService.getAll(issueId), activityService.getValidActions(issueId)])
    .then((res) => {
      dispatch(success(res[0], res[1], res[2]));
    })
    .catch(() => {
      dispatch(fail());
      store.dispatch(alertActions.show(alertMessage.FETCH_FAILURE, 'error'));
    })
    .finally(() => {
      store.dispatch(loadingActions.hide());
    })
};

const createActivity = async (
  issueId: number,
  actionCode: number,
  model: AddActivityModel,
  dispatch: Dispatch<Actions>
): Promise<void> => {
  const { actions } = issueConstants;

  if (actions[actionCode].needContent && (model.content === '')) {
    store.dispatch(alertActions.show('Nội dung không được để trống!', 'error'));
  }
  else {
    store.dispatch(loadingActions.show());
    try {
      await activityService.create(issueId, actions[actionCode].apiUrl, model);
      store.dispatch(alertActions.show(alertMessage.ACTION_SUCCESS, 'success'));
      getIssueDetail(issueId, dispatch);
    }
    catch {
      store.dispatch(alertActions.show(alertMessage.ACTION_FAILURE, 'error'));
      store.dispatch(loadingActions.hide());
    }
  }
};

const createRequest = async (
  issueId: number,
  model: RequestModel,
  dispatch: Dispatch<Actions>
): Promise<void> => {

  store.dispatch(loadingActions.show());
  try {
    await activityService.createRequest(issueId, model);
    store.dispatch(alertActions.show(alertMessage.ACTION_SUCCESS, 'success'));
    getIssueDetail(issueId, dispatch);
  }
  catch {
    store.dispatch(alertActions.show(alertMessage.ACTION_FAILURE, 'error'));
    store.dispatch(loadingActions.hide());
  }
};

const attach = async (
  issueId: number,
  file: File,
  dispatch: Dispatch<Actions>
): Promise<void> => {

  store.dispatch(loadingActions.show());
  try {
    await activityService.attach(issueId, file);
    store.dispatch(alertActions.show(alertMessage.ACTION_SUCCESS, 'success'));
    getIssueDetail(issueId, dispatch);
  }
  catch {
    store.dispatch(alertActions.show(alertMessage.ACTION_FAILURE, 'error'));
    store.dispatch(loadingActions.hide());
  }
};

const actions = {
  getIssueDetail,
  createActivity,
  createRequest,
  attach,
};

export default actions;
