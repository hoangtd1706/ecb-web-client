import React from 'react';
import {
  Route,
  Switch,
  useRouteMatch,
} from 'react-router-dom';

import Dashboard from '../pages/Dashboard';
import Efm01 from '../pages/Efm01';
import Efm02 from '../pages/Efm02';
import Efm03 from '../pages/Efm03';
import Efm04 from '../pages/Efm04';
import Efm05 from '../pages/Efm05';
import Efm06 from '../pages/Efm06';
import Efm07 from '../pages/Efm07';
import Efm08 from '../pages/Efm08';
import Efm09 from '../pages/Efm09';
import Enterprise from '../pages/Enterprise';
import Pfm from '../pages/Pfm';

export default function PublicRoutes(): JSX.Element {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route path={`${path}/dashboard`} component={Dashboard} />
      <Route path={`${path}/enterprise`} component={Enterprise} />
      <Route path={`${path}/efm01`} component={Efm01} />
      <Route path={`${path}/efm02`} component={Efm02} />
      <Route path={`${path}/efm03`} component={Efm03} />
      <Route path={`${path}/efm04`} component={Efm04} />
      <Route path={`${path}/efm05`} component={Efm05} />
      <Route path={`${path}/efm06`} component={Efm06} />
      <Route path={`${path}/efm07`} component={Efm07} />
      <Route path={`${path}/efm08`} component={Efm08} />
      <Route path={`${path}/efm09`} component={Efm09} />
      <Route exact path={`${path}/pfm`} component={Pfm} />
    </Switch>
  );
}
