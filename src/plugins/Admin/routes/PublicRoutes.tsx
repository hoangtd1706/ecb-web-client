import React from 'react';
import {
  Route,
  Switch,
  useRouteMatch,
} from 'react-router-dom';

import Moderators from '../pages/Moderators';
import Email from '../pages/Email';
import RPE from '../pages/RPE';
import SapConnection from '../pages/SapConnection';

import BiddingEmail from '../pages/BiddingEmail';
import BiddingRPE from '../pages/BiddingRPE';

export default function PublicRoutes(): JSX.Element {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route path={`${path}/moderators/:moduleName`} component={Moderators} />

      <Route path={`${path}/email`} component={Email} />
      <Route path={`${path}/reset-password-email`} component={RPE} />
      <Route path={`${path}/sap-connection`} component={SapConnection} />

      <Route path={`${path}/bidding-email`} component={BiddingEmail} />
      <Route path={`${path}/bidding-reset-password-email`} component={BiddingRPE} />
    </Switch>
  );
}
