import {
  Actions,
  GET_ISSUE_DETAIL_FAILURE,
  GET_ISSUE_DETAIL_SUCCESS,
} from './constant';
import { IssueDetailState, initialState } from './types';

export default function reducer(state = initialState, action: Actions): IssueDetailState {
  switch (action.type) {
    case GET_ISSUE_DETAIL_SUCCESS:
      return {
        issue: action.payload.issue,
        activities: action.payload.activities,
        validActions: action.payload.validActions,
      };

    case GET_ISSUE_DETAIL_FAILURE:
      return initialState;

    default:
      return state;
  }
}
