import React from 'react';
import {
  Switch,
  Route,
  useRouteMatch,
} from 'react-router-dom';

import MyContracts from '../pages/MyContracts';

export default function CreatorRoutes(): JSX.Element {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route path={`${path}/list/:status`} component={MyContracts} />
    </Switch>
  );
}
