import React from 'react';
import {
  Switch,
  Route,
  useRouteMatch,
} from 'react-router-dom';

import Contracts from '../pages/Contracts';

export default function ApproverRoutes(): JSX.Element {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route path={`${path}/list/:status`} component={Contracts} />
    </Switch>
  );
}
