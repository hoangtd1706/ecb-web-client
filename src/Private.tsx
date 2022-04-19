import React from "react";
import { useDispatch } from "react-redux";
import { Route, Switch, useLocation } from "react-router-dom";

import { Verifying, Alert, Backdrop } from "@nvdunginest/emis-mui";

import {
  useTypedSelector,
  AppDispatch,
  authActions,
  alertActions,
  layoutActions,
  PluginModel,
  ContentModel,
} from "./core";

import PluginBundle from "./PluginBundle";
import plugins from "./plugins";
import { useIsAuthenticated, useMsal } from "@azure/msal-react";
import { loginRequest } from "./configs/auzre";
import history from "./configs/history";

export default function Private(): JSX.Element {
  const { instance, accounts } = useMsal();
  const { alert, auth, loading } = useTypedSelector((s) => s);
  const dispatch: AppDispatch = useDispatch();
  const location = useLocation();
  const isAuthenticaed = useIsAuthenticated();

  React.useEffect(() => {
    localStorage.setItem("returnUrl", location.pathname);
    if (isAuthenticaed) {
      instance
        .acquireTokenSilent({
          ...loginRequest,
          account: accounts[0],
        })
        .then((response) => {
          if (response.account?.username != null) {
            dispatch(
              authActions.verify(
                response.accessToken,
                response.account?.username,
                response.account?.homeAccountId
              )
            );
          }
        });
    } else {
      history.push("/login");
    }
  }, [isAuthenticaed]);

  React.useEffect(() => {
    if (auth.user !== null) {
      dispatch(layoutActions.setPluginList([]));
      const pluginList: PluginModel[] = [];
      const contentList: ContentModel[] = [];
      plugins.map(async (promise) => {
        try {
          const render = await promise();
          pluginList.push(render.plugin);
          contentList.push(render.content);
          dispatch(layoutActions.setPluginList(pluginList));
          dispatch(layoutActions.setContentList(contentList));
          return true;
        } catch {
          return false;
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth.user]);

  return auth.isVerifying ? (
    <Verifying />
  ) : (
    <>
      <Switch>
        <Route path="/" component={PluginBundle} />
      </Switch>
      <Alert
        text={alert.text}
        severity={alert.severity}
        show={alert.show}
        onClose={() => {
          dispatch(alertActions.hide());
        }}
      />
      <Backdrop show={loading} />
    </>
  );
}
