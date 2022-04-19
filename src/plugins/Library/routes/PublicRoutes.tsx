import React from 'react';
import {
  Route,
  Switch,
  useRouteMatch,
} from 'react-router-dom';

import Dashboard from '../pages/Dashboard';
import PostView from '../pages/PostView';

export default function PublicRoutes(): JSX.Element {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route path={`${path}/dashboard`} component={Dashboard} />
      <Route path={`${path}/posts/:postId`} component={PostView} />
    </Switch>
  );
}
