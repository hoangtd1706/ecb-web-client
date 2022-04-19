import React from 'react';
import {
  Switch,
  Route,
  useRouteMatch,
} from 'react-router-dom';

import Modules from '../pages/Modules';
import Supporters from '../pages/Supporters';
import Users from '../pages/Users';
import Settings from '../pages/Settings';

export default function PrivateRoutes(): JSX.Element {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route exact path={`${path}/modules`} component={Modules} />
      <Route path={`${path}/modules/:moduleId`} component={Supporters} />
      <Route path={`${path}/users`} component={Users} />
      <Route path={`${path}/settings`} component={Settings} />
    </Switch>
  );
}
