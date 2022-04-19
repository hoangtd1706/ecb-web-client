import React from 'react';
import {
  Switch,
  Route,
  useRouteMatch,
} from 'react-router-dom';

import Confirmations from '../pages/Confirmations';
import SupervisorCommits from '../pages/SupervisorCommits';

export default function SupervisorRoutes(): JSX.Element {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route path={`${path}/confirmations`} component={Confirmations} />
      <Route path={`${path}/commits`} component={SupervisorCommits} />
    </Switch>
  );
}
