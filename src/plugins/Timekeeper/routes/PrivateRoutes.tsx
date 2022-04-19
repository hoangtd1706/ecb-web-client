import React from 'react';
import {
  Switch,
  Route,
  useRouteMatch,
} from 'react-router-dom';

import Settings from '../pages/Settings';
import Users from '../pages/Users';

export default function PrivateRoutes(): JSX.Element {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route path={`${path}/settings`} component={Settings} />
      <Route path={`${path}/users`} component={Users} />
    </Switch>
  );
}
