import React from "react";
import { CssBaseline } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { grey } from "@material-ui/core/colors";

import { drawerWidth } from "./types";
import LayoutProvider from "./LayoutProvider";
import AppBar from "./AppBar";
import SideMenu from "./SideMenu";
import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
} from "@azure/msal-react";
import Login from "../../pages/Login";

const useStyles = makeStyles((theme) => ({
  content: {
    flexGrow: 1,
    height: "100vh",
  },
  toolbar: theme.mixins.toolbar,
  main: {
    height: "calc(100% - 48px)",
    padding: theme.spacing(1),
    overflowX: "hidden",
    backgroundColor: grey[100],
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(7) + 1,
    },
    [theme.breakpoints.up("lg")]: {
      marginLeft: drawerWidth,
    },
    [theme.breakpoints.down("xs")]: {
      padding: 0,
      margin: 0,
    },
  },
}));

type LayoutProps = {
  children: JSX.Element | JSX.Element[];
};

export default function Layout({ children }: LayoutProps): JSX.Element {
  const classes = useStyles();
  return (
    <div>
      <AuthenticatedTemplate>
        <CssBaseline />
        <LayoutProvider>
          <AppBar />
          <SideMenu />
        </LayoutProvider>
        <main className={classes.content}>
          <div className={classes.toolbar} />
          <div className={classes.main}>{children}</div>
        </main>
      </AuthenticatedTemplate>
      <UnauthenticatedTemplate>
        <Login />
      </UnauthenticatedTemplate>
    </div>
  );
}
