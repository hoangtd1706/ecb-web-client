import React from 'react';
import {
  Switch,
  Route,
  useRouteMatch,
} from 'react-router-dom';

import Clusters from '../pages/Clusters';
import DesignerCommits from '../pages/DesignerCommits';
import DesignerVersions from '../pages/DesignerVersions';
import ElementClusters from '../pages/ElementClusters';
import Items from '../pages/Items';
import VersionClusters from '../pages/VersionClusters';

export default function DesignerRoutes(): JSX.Element {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route path={`${path}/clusters`} component={Clusters} />
      <Route path={`${path}/element-clusters`} component={ElementClusters} />
      <Route path={`${path}/items`} component={Items} />
      <Route path={`${path}/commits`} component={DesignerCommits} />
      <Route path={`${path}/versions`} component={DesignerVersions} />
      <Route path={`${path}/version-data/clusters/:projectCode/:versionNumber`} component={VersionClusters} />
    </Switch>
  );
}
