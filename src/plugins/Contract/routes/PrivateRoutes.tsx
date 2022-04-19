import React from 'react';
import {
  Switch,
  Route,
  useRouteMatch,
} from 'react-router-dom';

import Creators from '../pages/Creators';
import Approvers from '../pages/Approvers';

export default function PrivateRoutes(): JSX.Element {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route path={`${path}/creators`} component={Creators} />
      <Route path={`${path}/approvers`} component={Approvers} />
    </Switch>
  );
}
