import React from 'react';
import {
  Switch,
  Route,
  useRouteMatch,
} from 'react-router-dom';

import Planners from '../pages/Planners';
import Designers from '../pages/Designers';
import Estimators from '../pages/Estimators';
import Supervisors from '../pages/Supervisors';
import Forms from '../pages/Forms';

export default function PrivateRoutes(): JSX.Element {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route path={`${path}/planners`} component={Planners} />
      <Route path={`${path}/designers`} component={Designers} />
      <Route path={`${path}/estimators`} component={Estimators} />
      <Route path={`${path}/supervisors`} component={Supervisors} />
      <Route path={`${path}/forms`} component={Forms} />
    </Switch>
  );
}
