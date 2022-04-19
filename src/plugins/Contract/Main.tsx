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
  creatorMenuList,
  approverMenuList,
} from './configs';

const PrivateRoutes = React.lazy(() => import('./routes/PrivateRoutes'));
import PublicRoutes from './routes/PublicRoutes';

const CreatorRoutes = React.lazy(() => import('./routes/CreatorRoutes'));
const ApproverRoutes = React.lazy(() => import('./routes/ApproverRoutes'));

export default function Main(): JSX.Element {
  const { path } = useRouteMatch();
  const dispatch: AppDispatch = useDispatch();

  const [isAdmin, setIsAdmin] = React.useState(false);
  const [isCreator, setIsCreator] = React.useState(false);
  const [isApprover, setIsApprover] = React.useState(false);

  React.useEffect(() => {
    dispatch(layoutActions.setActivePluginId(plugin.id));
    checkAdmin()
      .then((result) => {
        setIsAdmin(result);
      })
      .catch(() => {
        setIsAdmin(false);
      });

    checkRolePermission('CREATOR_ROLE')
      .then((result) => {
        setIsCreator(result);
      })
      .catch(() => {
        setIsCreator(false);
      });

    checkRolePermission('APPROVER_ROLE')
      .then((result) => {
        setIsApprover(result);
      })
      .catch(() => {
        setIsApprover(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    const adminList = isAdmin ? [...adminMenuList] : [];
    const creatorList = isCreator ? [...creatorMenuList] : [];
    const approverList = isApprover ? [...approverMenuList] : [];
    dispatch(layoutActions.setMenuList([
      ...menuList,
      ...creatorList,
      ...approverList,
      ...adminList,
    ]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin, isCreator, isApprover]);

  return (
    <Switch>
      {isCreator && <Route path={`${path}/creator`} component={CreatorRoutes} />}
      {isApprover && <Route path={`${path}/approver`} component={ApproverRoutes} />}
      {isAdmin && <Route path={`${path}/admin`} component={PrivateRoutes} />}
      <Route path={`${path}`} component={PublicRoutes} />
    </Switch>
  );
}
