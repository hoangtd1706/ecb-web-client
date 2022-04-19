import React from 'react';
import {
  Route,
  Switch,
  useRouteMatch,
} from 'react-router-dom';

import Employees from '../pages/Employees';

export default function PublicRoutes(): JSX.Element {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route path={`${path}/employees`} component={Employees} />
    </Switch>
  );
}
