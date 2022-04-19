import React, { createContext } from 'react';
import reducer from './reducers';
import { IssueDetailStore, initialState, defaultStore } from './types';
import { AddActivityModel, RequestModel } from '../../services/activity';
import action from './actions';

type IssueDetailProviderProps = {
  children: JSX.Element | JSX.Element[];
}

export const IssueDetailContext = createContext(defaultStore);

export default function IssueDetailProvider({ children }: IssueDetailProviderProps): JSX.Element {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  const getIssueDetail = (issueId: number) => {
    action.getIssueDetail(issueId, dispatch);
  };

  const createActivity = (issueId: number, actionCode: number, model: AddActivityModel) => {
    action.createActivity(issueId, actionCode, model, dispatch)
  }

  const createRequest = (issueId: number, model: RequestModel) => {
    action.createRequest(issueId, model, dispatch);
  }

  const attach = (issueId: number, file: File) => {
    action.attach(issueId, file, dispatch);
  }

  const store: IssueDetailStore = {
    state,
    getIssueDetail,
    createActivity,
    createRequest,
    attach,
  };

  return (
    <IssueDetailContext.Provider value={store}>
      {children}
    </IssueDetailContext.Provider>
  );
}
