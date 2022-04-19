import React from 'react';
import {
  Switch,
  Route,
  useRouteMatch,
} from 'react-router-dom';

import CreatePackage from '../pages/CreatePackage';
import Packages from '../pages/Packages';
import PackageDetail from '../pages/PackageDetail';

export default function ExpertRoutes(): JSX.Element {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route path={`${path}/create-package`} component={CreatePackage} />
      <Route path={`${path}/package-list/:status`} component={Packages} />
      <Route path={`${path}/package/:packageCode`} component={PackageDetail} />
    </Switch>
  );
}
