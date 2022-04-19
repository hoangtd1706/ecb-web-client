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
  checkRolePermission,

  menuList,
  adminMenuList,
  expertMenuList,
  auditorMenuList,
} from './configs';

const PrivateRoutes = React.lazy(() => import('./routes/PrivateRoutes'));
import PublicRoutes from './routes/PublicRoutes';

const ExpertRoutes = React.lazy(() => import('./routes/ExpertRoutes'));
const AuditorRoutes = React.lazy(() => import('./routes/AuditorRoutes'));

export default function Main(): JSX.Element {
  const { path } = useRouteMatch();
  const dispatch: AppDispatch = useDispatch();

  const [isAdmin, setIsAdmin] = React.useState(false);
  const [isExpert, setIsExpert] = React.useState(false);
  const [isAuditor, setIsAuditor] = React.useState(false);

  React.useEffect(() => {
    dispatch(layoutActions.setActivePluginId(plugin.id));
    checkAdmin()
      .then((result) => {
        setIsAdmin(result);
      })
      .catch(() => {
        setIsAdmin(false);
      });

    checkRolePermission('EXPERT_ROLE')
      .then((result) => {
        setIsExpert(result);
      })
      .catch(() => {
        setIsExpert(false);
      });

    checkRolePermission('AUDITOR_ROLE')
      .then((result) => {
        setIsAuditor(result);
      })
      .catch(() => {
        setIsAuditor(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    const adminList = isAdmin ? [...adminMenuList] : [];
    const expertList = isExpert ? [...expertMenuList] : [];
    const auditorList = isAuditor ? [...auditorMenuList] : [];
    dispatch(layoutActions.setMenuList([
      ...menuList,
      ...expertList,
      ...auditorList,
      ...adminList,
    ]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin, isExpert, isAuditor]);

  return (
    <Switch>
      {isExpert && <Route path={`${path}/expert`} component={ExpertRoutes} />}
      {isAuditor && <Route path={`${path}/auditor`} component={AuditorRoutes} />}
      {isAdmin && <Route path={`${path}/admin`} component={PrivateRoutes} />}
      <Route path={`${path}`} component={PublicRoutes} />
    </Switch>
  );
}
