import React from 'react';
import {
  Switch,
  Route,
  useRouteMatch,
} from 'react-router-dom';
import { useDispatch } from 'react-redux';

import {
  AppDispatch,
  layoutActions,
} from '../../core';

import {
  plugin,
  checkAdmin,

  menuList,
  adminMenuList,
} from './configs';

const PrivateRoutes = React.lazy(() => import('./routes/PrivateRoutes'));
import PublicRoutes from './routes/PublicRoutes';

export default function Main(): JSX.Element {
  const { path } = useRouteMatch();
  const dispatch: AppDispatch = useDispatch();

  const [isAdmin, setIsAdmin] = React.useState(false);

  React.useEffect(() => {
    dispatch(layoutActions.setActivePluginId(plugin.id));
    checkAdmin()
      .then((result) => {
        setIsAdmin(result);
      })
      .catch(() => {
        setIsAdmin(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    const adminList = isAdmin ? [...adminMenuList] : [];
    dispatch(layoutActions.setMenuList([
      ...menuList,
      ...adminList,
    ]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin]);

  return (
    <Switch>
      {isAdmin && <Route path={`${path}/admin`} component={PrivateRoutes} />}
      <Route path={`${path}`} component={PublicRoutes} />
    </Switch>
  );
}
