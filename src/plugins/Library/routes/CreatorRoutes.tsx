import React from 'react';
import {
  Switch,
  Route,
  useRouteMatch,
} from 'react-router-dom';

import CreatePost from '../pages/CreatePost';

export default function CreatorRoutes(): JSX.Element {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route path={`${path}/create-post`} component={CreatePost} />
    </Switch>
  );
}
