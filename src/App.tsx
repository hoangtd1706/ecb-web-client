import React from "react";
import { Route, Switch } from "react-router-dom";

import {
  askUserPermission,
  isPushNotificationSupported,
  userConsent,
} from "./configs/notification";
import Login from "./pages/Login";

import Private from "./Private";

// eslint-disable-next-line @typescript-eslint/no-var-requires
require("dotenv").config();

export default function App(): JSX.Element {
  React.useEffect(() => {
    if (isPushNotificationSupported && userConsent !== "granted") {
      askUserPermission();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/" component={Private} />
    </Switch>
  );
}
