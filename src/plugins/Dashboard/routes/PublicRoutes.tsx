import React from 'react';
import {
  Route,
  Switch,
  useRouteMatch,
} from 'react-router-dom';

import About from '../pages/About';
import ChangePassword from '../pages/ChangePassword';

export default function PublicRoutes(): JSX.Element {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Switch>
        <Route exact path={`${path}`} component={About} />
        <Route path={`${path}change-password`} component={ChangePassword} />
      </Switch>
    </Switch>
  );
}
