import { SummaryReport } from '../../services/efm03';

export const CHANGE_TITLE = 'CHANGE_TITLE';

export const FETCH_DATA_SUCCESS = 'FETCH_DATA_SUCCESS';
export const FETCH_DATA_FAILURE = 'FETCH_DATA_FAILURE';

interface ChangeTitleAction {
  type: typeof CHANGE_TITLE,
  payload: {
    text: string,
  }
}

interface FetchDataSuccessAction {
  type: typeof FETCH_DATA_SUCCESS,
  payload: {
    data: SummaryReport,
  }
}

interface FetchDataFailureAction {
  type: typeof FETCH_DATA_FAILURE,
}

export type Actions =
  ChangeTitleAction |
  FetchDataSuccessAction |
  FetchDataFailureAction;
