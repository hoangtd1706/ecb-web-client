import React from 'react';
import { Route } from 'react-router-dom';

import { PluginRender } from '../types';
const Main = React.lazy(() => import('./Main'));
import { plugin, checkPermission } from './configs';

export default function render(): Promise<PluginRender> {
  return new Promise<PluginRender>((resolve, reject) => {
    checkPermission()
      .then((result) => {
        if (result) {
          resolve({
            plugin: plugin,
            content: {
              routeOrder: plugin.routeOrder,
              element: <Route key={plugin.id} path={plugin.route} component={() => (
                <React.Suspense fallback={<></>}>
                  <Main />
                </React.Suspense>
              )} />,
            },
          })
        }
        else {
          reject();
        }
      })
      .catch(() => {
        reject();
      });
  });
}