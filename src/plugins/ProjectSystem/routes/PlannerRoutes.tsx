import React from 'react';
import {
  Switch,
  Route,
  useRouteMatch,
} from 'react-router-dom';

import Elements from '../pages/Elements';
import PlannerCommits from '../pages/PlannerCommits';
import PlannerVersions from '../pages/PlannerVersions';
import VersionElements from '../pages/VersionElements';

export default function PlannerRoutes(): JSX.Element {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route path={`${path}/elements`} component={Elements} />
      <Route path={`${path}/commits`} component={PlannerCommits} />
      <Route path={`${path}/versions`} component={PlannerVersions} />
      <Route path={`${path}/version-data/elements/:projectCode/:versionNumber`} component={VersionElements} />
    </Switch>
  );
}
