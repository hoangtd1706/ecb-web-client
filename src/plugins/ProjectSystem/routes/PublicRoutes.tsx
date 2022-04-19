import React from 'react';
import {
  Route,
  Switch,
  useRouteMatch,
} from 'react-router-dom';

import Dashboard from '../pages/Dashboard';
import ServiceMasters from '../pages/ServiceMasters';
import Materials from '../pages/Materials';

export default function PublicRoutes(): JSX.Element {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route path={`${path}/dashboard`} component={Dashboard} />
      <Route path={`${path}/service-masters`} component={ServiceMasters} />
      <Route path={`${path}/materials`} component={Materials} />
    </Switch>
  );
}
