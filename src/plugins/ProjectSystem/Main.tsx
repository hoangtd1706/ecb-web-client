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
  plannerMenuList,
  designerMenuList,
  estimatorMenuList,
  supervisorMenuList,
  formMenuList,
} from './configs';

const PrivateRoutes = React.lazy(() => import('./routes/PrivateRoutes'));
import PublicRoutes from './routes/PublicRoutes';

const PlannerRoutes = React.lazy(() => import('./routes/PlannerRoutes'));
const DesignerRoutes = React.lazy(() => import('./routes/DesignerRoutes'));
const EstimatorRoutes = React.lazy(() => import('./routes/EstimatorRoutes'));
const SupervisorRoutes = React.lazy(() => import('./routes/SupervisorRoutes'));
const FormRoutes = React.lazy(() => import('./routes/FormRoutes'));

export default function Main(): JSX.Element {
  const { path } = useRouteMatch();
  const dispatch: AppDispatch = useDispatch();

  const [isAdmin, setIsAdmin] = React.useState(false);
  const [isPlanner, setIsPlanner] = React.useState(false);
  const [isDesigner, setIsDesigner] = React.useState(false);
  const [isEstimator, setIsEstimator] = React.useState(false);
  const [isSupervisor, setIsSupervisor] = React.useState(false);
  const [isForm, setIsForm] = React.useState(false);

  React.useEffect(() => {
    dispatch(layoutActions.setActivePluginId(plugin.id));
    checkAdmin()
      .then((result) => {
        setIsAdmin(result);
      })
      .catch(() => {
        setIsAdmin(false);
      });

    checkRolePermission('PLANNER_ROLE')
      .then((result) => {
        setIsPlanner(result);
      })
      .catch(() => {
        setIsPlanner(false);
      });

    checkRolePermission('DESIGNER_ROLE')
      .then((result) => {
        setIsDesigner(result);
      })
      .catch(() => {
        setIsDesigner(false);
      });

    checkRolePermission('ESTIMATOR_ROLE')
      .then((result) => {
        setIsEstimator(result);
      })
      .catch(() => {
        setIsEstimator(false);
      });

    checkRolePermission('SUPERVISOR_ROLE')
      .then((result) => {
        setIsSupervisor(result);
      })
      .catch(() => {
        setIsSupervisor(false);
      });

    checkRolePermission('FORM_ROLE')
      .then((result) => {
        setIsForm(result);
      })
      .catch(() => {
        setIsForm(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    const adminList = isAdmin ? [...adminMenuList] : [];
    const plannerList = isPlanner ? [...plannerMenuList] : [];
    const designerList = isDesigner ? [...designerMenuList] : [];
    const estimatorList = isEstimator ? [...estimatorMenuList] : [];
    const supervisorList = isSupervisor ? [...supervisorMenuList] : [];
    const formList = isForm ? [...formMenuList] : [];
    dispatch(layoutActions.setMenuList([
      ...menuList,
      ...plannerList,
      ...designerList,
      ...estimatorList,
      ...supervisorList,
      ...formList,
      ...adminList,
    ]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin, isPlanner, isDesigner, isEstimator, isSupervisor, isForm]);

  return (
    <Switch>
      {isPlanner && <Route path={`${path}/planner`} component={PlannerRoutes} />}
      {isDesigner && <Route path={`${path}/designer`} component={DesignerRoutes} />}
      {isEstimator && <Route path={`${path}/estimator`} component={EstimatorRoutes} />}
      {isSupervisor && <Route path={`${path}/supervisor`} component={SupervisorRoutes} />}
      {isForm && <Route path={`${path}/form`} component={FormRoutes} />}
      {isAdmin && <Route path={`${path}/admin`} component={PrivateRoutes} />}
      <Route path={`${path}`} component={PublicRoutes} />
    </Switch>
  );
}
