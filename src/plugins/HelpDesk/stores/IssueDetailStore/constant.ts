import { ActivityModel } from '../../services/activity';
import { IssueModel } from '../../services/issue';

export const GET_ISSUE_DETAIL_SUCCESS = 'GET_ISSUE_DETAIL_SUCCESS';
export const GET_ISSUE_DETAIL_FAILURE = 'GET_ISSUE_DETAIL_FAILURE';

interface GetIssueSuccessAction {
  type: typeof GET_ISSUE_DETAIL_SUCCESS,
  payload: {
    issue: IssueModel,
    activities: ActivityModel[],
    validActions: number[],
  }
}

interface GetIssueFailureAction {
  type: typeof GET_ISSUE_DETAIL_FAILURE,
}

export type Actions =
  GetIssueSuccessAction |
  GetIssueFailureAction;
