import React from 'react';
import {
  Switch,
  Route,
  useRouteMatch,
} from 'react-router-dom';

import Experts from '../pages/Experts';
import Auditors from '../pages/Auditors';
import Materials from '../pages/Materials';
import Vendors from '../pages/Vendors';
import VendorDetail from '../pages/VendorDetail';

export default function PrivateRoutes(): JSX.Element {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route path={`${path}/experts`} component={Experts} />
      <Route path={`${path}/auditors`} component={Auditors} />
      <Route path={`${path}/materials`} component={Materials} />
      <Route path={`${path}/vendors/list/:filter`} component={Vendors} />
      <Route path={`${path}/vendors/detail/:code`} component={VendorDetail} />
    </Switch>
  );
}
