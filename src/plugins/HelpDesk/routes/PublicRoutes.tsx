import React from 'react';
import {
  Route,
  Switch,
  useRouteMatch,
} from 'react-router-dom';

import CreateIssue from '../pages/CreateIssue';
import Issues from '../pages/Issues';
import IssueDetail from '../pages/IssueDetail';

export default function PublicRoutes(): JSX.Element {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route path={`${path}/create-issue`} component={CreateIssue} />
      <Route path={`${path}/list/:filter`} component={Issues} />
      <Route path={`${path}/issues/:issueId`} component={IssueDetail} />
    </Switch>
  );
}
