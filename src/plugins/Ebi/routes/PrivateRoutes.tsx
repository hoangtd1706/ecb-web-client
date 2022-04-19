import React from 'react';
import {
  Switch,
  Route,
  useRouteMatch,
} from 'react-router-dom';

import Settings from '../pages/Settings';
import Users from '../pages/Users';
import PfmUsers from '../pages/PfmUsers';
import EnterpriseUsers from '../pages/EnterpriseUsers';

export default function PrivateRoutes(): JSX.Element {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route path={`${path}/settings`} component={Settings} />
      <Route path={`${path}/enterprise-users`} component={EnterpriseUsers} />
      <Route path={`${path}/users`} component={Users} />
      <Route path={`${path}/pfm-users`} component={PfmUsers} />
    </Switch>
  );
}
