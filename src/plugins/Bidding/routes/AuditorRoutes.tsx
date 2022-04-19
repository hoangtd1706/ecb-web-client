import React from 'react';
import {
  Switch,
  Route,
  useRouteMatch,
} from 'react-router-dom';

import AuditorPackages from '../pages/AuditorPackages';
import PackageDetail from '../pages/PackageDetail';

export default function AuditorRoutes(): JSX.Element {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route path={`${path}/package-list/:status`} component={AuditorPackages} />
      <Route path={`${path}/package/:packageCode`} component={PackageDetail} />
    </Switch>
  );
}
