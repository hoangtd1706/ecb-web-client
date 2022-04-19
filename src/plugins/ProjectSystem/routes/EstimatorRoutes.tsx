import React from 'react';
import {
  Switch,
  Route,
  useRouteMatch,
} from 'react-router-dom';

import CbsReport from '../pages/CbsReport';
import EstimatorCommits from '../pages/EstimatorCommits';
import Resources from '../pages/Resources';

export default function EstimatorRoutes(): JSX.Element {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route path={`${path}/resources`} component={Resources} />
      <Route path={`${path}/commits`} component={EstimatorCommits} />
      <Route path={`${path}/cbs-report`} component={CbsReport} />
    </Switch>
  );
}
