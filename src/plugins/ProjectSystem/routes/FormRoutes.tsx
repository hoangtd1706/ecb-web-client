import React from 'react';
import {
  Switch,
  Route,
  useRouteMatch,
} from 'react-router-dom';

import BillForms from '../pages/BillForms';

export default function FormRoutes(): JSX.Element {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route path={`${path}/boq`} component={BillForms} />
    </Switch>
  );
}
