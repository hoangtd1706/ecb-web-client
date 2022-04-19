import React from 'react';
import {
  Switch,
  Route,
  useRouteMatch,
} from 'react-router-dom';

import Settings from '../pages/Settings';
import Viewers from '../pages/Viewers';
import Creators from '../pages/Creators';

export default function PrivateRoutes(): JSX.Element {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route path={`${path}/settings`} component={Settings} />
      <Route path={`${path}/viewers`} component={Viewers} />
      <Route path={`${path}/creators`} component={Creators} />
    </Switch>
  );
}
